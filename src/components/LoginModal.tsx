import { useEffect, useId, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, session, busy } = useAuth()
  const [accountId, setAccountId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    setError('')
    setSuccess('')
    setAccountId(session?.accountId || '')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, session, busy])

  if (!open) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const result = await login(accountId)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setAccountId(result.accountId)
    setSuccess(`Welcome, ${result.displayName}`)
    setTimeout(onClose, 700)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 border-none cursor-pointer"
        style={{ background: 'rgba(7,6,10,0.88)', backdropFilter: 'blur(12px)' }}
        aria-label="Close login"
        onClick={() => !busy && onClose()}
      />

      <div className="relative w-full max-w-[420px] dd-panel overflow-hidden">
        <div className="px-6 pt-7 pb-5 border-b border-[var(--gold)]/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">Account</p>
              <h2 id={titleId} className="font-display text-3xl tracking-wide text-white">
                LOG IN
              </h2>
              <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                Enter your Account ID from the game.
              </p>
            </div>
            <button
              type="button"
              onClick={() => !busy && onClose()}
              className="text-[var(--bone-dim)] hover:text-white bg-transparent border-none cursor-pointer text-2xl leading-none p-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="label-text block mb-2" htmlFor="account-id">
              Account ID
            </label>
            <input
              id="account-id"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value.trim())}
              placeholder="Account ID"
              maxLength={128}
              required
              disabled={busy}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 font-ui text-[#f0e6d0] tracking-[0.06em] outline-none focus:border-[#e9b44c]/60 transition-colors disabled:opacity-60"
              autoComplete="username"
              spellCheck={false}
            />
            <p className="font-body text-[#c4b89a]/55 text-xs mt-2 leading-relaxed">
              This is your Account player ID from the game. You can find it in the settings.
            </p>
          </div>

          {error && (
            <p className="font-body text-sm text-[#ff8a65] bg-[#e85d04]/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="font-body text-sm text-[#e9b44c] bg-[#e9b44c]/10 rounded-xl px-3 py-2">
              {success}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
