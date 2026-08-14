import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import DailyLogin from '@/sections/DailyLogin'
import Roulette from '@/sections/Roulette'
import { useAuth } from '@/hooks/useAuth'
import { usePageMotion } from '@/hooks/useMotion'

export default function PlayPage() {
  const { session } = useAuth()
  const [tab, setTab] = useState<'daily' | 'roulette'>('daily')
  const motionRef = usePageMotion()

  useEffect(() => {
    if (session) setTab('daily')
  }, [session?.accountId])

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="text-center max-w-2xl mx-auto mb-10" data-reveal="up">
          <p className="eyebrow justify-center">Free player rewards</p>
          <h1 className="display-lg text-white mt-4">
            Play <span className="text-gradient-magma">hub</span>
          </h1>
          <p className="body-lg mt-4">
            Log in with your Account ID, then claim daily speed ups or spin the
            roulette. Rewards transfer into your game inventory.
          </p>
          {!session && (
            <Link
              to="/play?login=1"
              className="btn-primary no-underline mt-6 inline-flex"
            >
              Log in to unlock
            </Link>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-8" data-reveal="up" data-reveal-delay="0.08">
          {(
            [
              { id: 'daily' as const, label: 'Daily login' },
              { id: 'roulette' as const, label: 'Roulette' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="font-ui text-xs uppercase tracking-[0.18em] px-6 py-2.5 cursor-pointer transition-all duration-300"
              style={{
                background:
                  tab === t.id
                    ? 'linear-gradient(135deg, rgba(255,77,26,0.25), rgba(245,193,93,0.1))'
                    : 'rgba(255,255,255,0.03)',
                border:
                  tab === t.id
                    ? '1px solid rgba(255,77,26,0.55)'
                    : '1px solid rgba(255,255,255,0.1)',
                color: tab === t.id ? '#f5c15d' : '#b8aea0',
                clipPath:
                  'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                transform: tab === t.id ? 'translateY(-1px)' : undefined,
                boxShadow:
                  tab === t.id ? '0 8px 24px rgba(255,77,26,0.15)' : undefined,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="dd-panel overflow-hidden" data-reveal="scale">
          {tab === 'daily' ? <DailyLogin /> : <Roulette />}
        </div>
      </div>
    </div>
  )
}
