import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { BASIC_HEROES } from '@/lib/heroes'
import { BASIC_DINOS } from '@/lib/dinos'
import './HomeAaaRoster.css'

type RosterEntry = {
  id: string
  name: string
  role: string
  detail: string
  description: string
  img: string
}

type ShowcaseProps = {
  kind: 'heroes' | 'dinos'
  eyebrow: string
  title: string
  accentTitle: string
  intro: string
  background: string
  entries: RosterEntry[]
  selected: number
  onSelect: (index: number) => void
  cta: string
  ctaLabel: string
}

function RosterShowcase({
  kind,
  eyebrow,
  title,
  accentTitle,
  intro,
  background,
  entries,
  selected,
  onSelect,
  cta,
  ctaLabel,
}: ShowcaseProps) {
  const active = entries[selected] ?? entries[0]!

  return (
    <section className={`real-roster real-roster--${kind}`} aria-label={`${kind} roster`}>
      <img className="real-roster__environment" src={background} alt="" loading="lazy" draggable={false} />
      <div className="real-roster__grade" aria-hidden />
      <div className="real-roster__fog real-roster__fog--back" aria-hidden />
      <div className="real-roster__embers" aria-hidden />

      <div className="container-dd real-roster__content">
        <header className="real-roster__header" data-reveal="up">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display-lg text-white mt-2">
              {title}<br />
              <span className="text-gradient-magma">{accentTitle}</span>
            </h2>
          </div>
          <p className="real-roster__intro">{intro}</p>
        </header>

        <div className="real-roster__cast-wrap" data-reveal="scale">
          <div className="real-roster__horizon" aria-hidden />
          <div className="real-roster__cast" role="list" aria-label={`${kind} in Dino Warfront`}>
            {entries.map((entry, index) => {
              const isActive = selected === index
              return (
                <button
                  type="button"
                  key={entry.id}
                  className="real-roster__figure"
                  data-active={isActive ? 'true' : undefined}
                  aria-pressed={isActive}
                  onClick={() => onSelect(index)}
                  onMouseEnter={() => onSelect(index)}
                  onFocus={() => onSelect(index)}
                >
                  <span className="real-roster__contact-shadow" aria-hidden />
                  <span className="real-roster__figure-glow" aria-hidden />
                  <img
                    src={entry.img}
                    alt={entry.name}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                  <span className="real-roster__figure-label">
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong>{entry.name}</strong>
                    <em>{entry.role}</em>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="real-roster__fog real-roster__fog--front" aria-hidden />
        </div>

        <div className="real-roster__intel" key={`${kind}-${active.id}`} data-reveal="up">
          <div className="real-roster__intel-index">
            {String(selected + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
          </div>
          <div className="real-roster__intel-copy">
            <p>{kind === 'heroes' ? 'ACTIVE COMMANDER' : 'ACTIVE SPECIMEN'}</p>
            <h3>{active.name}</h3>
            <div className="real-roster__meta">
              <strong>{active.role}</strong>
              <span>{active.detail}</span>
            </div>
            <p className="real-roster__description">{active.description}</p>
          </div>
          <Link to={cta} className="real-roster__cta no-underline">
            {ctaLabel}<span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomeAaaRoster() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [dinoIndex, setDinoIndex] = useState(0)

  const heroes = useMemo<RosterEntry[]>(
    () => BASIC_HEROES.map((hero) => ({
      id: hero.id,
      name: hero.name,
      role: hero.role,
      detail: hero.focus,
      description: hero.blurb,
      img: hero.img,
    })),
    [],
  )

  const dinos = useMemo<RosterEntry[]>(
    () => BASIC_DINOS.map((dino) => ({
      id: dino.id,
      name: dino.name,
      role: dino.role,
      detail: 'Prehistoric combat unit',
      description: dino.blurb,
      img: dino.img,
    })),
    [],
  )

  return (
    <div className="real-roster-suite">
      <RosterShowcase
        kind="heroes"
        eyebrow="THE PEOPLE OF DINO WARFRONT"
        title="Not portraits."
        accentTitle="People in the world."
        intro="The website now uses the actual hero artwork from the game as full-size characters. No AI replacements and no portrait-card treatment."
        background={asset('feature-heroes-hero.jpg')}
        entries={heroes}
        selected={heroIndex}
        onSelect={setHeroIndex}
        cta="/features/heroes"
        ctaLabel="Explore the heroes"
      />

      <RosterShowcase
        kind="dinos"
        eyebrow="THE CREATURES OF DINO WARFRONT"
        title="No icons."
        accentTitle="Living prehistoric scale."
        intro="Every creature stands directly inside the environment. The artwork is treated like a photographed subject with depth, contact shadow and atmospheric light instead of a UI icon."
        background={asset('feature-dinos-hero.jpg')}
        entries={dinos}
        selected={dinoIndex}
        onSelect={setDinoIndex}
        cta="/features/dinos"
        ctaLabel="Explore the dinosaurs"
      />
    </div>
  )
}
