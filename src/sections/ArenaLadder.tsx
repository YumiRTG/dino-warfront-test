import { useEffect, useState } from 'react'
import {
  compact,
  currentSeason,
  getArenaLadder,
  getTeamArenaLadder,
  type ArenaFighter,
} from '@/lib/live'

/**
 * The real arena ladders, including the defense squads people are actually
 * holding their rating with. Hero names, hero power and defense power all come
 * from the live `arena` / `teamarena` documents.
 */

function HeroChip({
  name,
  power,
  art,
}: {
  name: string
  power: number
  art: string
}) {
  return (
    <div className="hero-chip" title={`${name} · ${compact(power)} power`}>
      <div className="hero-chip__frame">
        <img src={art} alt="" loading="lazy" />
      </div>
      <span className="hero-chip__name">{name}</span>
      <span className="hero-chip__power">{compact(power)}</span>
    </div>
  )
}

function FighterCard({ f, rank, teams }: { f: ArenaFighter; rank: number; teams: boolean }) {
  const groups = teams
    ? [f.heroes.slice(0, 3), f.heroes.slice(3, 6), f.heroes.slice(6, 9)]
    : [f.heroes]

  return (
    <article className="fighter-card" data-reveal-item>
      <div className="fighter-card__bar">
        <span className="fighter-card__rank">{String(rank).padStart(2, '0')}</span>
        <img src={f.avatar} alt="" className="fighter-card__avatar" loading="lazy" />
        <div className="min-w-0">
          <p className="fighter-card__name">
            {f.name}
            {f.isBot && <span className="fighter-card__tag">AI</span>}
          </p>
          <p className="fighter-card__meta">
            {f.wins}W · {f.losses}L · {compact(f.defensePower)} defense power
          </p>
        </div>
        <span className="fighter-card__points">
          {f.points}
          <span>pts</span>
        </span>
      </div>

      <div className="fighter-card__squad">
        {groups.map((g, gi) => (
          <div key={gi} className="fighter-card__team">
            {teams && (
              <p className="fighter-card__teamlabel">
                Team {gi + 1}
                {f.teamPower[gi] ? ` · ${compact(f.teamPower[gi]!)}` : ''}
              </p>
            )}
            <div className="fighter-card__heroes">
              {g.map((h, i) => (
                <HeroChip key={`${h.id}-${i}`} name={h.name} power={h.power} art={h.art} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function ArenaLadder() {
  const [tab, setTab] = useState<'solo' | 'team'>('solo')
  const [cache, setCache] = useState<Record<string, ArenaFighter[] | 'failed'>>({})

  const data = cache[tab]

  useEffect(() => {
    if (cache[tab]) return
    let alive = true
    const load = tab === 'solo' ? getArenaLadder(5) : getTeamArenaLadder(4)

    load
      .then((rows) => alive && setCache((c) => ({ ...c, [tab]: rows })))
      .catch(() => alive && setCache((c) => ({ ...c, [tab]: 'failed' })))

    return () => {
      alive = false
    }
  }, [tab, cache])

  if (data === 'failed') return null

  const rows = Array.isArray(data) ? data : []

  return (
    <section className="mt-16 md:mt-20">
      <div
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8"
        data-reveal="up"
      >
        <div className="max-w-2xl">
          <p className="live-badge">
            <span className="live-badge__dot" />
            Season {currentSeason()} · live
          </p>
          <h2 className="display-md text-white mt-4">
            The defenses <span className="text-mode-accent">standing right now</span>
          </h2>
          <p className="body-lg mt-4">
            These are the actual squads at the top of the ladder on the live server, with
            the heroes they are holding their rating with. Beat one of these and the
            points come off them and onto you.
          </p>
        </div>

        <div className="flex gap-2">
          {(
            [
              ['solo', 'Tactical 1v1'],
              ['team', 'Team 3×3'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="mode-switcher__item"
              data-active={tab === id ? 'true' : undefined}
              style={{ ['--pill' as string]: 'var(--mode-accent)', cursor: 'pointer' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rank-panel p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-bar h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3" data-reveal-stagger>
          {rows.map((f, i) => (
            <FighterCard key={f.token} f={f} rank={i + 1} teams={tab === 'team'} />
          ))}
        </div>
      )}
    </section>
  )
}
