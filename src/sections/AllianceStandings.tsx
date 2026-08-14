import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { compact, getTopAlliances, type AllianceEntry } from '@/lib/live'

/**
 * Live alliance board. The colour on each crest is the territory colour that
 * alliance actually paints the world map with, straight from its document.
 */
export default function AllianceStandings() {
  const [rows, setRows] = useState<AllianceEntry[] | 'failed' | null>(null)

  useEffect(() => {
    let alive = true
    getTopAlliances(6)
      .then((r) => alive && setRows(r))
      .catch(() => alive && setRows('failed'))
    return () => {
      alive = false
    }
  }, [])

  if (rows === 'failed') return null
  const list = Array.isArray(rows) ? rows : []

  return (
    <section className="mt-16 md:mt-20">
      <div className="mb-8" data-reveal="up">
        <p className="live-badge">
          <span className="live-badge__dot" />
          Live territory
        </p>
        <h2 className="display-md text-white mt-4">
          Who holds <span className="text-mode-accent">the ground</span>
        </h2>
        <p className="body-lg mt-4 max-w-2xl">
          Every alliance on the running server, with the colour it paints its territory
          in. Power is the sum of what its members are worth.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rank-panel p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-bar h-16" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-reveal-stagger>
          {list.map((a, i) => (
            <Link
              key={a.id}
              to={`/alliance/${a.id}`}
              className="alliance-card no-underline text-inherit"
              data-reveal-item
              style={{ ['--crest' as string]: a.color }}
            >
              <div className="alliance-card__crest">
                <span>{a.tag}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="alliance-card__name">{a.name}</p>
                <p className="alliance-card__meta">
                  Level {a.level} · {a.members} {a.members === 1 ? 'member' : 'members'}
                </p>
              </div>
              <div className="alliance-card__power">
                <span>{compact(a.power)}</span>
                <small>power</small>
              </div>
              <span className="alliance-card__rank">{String(i + 1).padStart(2, '0')}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
