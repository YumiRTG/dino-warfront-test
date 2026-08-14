import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { usePageMotion } from '@/hooks/useMotion'
import { getAlliance, type Alliance } from '@/lib/commander'
import { compact } from '@/lib/live'

/** Public alliance page: crest, standing and the full roster. */
export default function AlliancePage() {
  const { id = '' } = useParams()
  const motionRef = usePageMotion()
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [a, setA] = useState<Alliance | null>(null)

  useEffect(() => {
    let alive = true
    getAlliance(id)
      .then((found) => {
        if (!alive) return
        if (!found) {
          setState('missing')
          return
        }
        setA(found)
        setState('ready')
      })
      .catch(() => alive && setState('missing'))
    return () => {
      alive = false
    }
  }, [id])

  if (state === 'missing') {
    return (
      <div className="page-shell">
        <div className="container-dd max-w-2xl">
          <p className="eyebrow">No such alliance</p>
          <h1 className="display-md text-white mt-3">That banner is gone</h1>
          <p className="body-lg mt-4">
            The alliance either never existed or has been disbanded.
          </p>
          <Link to="/modes/world-map" className="btn-secondary no-underline mt-8 inline-flex">
            See who does hold ground
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={motionRef}
      className="page-shell"
      style={{ ['--crest' as string]: a?.color ?? 'var(--gold)' }}
    >
      <div className="container-dd">
        <header className="alliance-hero" data-reveal="scale">
          <div className="alliance-hero__wash" />
          <div className="alliance-hero__crest">
            <span>{a?.tag ?? '···'}</span>
          </div>
          <div className="min-w-0">
            <p className="live-badge">
              <span className="live-badge__dot" />
              Live alliance
            </p>
            {state === 'loading' ? (
              <div className="skeleton-bar h-12 w-2/3 mt-4" />
            ) : (
              <>
                <h1 className="alliance-hero__name">{a?.name}</h1>
                <p className="alliance-hero__meta">
                  Level {a?.level} · {a?.memberCount}{' '}
                  {a?.memberCount === 1 ? 'member' : 'members'} · {compact(a?.exp ?? 0)} alliance EXP
                </p>
                {a?.description && (
                  <p className="font-body text-sm text-[var(--bone-dim)] mt-3 max-w-xl leading-relaxed">
                    {a.description}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="alliance-hero__power">
            <span>{compact(a?.power ?? 0)}</span>
            <small>Total power</small>
          </div>
        </header>

        <div className="flex items-center gap-4 mt-10 mb-5" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">ROSTER</h2>
          <div className="hud-line flex-1 opacity-50" />
        </div>

        {a && a.members.length > 0 ? (
          <div className="rank-panel" data-reveal="up">
            <ol className="rank-list">
              {a.members.map((m, i) => (
                <li key={m.token} className="rank-list__row">
                  <span className="rank-list__pos">{String(i + 1).padStart(2, '0')}</span>
                  <img src={m.avatar} alt="" className="rank-list__avatar" loading="lazy" />
                  <Link to={`/commander/${m.token}`} className="rank-list__name no-underline">
                    {m.name}
                    <span className="rank-list__detail">
                      {m.role}
                      {m.techContributed > 0 && ` · ${compact(m.techContributed)} tech donated`}
                    </span>
                  </Link>
                  <span className="rank-list__value">{compact(m.power)}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="rank-panel p-8" data-reveal="up">
            <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">
              {state === 'loading'
                ? 'Reading the roster.'
                : 'No member records are public for this alliance yet.'}
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Start your own
          </Link>
          <Link to="/modes/world-map" className="btn-secondary no-underline">
            How territory works
          </Link>
        </div>
      </div>
    </div>
  )
}
