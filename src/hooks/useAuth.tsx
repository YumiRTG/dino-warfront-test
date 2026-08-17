import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  loadSession,
  saveSession,
  type AuthSession,
} from '@/lib/auth'
import { loginWithAccountId } from '@/lib/firebaseAccounts'

type AuthResult =
  | { ok: true; accountId: string; displayName: string; powerScore?: number }
  | { ok: false; error: string }

type AuthContextValue = {
  session: AuthSession | null
  ready: boolean
  busy: boolean
  login: (accountId: string) => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // A returning visitor can render from the locally stored session immediately.
    // Firebase anonymous auth is now started only when a feature actually needs
    // Firestore, avoiding an unnecessary auth/network handshake for pure visitors.
    setSession(loadSession())
    setReady(true)
  }, [])

  const login = useCallback(async (accountId: string) => {
    setBusy(true)
    try {
      const result = await loginWithAccountId(accountId)
      if (!result.ok) return result
      saveSession(result.session)
      setSession(result.session)
      return {
        ok: true as const,
        accountId: result.session.accountId,
        displayName: result.session.displayName,
        powerScore: result.session.powerScore,
      }
    } finally {
      setBusy(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, ready, busy, login, logout }),
    [session, ready, busy, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
