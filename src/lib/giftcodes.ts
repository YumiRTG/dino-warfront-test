import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import { ensureAnonymousAuth, PLAYERS_COLLECTION } from '@/lib/firebaseAccounts'

/**
 * Gift code redemption from the website.
 *
 * No Cloud Functions involved, so nothing here is trusted with a reward value.
 * The site only writes a marker document; the reward itself lives in
 * `giftcodes/{CODE}`, which no client may write. The game reads the marker,
 * looks the reward up itself and grants it. See GiftCodeService.cs.
 */

const CODES = 'giftcodes'
const REDEMPTIONS = 'redemptions'

export type RewardMap = Record<string, number>

export type RedeemOutcome =
  | { ok: true; rewards: RewardMap; note?: string }
  | { ok: false; error: string }

export const REWARD_LABEL: Record<string, string> = {
  food: 'Food',
  wood: 'Wood',
  iron: 'Iron',
  oil: 'Oil',
  amber: 'Amber',
}

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase()
}

function readRewards(data: Record<string, unknown>): RewardMap {
  const raw = data.rewards
  if (!raw || typeof raw !== 'object') return {}
  const out: RewardMap = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const n = typeof v === 'number' ? v : Number(v)
    if (Number.isFinite(n) && n > 0) out[k.toLowerCase()] = n
  }
  return out
}

export async function redeemCode(accountId: string, rawCode: string): Promise<RedeemOutcome> {
  const uid = accountId.trim()
  const code = normalizeCode(rawCode)

  if (!uid) return { ok: false, error: 'Enter your Account ID. You will find it in the game under Settings.' }
  if (code.length < 3) return { ok: false, error: 'That does not look like a gift code.' }

  try {
    await ensureAnonymousAuth()
    const { db } = getFirebase()

    // The account has to exist, otherwise a typo silently redeems into nothing.
    const player = await getDoc(doc(db, PLAYERS_COLLECTION, uid))
    if (!player.exists()) {
      return { ok: false, error: 'No commander found with that Account ID. Check it in the game under Settings.' }
    }

    const codeSnap = await getDoc(doc(db, CODES, code))
    if (!codeSnap.exists()) return { ok: false, error: 'That code does not exist.' }

    const data = codeSnap.data() as Record<string, unknown>
    if (data.active === false) return { ok: false, error: 'That code is no longer valid.' }

    const expires = data.expiresAt as Timestamp | undefined
    if (expires?.toMillis && expires.toMillis() < Date.now()) {
      return { ok: false, error: 'That code has expired.' }
    }

    const markRef = doc(db, PLAYERS_COLLECTION, uid, REDEMPTIONS, code)
    const existing = await getDoc(markRef)
    if (existing.exists()) {
      const granted = (existing.data() as Record<string, unknown>).granted === true
      return {
        ok: false,
        error: granted
          ? 'This code has already been redeemed on that account.'
          : 'This code is already waiting to be collected. Open the game to claim it.',
      }
    }

    // Marker only. No reward values are written from the browser.
    await setDoc(markRef, {
      code,
      createdAt: Timestamp.now(),
      granted: false,
      source: 'web',
    })

    return {
      ok: true,
      rewards: readRewards(data),
      note: typeof data.note === 'string' && data.note.trim() ? data.note.trim() : undefined,
    }
  } catch (err) {
    const code2 = (err as { code?: string })?.code ?? ''
    if (code2.includes('permission-denied')) {
      return { ok: false, error: 'Redemption is not enabled yet. Try again later.' }
    }
    return { ok: false, error: 'Something went wrong. Try again in a moment.' }
  }
}
