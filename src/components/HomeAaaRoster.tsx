import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { BASIC_HEROES } from '@/lib/heroes'
import { BASIC_DINOS } from '@/lib/dinos'
import './HomeAaaRoster.css'

type RosterKind = 'heroes' | 'dinos'

export default function HomeAaaRoster() {
  const [kind, setKind] = useState<RosterKind>('heroes')
  const [heroIndex, setHeroIndex] = useState(0)
  const [dinoIndex, setDinoIndex] = useState(0)

  const items = kind === 'heroes' ? BASIC_HEROES : BASIC_DINOS
  const activeIndex = kind === 'heroes' ? heroIndex : dinoIndex
  const active = items[activeIndex] ?? items[0]!

  const meta = useMemo(() => {
    if (kind === 'heroes') {
      const hero = BASIC_HEROES[heroIndex] ?? BASIC_HEROES[0]!
      return {
        kicker: 'COMMAND ROSTER',
        title: 'Faces of the warfront',
        role: hero.role,
        detail: hero.focus,
        description: hero.blurb,
        cta: '/features/heroes',
        ctaLabel: 'View all heroes',
      }
    }

    const dino = BASIC_DINOS[dinoIndex] ?? BASIC_DINOS[0]!
    return {
      kicker: 'APEX ROSTER',
      title: 'Built by evolution',
      role: dino.role,
      detail: 'Prehistoric combat unit',
      description: dino.blurb,
      cta: '/features/dinos',
      ctaLabel: 'View all dinosaurs',
    }
  }, [kind, heroIndex, dinoIndex])

  const choose = (index: number) => {
    if (kind === 'heroes') setHeroIndex(index)
    else setDinoIndex(index)
  }

  return (
    <section className="aaa-roster section-band" aria-label="Dino Warfront roster showcase">
      <div className="aaa-roster__ambient" aria-hidden />
      <div className="container-dd relative z-10">
        <div className="aaa-roster__header" data-reveal="up">
          <div>
            <p className="eyebrow">ROSTER ARCHIVE</p>
            <h2 className="display-lg text-white mt-2">
              Meet the force<br />
              <span className="text-gradient-magma">behind the empire.</span>
            </h2>
          </div>

          <div className="aaa-roster__switch" role="tablist" aria-label="Roster type">
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'heroes'}
              data-active={kind === 'heroes' ? 'true' : undefined}
              onClick={() => setKind('heroes')}
            >
              Heroes
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'dinos'}
              data-active={kind === 'dinos' ? 'true' : undefined}
              onClick={() => setKind('dinos')}
            >
              Dinosaurs
            </button>
          </div>
        </div>

        <div className="aaa-roster__stage" data-kind={kind} data-reveal="scale">
          <div className="aaa-roster__scene" key={`${kind}-${active.id}`}>
            <div className="aaa-roster__scene-light" aria-hidden />
            <div className="aaa-roster__scene-haze" aria-hidden />
            <div className="aaa-roster__scene-floor" aria-hidden />

            <img
              src={active.img}
              alt={active.name}
              className="aaa-roster__main-art"
              draggable={false}
            />

            <div className="aaa-roster__silhouette" aria-hidden>
              <img src={active.img} alt="" draggable={false} />
            </div>

            <div className="aaa-roster__cinema-bars" aria-hidden />

            <div className="aaa-roster__identity">
              <p>{meta.kicker}</p>
              <span className="aaa-roster__index">{String(activeIndex + 1).padStart(2, '0')}</span>
              <h3>{active.name}</h3>
              <div className="aaa-roster__role-row">
                <strong>{meta.role}</strong>
                <span>{meta.detail}</span>
              </div>
              <p className="aaa-roster__description">{meta.description}</p>
              <Link to={meta.cta} className="aaa-roster__cta no-underline">
                {meta.ctaLabel}
                <span aria-hidden>↗</span>
              </Link>
            </div>

            <div className="aaa-roster__watermark" aria-hidden>
              {kind === 'heroes' ? 'COMMAND' : 'APEX'}
            </div>

            <div className="aaa-roster__live-tag" aria-hidden>
              <i /> ORIGINAL GAME RENDER
            </div>
          </div>

          <div className="aaa-roster__rail" role="list" aria-label={`${kind} roster`}>
            {items.map((item, index) => {
              const selected = index === activeIndex
              const sub = kind === 'heroes'
                ? BASIC_HEROES[index]?.focus
                : BASIC_DINOS[index]?.role

              return (
                <button
                  type="button"
                  key={item.id}
                  className="aaa-roster__card"
                  data-active={selected ? 'true' : undefined}
                  aria-pressed={selected}
                  onClick={() => choose(index)}
                  onMouseEnter={() => choose(index)}
                  onFocus={() => choose(index)}
                >
                  <img src={item.img} alt="" loading="lazy" draggable={false} />
                  <span className="aaa-roster__card-scrim" />
                  <span className="aaa-roster__card-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="aaa-roster__card-copy">
                    <strong>{item.name}</strong>
                    <small>{sub}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="aaa-roster__footer" data-reveal="up">
          <span>{kind === 'heroes' ? `${BASIC_HEROES.length} launch heroes` : `${BASIC_DINOS.length} prehistoric units`}</span>
          <strong>{meta.title}</strong>
          <span>Real in-game artwork · cinematic website treatment</span>
        </div>
      </div>
    </section>
  )
}
