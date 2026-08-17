import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ensureAnonymousAuth } from '@/lib/firebaseAccounts'
import { getFirebase } from '@/lib/firebase'
import { SPIN_COOLDOWN_MS, type RoulettePrize } from '@/lib/roulette'
import {
  DAILY_LOGIN_REWARDS,
  msUntilNextUtcMidnight,
  previousUtcDateKey,
  rewardForStreakDay,
  utcDateKey,
  type DailyLoginReward,
} from '@/lib/dailyLogin'

/** Pending rewards claimed by the Unity game via WebRewardService */
export const WEB_REWARDS_ROOT = 'webRewards'
export const WEB_SPINS_ROOT = 'webRouletteSpins'
export const WEB_DAILY_LOGIN_ROOT = 'webDailyLogin'

const STATUS_CACHE_MS = 5 * 60 * 1000
const cacheKey = (kind: string, accountId: string) => `dw_${kind}_${accountId}`

type CachedSpin = { at: number; lastSpinAt: number | null }
type CachedDaily = { at: number; lastClaimDate: string | null; streak: number }

function readSessionCache<T extends { at: number }>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as T
    if (!parsed?.at || Date.now() - parsed.at > STATUS_CACHE_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeSessionCache(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private browsing/full quota: server state remains authoritative.
  }
}

function timestampMs(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (value && typeof (value as { seconds?: number }).seconds === 'number') {
    return (value as { seconds: number }).seconds * 1000
  }
  return 0
}

export type SpinStatus = {
  canSpin: boolean
  lastSpinAt: number | null
  nextSpinAt: number | null
  msRemaining: number
}

function spinStatusFromLast(lastMs: number | null, now = Date.now()): SpinStatus {
  if (!lastMs) return { canSpin: true, lastSpinAt: null, nextSpinAt: null, msRemaining: 0 }
  const next = lastMs + SPIN_COOLDOWN_MS
  const msRemaining = Math.max(0, next - now)
  return {
    canSpin: msRemaining <= 0,
    lastSpinAt: lastMs,
    nextSpinAt: next,
    msRemaining,
  }
}

export async function getSpinStatus(accountId: string): Promise<SpinStatus> {
  const key = cacheKey('spin', accountId)
  const cached = readSessionCache<CachedSpin>(key)
  if (cached) return spinStatusFromLast(cached.lastSpinAt)

  await ensureAnonymousAuth()
  const { db } = getFirebase()
  const snap = await getDoc(doc(db, WEB_SPINS_ROOT, accountId))
  const lastSpinAt = snap.exists() ? timestampMs(snap.data().lastSpinAt) || null : null

  writeSessionCache(key, { at: Date.now(), lastSpinAt } satisfies CachedSpin)
  return spinStatusFromLast(lastSpinAt)
}

/**
 * Records a roulette win atomically.
 *
 * One transaction read checks the cooldown and obtains totalSpins. Previously
 * this path read the same spin document twice (once in getSpinStatus and once
 * again for totalSpins), which doubled reads and still allowed race conditions.
 */
