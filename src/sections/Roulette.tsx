import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  ROULETTE_PRIZES,
  pickWeightedPrize,
  prizeIndex,
  type RoulettePrize,
} from '@/lib/roulette'
import {
  formatCountdown,
  getSpinStatus,
  grantRouletteReward,
} from '@/lib/firebaseRewards'

const SEGMENT = 360 / ROULETTE_PRIZES.length

function buildConicGradient(): string {
  const parts = ROULETTE_PRIZES.map((p, i) => {
    const start = i * SEGMENT
    const end = (i + 1) * SEGMENT
    return `${p.color} ${start}deg ${end}deg`
  })
  return `conic-gradient(from -${SEGMENT / 2}deg, ${parts.join(', ')})`
}

export default function Roulette() {
  const { session, ready } = useAuth()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [lastPrize, setLastPrize] = useState<RoulettePrize | null>(null)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [canSpin, setCanSpin] = useState(false)
  const [msRemaining, setMsRemaining] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const spinLock = useRef(false)
  const gradient = useMemo(() => buildConicGradient(), [])

  const refreshStatus = useCallback(async () => {
    if (!session?.accountId) return
    setLoadingStatus(true)
    try {
      const s = await getSpinStatus(session.accountId)
      setCanSpin(s.canSpin)
      setMsRemaining(s.msRemaining)
    } catch {
      setCanSpin(true)
    } finally {
      setLoadingStatus(false)
    }
  }, [session?.accountId])

  useEffect(() => {
    if (session?.accountId) refreshStatus()
  }, [session?.accountId, refreshStatus])

  useEffect(() => {
    if (canSpin || msRemaining <= 0) return
    const t = window.setInterval(() => {
      setMsRemaining((prev) => {
        const next = Math.max(0, prev - 1000)
        if (next <= 0) setCanSpin(true)
        return next
      })
    }, 1000)
    return () => clearInterval(t)
  }, [canSpin, msRemaining])

  const spin = async () => {
    if (!session?.accountId || spinning || spinLock.current || !canSpin) return
    spinLock.current = true
    setSpinning(true)
    setError('')
    setStatusMsg('')
    setLastPrize(null)

    const prize = pickWeightedPrize()
    const index = prizeIndex(prize)
    const segmentCenter = index * SEGMENT
    const nextRotation = rotation + 5 * 360 + (360 - segmentCenter)
    setRotation(nextRotation)

    await new Promise((r) => setTimeout(r, 5200))

    const result = await grantRouletteReward(session.accountId, prize)
    if (!result.ok) {
      setError(result.error)
      setSpinning(false)
      spinLock.current = false
      await refreshStatus()
      return
    }

    setLastPrize(prize)
    setStatusMsg('Reward sent to your game. Open the app to collect it.')
    setCanSpin(false)
    setMsRemaining(24 * 60 * 60 * 1000)
    setSpinning(false)
    spinLock.current = false
  }

  if (!ready || !session) {
    return (
      <section className="py-16 md:py-20 px-6 text-center">
        <p className="eyebrow">Daily spin</p>
        <h2 className="font-display text-3xl md:text-5xl text-white mt-3 uppercase">
          Speed up roulette
        </h2>
        <p className="body-lg mt-4 max-w-md mx-auto">
          Log in to spin for free speed ups that go into your game.
        </p>
        <Link to="/play?login=1" className="btn-primary mt-8 inline-flex no-underline">
          Log in to spin
        </Link>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 px-5 md:px-8">
      <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="relative w-[min(88vw,340px)] h-[min(88vw,340px)] shrink-0">
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-1 z-20"
            style={{
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '24px solid #e85d04',
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-[#e9b44c]/25 shadow-2xl overflow-hidden"
            style={{
              background: gradient,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 5s cubic-bezier(0.12, 0.75, 0.12, 1)'
                : 'none',
            }}
          >
            {ROULETTE_PRIZES.map((p, i) => (
              <div
                key={p.id}
                className="absolute inset-0 flex items-start justify-center pt-5"
                style={{ transform: `rotate(${i * SEGMENT}deg)` }}
              >
                <span
                  className="font-ui text-[10px] uppercase tracking-wide text-center leading-tight px-1 max-w-[70px]"
                  style={{
                    color: p.color === '#FEFAE0' || p.color === '#F4A261' ? '#0a1610' : '#f0e6d0',
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-[#0a1610] border-2 border-[#e9b44c]/40 flex items-center justify-center">
              <span className="font-display text-[10px] text-[#e9b44c] tracking-wider">SPIN</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[360px] text-center lg:text-left">
          <p className="eyebrow">Daily spin</p>
          <h2 className="font-display text-3xl text-white mt-2 uppercase">Roulette</h2>
          <p className="body-lg mt-3 text-sm">
            One free spin every 24 hours for{' '}
            <span className="text-[#e9b44c]">{session.displayName}</span>.
          </p>

          <button
            type="button"
            onClick={spin}
            disabled={spinning || !canSpin || loadingStatus}
            className="btn-primary w-full mt-6"
          >
            {spinning
              ? 'Spinning…'
              : loadingStatus
                ? 'Loading…'
                : canSpin
                  ? 'Spin free'
                  : `Next in ${formatCountdown(msRemaining)}`}
          </button>

          {lastPrize && (
            <div className="glass-panel mt-5 p-5 text-left">
              <p className="eyebrow !text-[0.6rem]">You won</p>
              <p className="font-display text-2xl text-white mt-1">{lastPrize.label}</p>
              <p className="text-sm text-[#c4b89a]/80 mt-1">
                {lastPrize.sublabel} · ×{lastPrize.amount}
              </p>
            </div>
          )}
          {statusMsg && <p className="text-sm text-[#e9b44c] mt-4">{statusMsg}</p>}
          {error && <p className="text-sm text-[#ff8a65] mt-4">{error}</p>}
        </div>
      </div>
    </section>
  )
}
