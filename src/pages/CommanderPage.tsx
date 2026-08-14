import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { usePageMotion } from '@/hooks/useMotion'
import { getCommander, type Commander } from '@/lib/commander'
import { compact } from '@/lib/live'

/**
 * A public profile for a single commander, built from their live save mirror.
 * This is the page players link to each other, so it leads with identity and
 * the numbers people argue about, then breaks the account down.
 */

function PowerBar({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="pbar">
      <div className="pbar__head">
        <span className="pbar__label">{label}</span>
        <span className="pbar__value">{compact(value)}</span>
      </div>
      <div className="pbar__track">
        <span className="pbar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function CommanderPage() {
  const { id = '' } = useParams()
  const motionRef = usePageMotion()
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [c, setC] = useState<Commander | null>(null)

  useEffect(() => {
    let alive = true

    getCommander(id)
      .then((found) => {
        if (!alive) return
        if (!found) {
          setState('missing')
          return
        }
        setC(found)
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
          <p className="eyebrow">No such commander</p>
          <h1 className="display-md text-white mt-3">Nothing under that ID</h1>
          <p className="body-lg mt-4">
            Either the Account ID is wrong, or that commander has not synced to the
            server yet. Your own ID is in the game under Settings.
          </p>
          <Link to="/" className="btn-secondary no-underline mt-8 inline-flex">
            Back to the front
          </Link>
        </div>
      </div>
    )
  }

  const powerParts = c
    ? [
        { label: 'Heroes', value: c.heroPowerTotal, color: 'var(--magma)' },
        { label: 'Research', value: c.researchPower, color: 'var(--cyan)' },
        { label: 'Buildings', value: c.buildingPower, color: 'var(--gold)' },
      ]
    : []
  const powerMax = Math.max(1, ...powerParts.map((p) => p.value))
  const troopTotal = c ? c.troops.reduce((a, b) => a + b.total, 0) : 0
  const researchPct = c && c.research.max ? Math.round((c.research.done / c.research.max) * 100) : 0

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        {/* Identity */}
        <header className="cmd-hero" data-reveal="scale">
          <div className="cmd-hero__glow" />
          {c && <img src={c.avatar} alt="" className="cmd-hero__art" />}
          <div className="cmd-hero__body">
            <p className="live-badge">
              <span className="live-badge__dot" />
              Live profile
            </p>
            {state === 'loading' ? (
              <>
                <div className="skeleton-bar h-12 w-2/3 mt-4" />
                <div className="skeleton-bar h-6 w-1/3 mt-3" />
              </>
            ) : (
              c && (
                <>
                  <h1 className="cmd-hero__name">{c.name}</h1>
                  <div className="cmd-hero__meta">
                    <span>Town Hall {c.townHallLevel}</span>
                    {c.alliance && (
                      <Link
                        to={`/alliance/${c.alliance.id}`}
                        className="cmd-hero__alliance no-underline"
                        style={{ ['--crest' as string]: c.alliance.color }}
                      >
                        [{c.alliance.tag}] {c.alliance.name}
                      </Link>
                    )}
                    {c.seenLabel && <span>{c.seenLabel}</span>}
                  </div>
                  <p className="cmd-hero__power">{compact(c.totalScore)}</p>
                  <p className="font-ui text-[10px] tracking-[0.24em] uppercase text-[var(--bone-dim)] mt-1">
                    Total power
                  </p>
                </>
              )
            )}
          </div>
        </header>

        {/* Headline numbers */}
        <div className="spec-rail !mt-4" data-reveal-stagger>
          {[
            ['Strongest hero', c ? compact(c.heroPowerBest) : '—', c?.heroBestName ?? ''],
            ['Hero power', c ? compact(c.heroPowerTotal) : '—', 'across the roster'],
            ['Troops', compact(troopTotal), 'trained'],
            ['Troop kills', c ? compact(c.troopKills) : '—', 'lifetime'],
          ].map(([label, value, note]) => (
            <div key={label} className="spec-rail__cell" data-reveal-item>
              <p className="spec-rail__value">{value}</p>
              <p className="spec-rail__label">{label}</p>
              {note && (
                <p className="font-body text-[0.7rem] text-[var(--bone-dim)] mt-1.5">{note}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {/* Where the power comes from */}
          <section className="rank-panel p-5 md:p-6" data-reveal="up">
            <h2 className="font-display text-xl text-white uppercase tracking-wide">
              Where the power sits
            </h2>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
              Every account leans somewhere. A hero-heavy account wins arena matches and
              struggles on the world map, and the reverse is just as true.
            </p>
            <div className="mt-5 space-y-4">
              {powerParts.map((p) => (
                <PowerBar key={p.label} {...p} total={powerMax} />
              ))}
            </div>
          </section>

          {/* Army */}
          <section className="rank-panel p-5 md:p-6" data-reveal="up">
            <h2 className="font-display text-xl text-white uppercase tracking-wide">
              The army
            </h2>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
              Trained troops by branch and tier. Higher tiers sit further right.
            </p>
            <div className="mt-5 space-y-4">
              {(c?.troops ?? []).map((b) => (
                <div key={b.key}>
                  <div className="flex items-center gap-2.5">
                    <img src={b.icon} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-ui text-[11px] tracking-[0.18em] uppercase text-[var(--bone)]">
                      {b.label}
                    </span>
                    <span className="flex-1" />
                    <span className="font-display text-base text-[var(--gold)]">
                      {compact(b.total)}
                    </span>
                  </div>
                  <div className="tier-strip">
                    {b.tiers.map((n, i) => (
                      <span
                        key={i}
                        className="tier-strip__cell"
                        data-filled={n > 0 ? 'true' : undefined}
                        title={`Tier ${i + 1}: ${n.toLocaleString('en-US')}`}
                      >
                        <span
                          style={{
                            height: `${b.total ? Math.max(6, (n / Math.max(...b.tiers, 1)) * 100) : 0}%`,
                          }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Research + city. Start-aligned: the research panel is short and was
            being stretched to match the building list. */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4 items-start">
          <section className="rank-panel p-5 md:p-6" data-reveal="up">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl text-white uppercase tracking-wide">Research</h2>
              <span className="font-display text-2xl text-[var(--cyan)]">{researchPct}%</span>
            </div>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
              {c?.research.levels.length ?? 0} nodes, each to level 10. This is what raises
              troop stats and march capacity.
            </p>
            <div className="node-grid mt-5">
              {(c?.research.levels ?? []).map((lvl, i) => (
                <span key={i} className="node" title={`Node ${i + 1}: level ${lvl}`}>
                  <span style={{ height: `${lvl * 10}%` }} />
                </span>
              ))}
            </div>
          </section>

          <section className="rank-panel p-5 md:p-6" data-reveal="up">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl text-white uppercase tracking-wide">The city</h2>
              <span className="font-display text-2xl text-[var(--gold)]">
                {c?.city.total ?? 0}
              </span>
            </div>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
              Buildings standing, highest level of each.
            </p>
            <ul className="build-list mt-4">
              {(c?.city.buildings ?? []).slice(0, 12).map((b) => (
                <li key={b.name}>
                  <span className="build-list__name">
                    {b.name}
                    {b.count > 1 && <em> ×{b.count}</em>}
                  </span>
                  <span className="build-list__lvl">{b.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Build an account like this
          </Link>
          <Link to="/modes" className="btn-secondary no-underline">
            Where this power gets spent
          </Link>
        </div>
      </div>
    </div>
  )
}