export async function grantRouletteReward(
  accountId: string,
  prize: RoulettePrize
): Promise<{ ok: true; rewardId: string } | { ok: false; error: string }> {
  try {
    await ensureAnonymousAuth()
    const { db } = getFirebase()
    const spinRef = doc(db, WEB_SPINS_ROOT, accountId)
    const rewardRef = doc(collection(db, WEB_REWARDS_ROOT, accountId, 'items'))

    await runTransaction(db, async (tx) => {
      const spinSnap = await tx.get(spinRef)
      const data = spinSnap.exists() ? spinSnap.data() : undefined
      const lastMs = timestampMs(data?.lastSpinAt)
      const status = spinStatusFromLast(lastMs || null)
      if (!status.canSpin) throw new Error('DW_SPIN_COOLDOWN')

      const prevTotal = typeof data?.totalSpins === 'number' ? data.totalSpins : 0

      tx.set(rewardRef, {
        itemType: prize.itemType,
        amount: prize.amount,
        label: prize.label,
        sublabel: prize.sublabel,
        source: 'roulette',
        claimed: false,
        createdAt: serverTimestamp(),
      })

      tx.set(
        spinRef,
        {
          lastSpinAt: serverTimestamp(),
          lastPrizeId: prize.id,
          lastRewardId: rewardRef.id,
          totalSpins: prevTotal + 1,
        },
        { merge: true }
      )
    })

    writeSessionCache(cacheKey('spin', accountId), {
      at: Date.now(),
      lastSpinAt: Date.now(),
    } satisfies CachedSpin)

    return { ok: true, rewardId: rewardRef.id }
  } catch (err) {
    const msg = (err as { message?: string })?.message || 'Could not save reward.'
    if (msg.includes('DW_SPIN_COOLDOWN')) {
      try { sessionStorage.removeItem(cacheKey('spin', accountId)) } catch {}
      return { ok: false, error: 'Next free spin is not ready yet.' }
    }
    if (msg.includes('permission')) {
      return {
        ok: false,
        error: 'Could not save reward (permission denied). Check Firestore rules for webRewards.',
      }
    }
    return { ok: false, error: msg }
  }
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ready'
  const s = Math.ceil(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

export type DailyLoginStatus = {
  canClaim: boolean
  streak: number
  /** 1–7 day in the current cycle to claim next */
  nextDay: number
  lastClaimDate: string | null
  todayKey: string
  msUntilReset: number
  rewards: DailyLoginReward[]
  todaysReward: DailyLoginReward
}

function dailyStatusFromData(lastClaimDate: string | null, rawStreak: number): DailyLoginStatus {
  const today = utcDateKey()
  let streak = rawStreak
  const alreadyClaimedToday = lastClaimDate === today
  const claimedYesterday = lastClaimDate === previousUtcDateKey()

  if (!alreadyClaimedToday && !claimedYesterday && lastClaimDate) streak = 0

  const nextDay = (streak % DAILY_LOGIN_REWARDS.length) + 1
  return {
    canClaim: !alreadyClaimedToday,
    streak,
    nextDay,
    lastClaimDate,
    todayKey: today,
    msUntilReset: msUntilNextUtcMidnight(),
    rewards: DAILY_LOGIN_REWARDS,
    todaysReward: rewardForStreakDay(nextDay),
  }
}

export async function getDailyLoginStatus(accountId: string): Promise<DailyLoginStatus> {
  const key = cacheKey('daily', accountId)
  const cached = readSessionCache<CachedDaily>(key)
  if (cached) return dailyStatusFromData(cached.lastClaimDate, cached.streak)

  await ensureAnonymousAuth()
  const { db } = getFirebase()
  const snap = await getDoc(doc(db, WEB_DAILY_LOGIN_ROOT, accountId))
  const data = snap.exists() ? snap.data() : undefined
  const lastClaimDate = typeof data?.lastClaimDate === 'string' ? data.lastClaimDate : null
  const streak = typeof data?.streak === 'number' ? data.streak : 0

  writeSessionCache(key, { at: Date.now(), lastClaimDate, streak } satisfies CachedDaily)
  return dailyStatusFromData(lastClaimDate, streak)
}

/**
 * Claim daily login package atomically. The status document is read once inside
 * the transaction and reused for streak + totalClaims, replacing two reads on
 * every claim and preventing two tabs from claiming the same UTC day.
 */
export async function claimDailyLoginReward(
  accountId: string
): Promise<
  | { ok: true; reward: DailyLoginReward; streak: number }
  | { ok: false; error: string }
> {
  try {
    await ensureAnonymousAuth()
    const { db } = getFirebase()
    const loginRef = doc(db, WEB_DAILY_LOGIN_ROOT, accountId)
    const rewardRef = doc(collection(db, WEB_REWARDS_ROOT, accountId, 'items'))

    let claimedReward: DailyLoginReward | null = null
    let claimedStreak = 0

    await runTransaction(db, async (tx) => {
      const loginSnap = await tx.get(loginRef)
      const data = loginSnap.exists() ? loginSnap.data() : undefined
      const lastClaimDate = typeof data?.lastClaimDate === 'string' ? data.lastClaimDate : null
      const rawStreak = typeof data?.streak === 'number' ? data.streak : 0
      const status = dailyStatusFromData(lastClaimDate, rawStreak)

      if (!status.canClaim) throw new Error('DW_DAILY_CLAIMED')

      claimedStreak = status.streak + 1
      claimedReward = rewardForStreakDay(claimedStreak)
      const totalClaims = typeof data?.totalClaims === 'number' ? data.totalClaims + 1 : 1

      tx.set(rewardRef, {
        itemType: claimedReward.itemType,
        amount: claimedReward.amount,
        label: claimedReward.label,
        sublabel: claimedReward.sublabel,
        source: 'daily_login',
        day: claimedReward.day,
        claimed: false,
        createdAt: serverTimestamp(),
      })

      tx.set(
        loginRef,
        {
          lastClaimDate: utcDateKey(),
          streak: claimedStreak,
          totalClaims,
          lastRewardDay: claimedReward.day,
          lastRewardLabel: claimedReward.label,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    })

    if (!claimedReward) throw new Error('Could not determine daily reward.')

    writeSessionCache(cacheKey('daily', accountId), {
      at: Date.now(),
      lastClaimDate: utcDateKey(),
      streak: claimedStreak,
    } satisfies CachedDaily)

    return { ok: true, reward: claimedReward, streak: claimedStreak }
  } catch (err) {
    const msg = (err as { message?: string })?.message || 'Could not claim daily reward.'
    if (msg.includes('DW_DAILY_CLAIMED')) {
      try { sessionStorage.removeItem(cacheKey('daily', accountId)) } catch {}
      return { ok: false, error: 'Daily login already claimed today. Come back tomorrow.' }
    }
    if (msg.includes('permission')) {
      return {
        ok: false,
        error: 'Could not claim reward (permission denied). Check Firestore rules for webDailyLogin.',
      }
    }
    return { ok: false, error: msg }
  }
}
