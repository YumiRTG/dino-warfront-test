import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import {
  formatRankValue,
  getTopPlayers,
  RANK_CATEGORIES,
  type RankEntry,
} from '@/lib/ranking'

/**
 * Live standings, read from the same Firestore documents the Unity client
 * mirrors to. Real accounts on the running server, which is the one thing on
 * this site that cannot be faked, so it gets the loudest treatment.
 */

type CatResult = { rows: RankEntry[] } | { failed: true }

export default function TopCommanders() {
  const [catId, setCatId] = useState(RANK_CATEGORIES[0]!.id)
  const [cache, setCache] = useState<Record<string, CatResult>>({})

  const cat = RANK_CATEGORIES.find((c) => c.id === catId) ?? RANK_CATEGORIES[0]!
  const result = cache[cat.id]

  useEffect(() => {
    if (cache[cat.id]) return
    let alive = true

    getTopPlayers(cat, 10)
      .then((list) => {
        if (alive) setCache((c) => ({ ...c, [cat.id]: { rows: list } }))
      })
      .catch(() => {
        if (alive) setCache((c) => ({ ...c, [cat.id]: { failed: true } }))
      })

    return () => {
      alive = false
    }
  }, [cat, cache])

  const loading = !result
  const failed = !!result && 'failed' in result
  const rows = result && 'rows' in result ? result.rows : []

  const champion = rows[0]
  const rest = rows.slice(1, 8)

  return (
    <section className="section-band relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 55% at 24% 18%, rgba(240,193,77,0.12), transparent 62%), radial-gradient(ellipse 45% 55% at 88% 82%, rgba(255,77,26,0.10), transparent 60%)',
        }}
      />

      <div className="container-dd relative">
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9"
          data-reveal="up"
        >
          <div className="max-w-xl">
            <p className="live-badge">
              <span className="live-badge__dot" />
              Live server
            </p>
            <h2 className="display-lg text-white mt-4">
              Who is
              <br />
              <span className="text-gradient-gold">actually winning</span>
            </h2>
            <p className="body-lg mt-5">
              These are real commanders on the running server, pulled straight from the
              game as you load the page. {cat.blurb}
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Leaderboard category">
            {RANK_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === catId}
                onClick={() => setCatId(c.id)}
                className="mode-switcher__item"
                data-active={c.id === catId ? 'true' : undefined}
                style={{ ['--pill' as string]: 'var(--gold)', cursor: 'pointer' }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {failed ? (
          <div className="dd-panel p-8 md:p-10 max-w-2xl" data-reveal="up">
            <p className="font-display text-xl text-white uppercase tracking-wide">
              Standings are offline
            </p>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-3 leading-relaxed">
              The board could not reach the game server just now. It comes back on its
              own once the connection is up.
            </p>
          </div>
        ) : (
          <div
            className="grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] gap-4"
            data-reveal="up"
          >
            {/* Rank one */}
            <div className="champion-card">
              {champion && (
                <img src={asset(champion.avatar)} alt="" className="champion-card__art" />
              )}
              <div className="champion-card__scrim" />
              <div className="champion-card__crest" aria-hidden>
                01
              </div>

              <div className="champion-card__body">
                <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]">
                  {cat.label} · rank one
                </p>

                {loading ? (
                  <>
                    <div className="skeleton-bar w-3/4 h-9 mt-3" />
                    <div className="skeleton-bar w-1/2 h-12 mt-4" />
                  </>
                ) : champion ? (
                  <>
                    <Link
                      to={`/commander/${champion.token}`}
                      className="champion-card__name no-underline block"
                    >
                      {champion.name}
                    </Link>
                    <p className="champion-card__value">{formatRankValue(champion.value)}</p>
                    <p className="font-ui text-[10px] tracking-[0.22em] uppercase text-[var(--bone-dim)] mt-1.5">
                      {cat.unit}
                      {champion.detail ? ` · ${champion.detail}` : ''}
                    </p>
                  </>
                ) : (
                  <p className="font-body text-sm text-[var(--bone-dim)] mt-4 leading-relaxed">
                    Nobody has posted a score in this category yet.
                  </p>
                )}
              </div>
            </div>

            {/* Everyone chasing */}
            <div className="rank-panel">
              {loading && (
                <div className="p-5 space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="skeleton-bar h-11" />
                  ))}
                </div>
              )}

              {!loading && rest.length > 0 && (
                <ol className="rank-list">
                  {rest.map((r, i) => (
                    <li key={r.token} className="rank-list__row">
                      <span className="rank-list__pos">{String(i + 2).padStart(2, '0')}</span>
                      <img
                        src={asset(r.avatar)}
                        alt=""
                        className="rank-list__avatar"
                        loading="lazy"
                      />
                      <Link to={`/commander/${r.token}`} className="rank-list__name no-underline">
                        {r.name}
                        {r.detail && <span className="rank-list__detail">{r.detail}</span>}
                      </Link>
                      <span className="rank-list__value">{formatRankValue(r.value)}</span>
                    </li>
                  ))}
                </ol>
              )}

              {!loading && rest.length === 0 && (
                <div className="p-8">
                  <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">
                    The board fills up as commanders play. There is plenty of room on it.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Get on the board
          </Link>
          <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[var(--bone-dim)]">
            Same standings the in-game ranking screen shows
          </p>
        </div>
      </div>
    </section>
  )
}
