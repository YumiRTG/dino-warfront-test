import { useState } from 'react'
import { asset } from '@/lib/assets'
import './HomeDinoProjector.css'

type ProjectorMode = 'hologram' | 'real'

type DinoProfile = {
  name: string
  code: string
  className: string
  role: string
  threat: string
  habitat: string
  deployment: string
  image: string
  accent: string
  stats: {
    attack: number
    defense: number
    speed: number
    control: number
  }
}

const DINOS: DinoProfile[] = [
  {
    name: 'Tyrannosaurus',
    code: 'APX-01',
    className: 'Apex Predator',
    role: 'Siege Breaker',
    threat: 'Extreme',
    habitat: 'Volcanic Lowlands',
    deployment: 'Frontline pressure, charge disruption and high burst damage.',
    image: asset('dino-tyranno.png'),
    accent: '#ff5a2d',
    stats: { attack: 96, defense: 72, speed: 58, control: 76 },
  },
  {
    name: 'Velociraptor',
    code: 'HNT-07',
    className: 'Pack Hunter',
    role: 'Fast Pursuit',
    threat: 'High',
    habitat: 'Jungle Fringe',
    deployment: 'Rapid flanking, pursuit and pressure against exposed formations.',
    image: asset('dino-raptor.png'),
    accent: '#38e8ff',
    stats: { attack: 79, defense: 42, speed: 97, control: 68 },
  },
  {
    name: 'Triceratops',
    code: 'BLW-03',
    className: 'Armored Herbivore',
    role: 'Formation Anchor',
    threat: 'High',
    habitat: 'Open Plains',
    deployment: 'Absorbs frontline pressure and protects vulnerable damage units.',
    image: asset('dino-triceratops.png'),
    accent: '#f0c14d',
    stats: { attack: 68, defense: 96, speed: 38, control: 71 },
  },
  {
    name: 'Stegosaurus',
    code: 'GRD-05',
    className: 'Heavy Defender',
    role: 'Counter Guard',
    threat: 'Medium',
    habitat: 'Forest Basin',
    deployment: 'Punishes sustained pressure and stabilizes defensive marches.',
    image: asset('dino-stego.png'),
    accent: '#3dffb5',
    stats: { attack: 61, defense: 91, speed: 31, control: 82 },
  },
  {
    name: 'Pterodactyl',
    code: 'AIR-09',
    className: 'Aerial Hunter',
    role: 'Sky Scout',
    threat: 'High',
    habitat: 'Cliff Territories',
    deployment: 'Fast aerial reconnaissance with strong reach and target access.',
    image: asset('dino-ptera.png'),
    accent: '#b86cff',
    stats: { attack: 73, defense: 35, speed: 94, control: 57 },
  },
]

const STAT_LABELS = ['attack', 'defense', 'speed', 'control'] as const

export default function HomeDinoProjector() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mode, setMode] = useState<ProjectorMode>('hologram')
  const dino = DINOS[activeIndex]

  return (
    <section className="home-projector section-band" aria-label="Dinosaur projection chamber">
      <div className="home-projector__ambient" aria-hidden />
      <div className="container-dd relative z-10">
        <div className="home-projector__header" data-reveal="up">
          <div>
            <p className="eyebrow">WAR LAB // SPECIMEN ARCHIVE</p>
            <h2 className="display-lg text-white mt-2">
              Project the beast.<br />
              <span className="text-gradient-magma">Study the apex.</span>
            </h2>
          </div>
          <div className="home-projector__intro">
            <p>
              Select a species and bring it into the projection chamber. Scan its combat profile,
              switch from tactical hologram to full specimen render and inspect how it fits a march.
            </p>
            <div className="home-projector__mode" role="group" aria-label="Projection mode">
              <button
                type="button"
                data-active={mode === 'hologram' ? 'true' : undefined}
                onClick={() => setMode('hologram')}
              >
                HOLOGRAM
              </button>
              <button
                type="button"
                data-active={mode === 'real' ? 'true' : undefined}
                onClick={() => setMode('real')}
              >
                REAL FORM
              </button>
            </div>
          </div>
        </div>

        <div
          className="home-projector__console"
          data-reveal="scale"
          style={{ ['--projector-accent' as string]: dino.accent }}
        >
          <div className="home-projector__stage" data-mode={mode}>
            <div className="home-projector__ceiling" aria-hidden />
            <div className="home-projector__beam" aria-hidden />
            <div className="home-projector__scan-grid" aria-hidden />
            <div className="home-projector__ring home-projector__ring--outer" aria-hidden />
            <div className="home-projector__ring home-projector__ring--middle" aria-hidden />
            <div className="home-projector__ring home-projector__ring--inner" aria-hidden />
            <div className="home-projector__particles" aria-hidden>
              {Array.from({ length: 14 }).map((_, index) => <span key={index} />)}
            </div>

            <div className="home-projector__specimen" key={`${dino.code}-${mode}`}>
              <div className="home-projector__ghost home-projector__ghost--left" aria-hidden>
                <img src={dino.image} alt="" />
              </div>
              <div className="home-projector__ghost home-projector__ghost--right" aria-hidden>
                <img src={dino.image} alt="" />
              </div>
              <img
                src={dino.image}
                alt={`${dino.name} projected in the Dino Warfront war lab`}
                className="home-projector__dino"
                draggable={false}
              />
              <div className="home-projector__scanline" aria-hidden />
              <div className="home-projector__ground-glow" aria-hidden />
            </div>

            <div className="home-projector__stage-label home-projector__stage-label--top">
              <span>SPECIMEN {dino.code}</span>
              <strong>{mode === 'hologram' ? 'TACTICAL PROJECTION' : 'FULL SPECIMEN RENDER'}</strong>
            </div>
            <div className="home-projector__stage-label home-projector__stage-label--bottom">
              <span>ROTATION LOCKED</span>
              <span>BIOMETRIC SCAN ACTIVE</span>
            </div>

            <div className="home-projector__pedestal" aria-hidden>
              <span className="home-projector__pedestal-core" />
            </div>
          </div>

          <aside className="home-projector__intel">
            <div className="home-projector__intel-head">
              <span>{dino.code}</span>
              <small>THREAT // {dino.threat.toUpperCase()}</small>
            </div>
            <h3>{dino.name}</h3>
            <p className="home-projector__class">{dino.className} · {dino.role}</p>

            <div className="home-projector__facts">
              <div><span>ROLE</span><strong>{dino.role}</strong></div>
              <div><span>HABITAT</span><strong>{dino.habitat}</strong></div>
              <div><span>THREAT</span><strong>{dino.threat}</strong></div>
            </div>

            <p className="home-projector__deployment">{dino.deployment}</p>

            <div className="home-projector__stats">
              {STAT_LABELS.map((stat) => (
                <div className="home-projector__stat" key={stat}>
                  <div>
                    <span>{stat}</span>
                    <strong>{dino.stats[stat]}</strong>
                  </div>
                  <i><b style={{ width: `${dino.stats[stat]}%` }} /></i>
                </div>
              ))}
            </div>

            <div className="home-projector__status">
              <span />
              SPECIMEN DATA SYNCHRONIZED
            </div>
          </aside>
        </div>

        <div className="home-projector__selector" role="tablist" aria-label="Projected dinosaur">
          {DINOS.map((item, index) => (
            <button
              key={item.code}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              data-active={activeIndex === index ? 'true' : undefined}
              style={{ ['--selector-accent' as string]: item.accent }}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <img src={item.image} alt="" loading="lazy" />
              <span>{item.code}</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
