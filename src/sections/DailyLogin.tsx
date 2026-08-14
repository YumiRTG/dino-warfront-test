import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  claimDailyLoginReward,
  formatCountdown,
  getDailyLoginStatus,
  type DailyLoginStatus,
} from '@/lib/firebaseRewards'

export default function DailyLogin() {
  const { session, ready } = useAuth()
  const [status, setStatus] = useState<DailyLoginStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [msReset, setMsReset] = useState(0)

  const refresh = useCallback(async () => {
    if (!session?.accountId) return
    setLoading(true)
    setError('')
    try {
      const s = await getDailyLoginStatus(session.accountId)
      setStatus(s)
      setMsReset(s.msUntilReset)
    } catch {
      setError('Could not load daily login status.')
    } finally {
      setLoading(false)
    }
  }, [session?.accountId])

  useEffect(() => {
    if (session?.accountId) refresh()
  }, [session?.accountId, refresh])

  useEffect(() => {
    if (!status || status.canClaim) return
    const t = window.setInterval(() => {
      setMsReset((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(t)
  }, [status?.canClaim, status])

  const claim = async () => {
    if (!session?.accountId || claiming || !status?.canClaim) return
    setClaiming(true)
    setError('')
    setSuccess('')
    const result = await claimDailyLoginReward(session.accountId)
    if (!result.ok) {
      setError(result.error)
      setClaiming(false)
      await refresh()
      return
    }
    setSuccess(
      `Day ${result.reward.day}: ${result.reward.label} — sent to your game. Streak: ${result.streak}.`
    )
    setClaiming(false)
    await refresh()
  }

  if (!ready || !session) {
    return (
      <section className="py-16 md:py-20 px-6 text-center">
        <p className="eyebrow">Login bonus</p>
        <h2 className="font-display text-3xl md:text-5xl text-white mt-3 uppercase">
          Daily login reward
        </h2>
        <p className="body-lg mt-4 max-w-md mx-auto">
          Log in with your Account ID every day for free speed ups.
        </p>
        <Link to="/play?login=1" className="btn-primary mt-8 inline-flex no-underline">
          Log in to claim
        </Link>
      </section>
    )
  }

  const streak = status?.streak ?? 0
  const nextDay = status?.nextDay ?? 1
  const canClaim = status?.canClaim ?? false
  const cycleProgress = streak > 0 ? ((streak - 1) % 7) + 1 : 0

  return (
    <section className="py-12 md:py-16 px-5 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow">Login bonus</p>
          <h2 className="font-display text-3xl md:text-5xl text-white mt-3 uppercase">
            Daily login
          </h2>
          <p className="body-lg mt-3">
            Welcome, <span className="text-[#e9b44c]">{session.displayName}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="glass-panel px-8 py-5 text-center min-w-[140px]">
            <p className="eyebrow !text-[0.6rem]">Streak</p>
            <p className="font-display text-4xl text-[#e9b44c] mt-1">{loading ? '…' : streak}</p>
          </div>
          <div className="glass-panel px-8 py-5 text-center min-w-[180px]">
            <p className="eyebrow !text-[0.6rem]">{canClaim ? "Today" : 'Next'}</p>
            <p className="font-display text-2xl text-white mt-1">
              {status?.todaysReward.label ?? '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
          {(status?.rewards ?? []).map((reward) => {
            const completed = reward.day <= cycleProgress
            const isToday = canClaim && reward.day === nextDay
            return (
              <div
                key={reward.day}
                className="rounded-xl px-3 py-4 text-center border"
                style={{
                  borderColor: isToday
                    ? 'rgba(232,93,4,0.6)'
                    : completed
                      ? 'rgba(233,180,76,0.35)'
                      : 'rgba(255,255,255,0.08)',
                  background: isToday
                    ? 'rgba(232,93,4,0.12)'
                    : completed
                      ? 'rgba(233,180,76,0.08)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <p className="font-ui text-[10px] tracking-widest uppercase text-[#c4b89a]/70">
                  Day {reward.day}
                </p>
                <p className="font-ui text-sm text-white mt-2 tracking-wide leading-tight">
                  {reward.label}
                </p>
                {completed && (
                  <p className="font-ui text-[10px] text-[#e9b44c] mt-2 tracking-wider">DONE</p>
                )}
                {isToday && (
                  <p className="font-ui text-[10px] text-[#e85d04] mt-2 tracking-wider">TODAY</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={claim}
            disabled={!canClaim || claiming || loading}
            className="btn-primary min-w-[240px]"
          >
            {claiming
              ? 'Claiming…'
              : loading
                ? 'Loading…'
                : canClaim
                  ? 'Claim daily reward'
                  : `Next in ${formatCountdown(msReset)}`}
          </button>
          {success && <p className="text-sm text-[#e9b44c] text-center max-w-md">{success}</p>}
          {error && <p className="text-sm text-[#ff8a65] text-center max-w-md">{error}</p>}
          <p className="text-xs text-white/35 text-center max-w-md">
            Rewards appear in-game after you open the app. Resets 00:00 UTC.
          </p>
        </div>
      </div>
    </section>
  )
}
