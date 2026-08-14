const STORAGE_KEY = 'dino_dominion_auth'

export type AuthSession = {
  accountId: string
  displayName: string
  loggedInAt: string
  firebaseUid?: string
  source?: 'local' | 'firebase'
  /** Optional game stats from players/{id} */
  powerScore?: number
}

/**
 * Account ID = Firebase User ID from the game (players/{userId}).
 * Do NOT force uppercase — Firebase UIDs are case-sensitive.
 */
export function normalizeAccountId(raw: string): string {
  return raw.trim()
}

export function isValidAccountId(id: string): boolean {
  // Firebase UIDs are typically ~28 alphanumeric chars; allow a safe range
  return /^[A-Za-z0-9_-]{6,128}$/.test(id)
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as AuthSession
    if (!data?.accountId || !isValidAccountId(normalizeAccountId(data.accountId))) {
      return null
    }
    return {
      accountId: normalizeAccountId(data.accountId),
      displayName: (data.displayName || 'Commander').trim().slice(0, 48),
      loggedInAt: data.loggedInAt || new Date().toISOString(),
      firebaseUid: data.firebaseUid,
      source: data.source || 'firebase',
      powerScore: typeof data.powerScore === 'number' ? data.powerScore : undefined,
    }
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
