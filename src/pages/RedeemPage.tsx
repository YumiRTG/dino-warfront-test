import { useState } from 'react'
import { Link } from 'react-router'
import { usePageMotion } from '@/hooks/useMotion'
import { useAuth } from '@/hooks/useAuth'
import {
  redeemCode,
  REWARD_LABEL,
  type RedeemOutcome,
} from '@/lib/giftcodes'
import { compact } from '@/lib/live'

const STEPS = [
  {
    step: '01',
    title: 'Find your Account ID',
    text: 'In the game, open Settings. Your Account ID is the long string shown there. Copy it exactly.',
  },
  {
    step: '02',
    title: 'Enter the code',
    text: 'Codes come from announcements, streams and events. They are not case sensitive.',
  },
  {
    step: '03',
    title: 'Open the game',
    text: 'The reward is waiting on your account. It lands in your resources the next time the game connects.',
  },
]

export default function RedeemPage() {
  const motionRef = usePageMotion()
  const { session } = useAuth()

  const [accountId, setAccountId] = useState(session?.accountId ?? '')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<RedeemOutcome | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setOutcome(null)
    const result = await redeemCode(accountId, code)
    setOutcome(result)
    if (result.ok) setCode('')
    setBusy(false)
  }

  const rewards = outcome?.ok ? Object.entries(outcome.rewards) : []

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-8 lg:gap-12 items-start">
          <div data-reveal="up">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>Gift codes</span>
            </div>
            <h1 className="display-lg text-white">
              Redeem
              <br />
              <span className="text-gradient-gold">a code</span>
            </h1>
            <p className="body-lg mt-5 max-w-xl">
              Enter your Account ID and a gift code. The reward is attached to your
              account here, and the game hands it to you the next time you open it.
              You never need to log in.
            </p>

            <ol className="loop-steps mt-10" style={{ ['--mode-accent' as string]: 'var(--gold)' }}>
              {STEPS.map((s) => (
                <li key={s.step} className="loop-steps__item">
                  <span className="loop-steps__num">{s.step}</span>
                  <h3 className="font-display text-lg text-white uppercase tracking-wide mt-3">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* The form */}
          <div className="redeem-card" data-reveal="scale">
            <form onSubmit={onSubmit}>
              <label className="redeem-label" htmlFor="accountId">
                Account ID
              </label>
              <input
                id="accountId"
                className="redeem-input"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="From the game, under Settings"
                autoComplete="off"
                spellCheck={false}
              />

              <label className="redeem-label mt-5" htmlFor="code">
                Gift code
              </label>
              <input
                id="code"
                className="redeem-input redeem-input--code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="DINO2026"
                autoComplete="off"
                spellCheck={false}
                maxLength={32}
              />

              <button type="submit" className="btn-primary w-full mt-7" disabled={busy}>
                {busy ? 'Checking…' : 'Redeem'}
              </button>
            </form>

            {outcome && !outcome.ok && (
              <p className="redeem-msg redeem-msg--bad">{outcome.error}</p>
            )}

            {outcome?.ok && (
              <div className="redeem-msg redeem-msg--good">
                <p className="font-display text-lg text-white uppercase tracking-wide">
                  Code accepted
                </p>
                {outcome.note && (
                  <p className="font-body text-sm text-[var(--bone-dim)] mt-1.5">{outcome.note}</p>
                )}

                {rewards.length > 0 && (
                  <ul className="redeem-rewards">
                    {rewards.map(([key, amount]) => (
                      <li key={key}>
                        <span>{REWARD_LABEL[key] ?? key}</span>
                        <strong>{compact(amount)}</strong>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="font-body text-sm text-[var(--bone-dim)] mt-3 leading-relaxed">
                  Open the game to collect it.
                </p>
              </div>
            )}

            <p className="font-body text-xs text-[var(--bone-dim)] mt-6 leading-relaxed">
              Rewards always go to the account you name here. Nothing on this page can
              take anything off an account.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-secondary no-underline">
            Get the game
          </Link>
          <Link to="/progress" className="btn-secondary no-underline">
            Where codes get announced
          </Link>
        </div>
      </div>
    </div>
  )
}
