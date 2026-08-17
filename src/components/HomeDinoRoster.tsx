import { useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'

const ROSTER = [
  { name: 'Tyrannosaurus', role: 'APEX BREAKER', trait: 'Heavy frontline pressure', img: asset('dino-tyranno.png'), accent: '#ff5a2d' },
  { name: 'Velociraptor', role: 'HUNTING PACK', trait: 'Speed, pursuit, disruption', img: asset('dino-raptor.png'), accent: '#38e8ff' },
  { name: 'Triceratops', role: 'IRON WALL', trait: 'Formation anchor and defense', img: asset('dino-triceratops.png'), accent: '#f0c14d' },
  { name: 'Stegosaurus', role: 'COUNTER GUARD', trait: 'Punishes sustained pressure', img: asset('dino-stego.png'), accent: '#3dffb5' },
  { name: 'Pterodactyl', role: 'SKY HUNTER', trait: 'Fast aerial threat', img: asset('dino-ptera.png'), accent: '#b86cff' },
] as const

export default function HomeDinoRoster() {
  const [active, setActive] = useState(0)
  const dino = ROSTER[active]

  return (
    <section className="home-roster section-band" aria-label="Dinosaur roster preview">
      <div className="home-roster__glow" style={{ ['--roster-accent' as string]: dino.accent }} aria-hidden />
      <div className="container-dd relative z-10">
        <div className="home-roster__header" data-reveal="up">
          <div>
            <p className="eyebrow">APEX ROSTER // FIELD READY</p>
            <h2 className="display-lg text-white">Choose the beast.<br /><span className="text-gradient-gold">Shape the march.</span></h2>
          </div>
          <p className="body-lg">Different dinosaurs change how a formation survives, reaches targets and breaks an enemy line. This is only a glimpse of the bestiary.</p>
        </div>

        <div className="home-roster__stage" data-reveal="scale" style={{ ['--roster-accent' as string]: dino.accent }}>
          <div className="home-roster__silhouette" aria-hidden>{String(active + 1).padStart(2, '0')}</div>
          <div className="home-roster__meta">
            <p>{dino.role}</p>
            <h3>{dino.name}</h3>
            <span>{dino.trait}</span>
            <Link to="/bestiary">VIEW BESTIARY ↗</Link>
          </div>
          <img key={dino.name} src={dino.img} alt={dino.name} className="home-roster__hero" draggable={false} />
          <div className="home-roster__scan" aria-hidden />
        </div>

        <div className="home-roster__rail" role="tablist" aria-label="Featured dinosaurs">
          {ROSTER.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              data-active={active === index ? 'true' : undefined}
              style={{ ['--roster-accent' as string]: item.accent }}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <img src={item.img} alt="" loading="lazy" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
