import {
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import {
  isValidAccountId,
  normalizeAccountId,
  type AuthSession,
} from '@/lib/auth'

/** Same collection as the Unity game (SaveSystem / FriendService). */
export const PLAYERS_COLLECTION = 'players'

let authReady: Promise<User> | null = null

/** Anonymous Firebase session so Firestore rules that require request.auth work. */
export function ensureAnonymousAuth(): Promise<User> {
  if (authReady) return authReady

  const { auth } = getFirebase()

  authReady = new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub()
      try {
        if (user) {
          resolve(user)
          return
        }
        const cred = await signInAnonymously(auth)
        resolve(cred.user)
      } catch (err) {
        authReady = null
        reject(err)
      }
    })
  })

  return authReady
}

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code || ''
  const msg = (err as { message?: string })?.message || String(err)

  if (code.includes('permission-denied') || msg.includes('permission')) {
    return 'Login failed (permission denied). Try again later.'
  }
  if (code.includes('unavailable') || msg.includes('network')) {
    return 'Network error — check your connection and try again.'
  }
  if (code.includes('admin-restricted-operation') || code.includes('operation-not-allowed')) {
    return 'Login is temporarily unavailable.'
  }
  return 'Login failed. Check your Account ID and try again.'
}

function pickDisplayName(data: Record<string, unknown> | undefined): string {
  const raw =
    (typeof data?.displayName === 'string' && data.displayName) ||
    (typeof data?.name === 'string' && data.name) ||
    (typeof data?.playerName === 'string' && data.playerName) ||
    ''
  const name = raw.trim()
  return name || 'Commander'
}

function pickPower(data: Record<string, unknown> | undefined): number | undefined {
  const v = data?.powerScore ?? data?.totalScore
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  return undefined
}

/**
 * Log in with the game's Account ID (Firebase User ID).
 *
 * Account ID login is intentionally a single direct document lookup. The old
 * display-name fallback issued a second collection query after every mistyped
 * or unknown ID even though the form only accepts Account IDs. Removing that
 * fallback keeps failed logins to one Firestore document read at most.
 */
export async function loginWithAccountId(
  rawAccountId: string
): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const accountId = normalizeAccountId(rawAccountId)
  if (!isValidAccountId(accountId)) {
    return {
      ok: false,
      error: 'Enter a valid Account ID (your game player ID, usually 20–30 characters).',
    }
  }

  try {
    await ensureAnonymousAuth()
    const { db } = getFirebase()
    const snap = await getDoc(doc(db, PLAYERS_COLLECTION, accountId))

    if (!snap.exists()) {
      return {
        ok: false,
        error: 'Account not found. Check your Account ID from the game.',
      }
    }

    const data = snap.data() as Record<string, unknown>
    const session: AuthSession = {
      accountId,
      displayName: pickDisplayName(data),
      loggedInAt: new Date().toISOString(),
      firebaseUid: accountId,
      source: 'firebase',
      powerScore: pickPower(data),
    }
    return { ok: true, session }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}
