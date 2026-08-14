import { useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'
import { MODES } from '@/config/modes'
import TopCommanders from '@/sections/TopCommanders'
import WarRoom from '@/sections/WarRoom'
import './HomePage.css'

const WAR_LOOP = [
  {
    step: '01',
    kicker: 'City command',
    title: 'Build',
    text: 'Raise the city, secure production and decide what your empire can afford before the first march ever leaves the gate.',
    metric: 'Offline economy',
    value: 'Always moving',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 38%',
    to: '/features/base',
  },
  {
    step: '02',
    kicker: 'Prehistoric arsenal',
    title: 'Tame',
    text: 'Dinosaurs are not decoration. Build a roster around speed, control, defense and raw pressure, then pair it with the right heroes.',
    metric: 'Combat identity',
    value: 'Role driven',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center center',
    to: '/features/dinos',
  },
  {
    step: '03',
    kicker: 'Persistent world',
    title: 'March',
    text: 'Leave the city and enter a shared 8000 × 8000 world. Gather, scout, reinforce, hunt, raid and rally while other commanders do the same.',
    metric: 'World scale',
    value: '8000 × 8000',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    to: '/modes/world-map',
  },
  {
    step: '04',
    kicker: 'Competitive war',
    title: 'Conquer',
    text: 'Take your army into ladders, campaign regions, alliance pressure and real server rankings. Every system feeds the next fight.',
    metric: 'Major fronts',
    value: '4 modes',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    to: '/modes',
  },
]

const DINOS = [
  {
    name: 'Tyrannosaurus',
    role: 'Apex breaker',
    threat: 'Front-line pressure',
    copy: 'The roster benchmark. When the formation has to break rather than bend, this is the silhouette you want moving forward.',
    img: asset('dino-tyranno.png'),
    accent: '#ff5a27',
  },
  {
    name: 'Velociraptor',
    role: 'Shock hunter',
    threat: 'Tempo and speed',
    copy: 'Fast, aggressive and built around momentum. Raptors turn a clean opening into pressure before the enemy can reset.',
    img: asset('dino-raptor.png'),
    accent: '#f0c14d',
  },
  {
    name: 'Triceratops',
    role: 'Bulwark',
    threat: 'Formation control',
    copy: 'A defensive anchor with the visual weight of a moving wall. It gives a march the feeling that the line is coming with you.',
    img: asset('dino-triceratops.png'),
    accent: '#38e8ff',
  },
  {
    name: 'Dilophosaurus',
    role: 'Control predator',
    threat: 'Attrition and disruption',
    copy: 'Less brute force, more battlefield control. Dilophosaurus is the kind of threat that changes how the opponent wants to stand.',
    img: asset('dino-dilo.png'),
    accent: '#3dffb5',
  },
  {
    name: 'Stegosaurus',
    role: 'Defense specialist',
    threat: 'Staying power',
    copy: 'Heavy, deliberate and difficult to ignore. A defensive creature for players who want their formation to survive the first impact.',
    img: asset('dino-stego.png'),
    accent: '#8ecb65',
  },
  {
    name: 'Allosaurus',
    role: 'Pursuit hunter',
    threat: 'Target pressure',
    copy: 'A predator built around the feeling of the chase. Allosaurus sits between pure speed and apex brutality.',
    img: asset('dino-allo.png'),
    accent: '#ff9f43',
  },
  {
    name: 'Pterodactyl',
    role: 'Air specialist',
    threat: 'Reach and mobility',
    copy: 'The battlefield looks different from above. Air units give the roster a second axis and make the world feel larger than the ground beneath it.',
    img: asset('dino-ptera.png'),
    accent: '#8bb8ff',
  },
  {
    name: 'Fire Dragon',
    role: 'Special threat',
    threat: 'Area denial',
    copy: 'A rare silhouette that is meant to feel like an event when it arrives. It turns a prehistoric roster into something players remember.',
    img: asset('dino-dragon.png'),
    accent: '#ff3b16',
  },
]

const STRATEGY_LAYERS = [
  {
    index: '01 · Empire',
    title: 'Your city is the engine',
    text: 'Production, buildings, research and progression create the force you eventually put on the world map.',
    img: asset('feature-base-hero.jpg'),
    to: '/features/base',
  },
  {
    index: '02 · Warfront',
    title: 'The world keeps moving',
    text: 'Marches, alliances, targets and territory make the shared map the place where preparation becomes consequence.',
    img: asset('modes/mode-world.jpg'),
    to: '/modes/world-map',
  },
  {
    index: '03 · Campaign',
    title: 'Nine regions to break',
    text: 'A 78-stage solo campaign gives the army a second proving ground away from the live world.',
    img: asset('feature-campaign-hero.jpg'),
    to: '/modes/campaign',
  },
]

export default function HomePage() {
  const motionRef = usePageMotion()
  const [activeModeKey, setActiveModeKey] = useState(MODES[2]?.key ?? MODES[0]!.key)
  const [activeDinoName, setActiveDinoName] = useState(DINOS[0]!.name)

  const activeMode = MODES.find((mode) => mode.key === activeModeKey) ?? MODES[0]!
  const activeModeIndex = Math.max(0, MODES.findIndex((mode) => mode.key === activeMode.key))
  const activeDino = DINOS.find((dino) => dino.name === activeDinoName) ?? DINOS[0]!
  const activeDinoIndex = Math.max(0, DINOS.findIndex((dino) => dino.name === activeDino.name))

  return (
    <div ref={motionRef} className="home-v2">
      {/* ═══ CINEMATIC HERO ═══ */}
      <section className="home-hero-v2" aria-labelledby="home-title">
        <img
          data-hero-bg
          src={asset('hero-poster.png')}
          alt="Dino Warfront prehistoric battlefield"
          className="home-hero-v2__bg"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        <div className="home-hero-v2__shade" aria-hidden />
        <div className="home-hero-v2__heat" aria-hidden />
        <div className="home-hero-v2__grid" aria-hidden />

        <div className="container-dd home-hero-v2__content">
          <div className="home-hero-v2__copy">
            <div data-hero data-hero-delay="0.03" className="home-hero-v2__status">
              <span className="home-hero-v2__status-dot" aria-hidden />
              Friend beta · live strategy build
            </div>

            <h1 id="home-title" data-hero data-hero-delay="0.10" className="home-hero-v2__title">
              <span className="home-hero-v2__title-line">Dino</span>
              <span className="home-hero-v2__title-line home-hero-v2__title-line--accent">
                Warfront
              </span>
            </h1>

            <p data-hero data-hero-delay="0.20" className="home-hero-v2__tagline">
              Build your empire. Command the prehistoric world.
            </p>
            <p data-hero data-hero-delay="0.26" className="home-hero-v2__body">
              A survival strategy game where city building, heroes, dinosaurs, alliances and
              persistent world warfare all feed the same army.
            </p>

            <div data-hero data-hero-delay="0.32" className="home-hero-v2__actions">
              <Link to="/download" className="btn-primary no-underline !px-8 !py-4">
                Play the beta
              </Link>
              <Link to="/modes" className="btn-secondary no-underline">
                Explore warfronts
              </Link>
            </div>

            <div data-hero data-hero-delay="0.40" className="home-hero-v2__micro" aria-label="Game highlights">
              <span>Shared world</span>
              <span>Hero squads</span>
              <span>Dinosaur roster</span>
              <span>Alliance warfare</span>
            </div>
          </div>

          <aside data-hero data-hero-delay="0.24" className="home-command-card" aria-label="Tactical overview">
            <div className="home-command-card__top">
              <span className="home-command-card__eyebrow">Command uplink</span>
              <span className="home-command-card__coords">Sector 08 · Online</span>
            </div>
            <div className="home-command-card__radar" aria-hidden>
              <span className="home-command-card__radar-center" />
            </div>
            <div className="home-command-card__stats">
              <div className="home-command-card__stat">
                <strong>8000 × 8000</strong>
                <span>Persistent world</span>
              </div>
              <div className="home-command-card__stat">
                <strong>78</strong>
                <span>Campaign stages</span>
              </div>
              <div className="home-command-card__stat">
                <strong>4</strong>
                <span>Major modes</span>
              </div>
              <div className="home-command-card__stat">
                <strong>12 + daily</strong>
                <span>Defense maps</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="home-hero-v2__bottom" aria-label="Dino Warfront scope">
          <div className="container-dd home-hero-v2__bottom-inner">
            <div className="home-hero-v2__metric"><strong>Build</strong><span>Your city</span></div>
            <div className="home-hero-v2__metric"><strong>Tame</strong><span>Your roster</span></div>
            <div className="home-hero-v2__metric"><strong>March</strong><span>Your army</span></div>
            <div className="home-hero-v2__metric"><strong>Conquer</strong><span>Your world</span></div>
          </div>
        </div>
      </section>

      {/* Real server telemetry stays directly under the hero. */}
      <WarRoom />

      {/* ═══ THE CORE LOOP ═══ */}
      <section id="war-loop" className="home-section home-loop">
        <div className="container-dd">
          <div className="home-section-head" data-reveal="up">
            <span className="home-section-head__kicker">The strategy loop</span>
            <h2 className="home-section-head__title">
              Every decision feeds
              <br />
              <span className="text-gradient-magma">the next war</span>
            </h2>
            <p className="home-section-head__copy">
              The homepage now tells the game in the same order a commander feels it:
              build the engine, tame the roster, send the march, then fight for position.
            </p>
          </div>

          <div className="home-loop__grid" data-reveal-stagger>
            {WAR_LOOP.map((item) => (
              <Link key={item.step} to={item.to} className="home-loop-card" data-reveal-item>
                <img
                  src={item.img}
                  alt=""
                  className="home-loop-card__image"
                  style={{ objectPosition: item.pos }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="home-loop-card__shade" aria-hidden />
                <div className="home-loop-card__index"><span>{item.step}</span></div>
                <div className="home-loop-card__body">
                  <p className="home-loop-card__kicker">{item.kicker}</p>
                  <h3 className="home-loop-card__title">{item.title}</h3>
                  <p className="home-loop-card__copy">{item.text}</p>
                  <div className="home-loop-card__metric">
                    <span>{item.metric}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE MODE THEATRE ═══ */}
      <section
        id="warfronts"
        className="home-modes-stage"
        style={{ ['--mode-live' as string]: activeMode.accent }}
        aria-labelledby="warfront-title"
      >
        <div className="home-modes-stage__media" aria-hidden>
          <img
            key={activeMode.key}
            src={activeMode.img}
            alt=""
            className="home-modes-stage__image"
            style={{ objectPosition: activeMode.pos }}
            loading="lazy"
            decoding="async"
          />
          <div className="home-modes-stage__scrim" />
          <div className="home-modes-stage__accent" />
        </div>

        <div className="container-dd home-modes-stage__inner">
          <div className="home-mode-copy" data-reveal="left">
            <p className="home-mode-copy__count">
              Warfront {String(activeModeIndex + 1).padStart(2, '0')} · {activeMode.kicker}
            </p>
            <h2 id="warfront-title" className="home-mode-copy__name">{activeMode.name}</h2>
            <p className="home-mode-copy__tagline">{activeMode.tagline}</p>
            <p className="home-mode-copy__body">{activeMode.blurb}</p>

            <div className="home-mode-copy__specs">
              {activeMode.specs.map((spec) => (
                <div key={spec.label} className="home-mode-copy__spec">
                  <strong>{spec.value}</strong>
                  <span>{spec.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={activeMode.to} className="btn-primary no-underline">
                Enter this mode
              </Link>
              <Link to="/modes" className="btn-secondary no-underline">
                Compare all modes
              </Link>
            </div>
          </div>

          <div className="home-mode-nav" role="tablist" aria-label="Select a Dino Warfront game mode" data-reveal="right">
            {MODES.map((mode, index) => {
              const active = mode.key === activeMode.key
              return (
                <button
                  key={mode.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-active={active ? 'true' : undefined}
                  className="home-mode-nav__item"
                  onPointerEnter={() => setActiveModeKey(mode.key)}
                  onFocus={() => setActiveModeKey(mode.key)}
                  onClick={() => setActiveModeKey(mode.key)}
                >
                  <span className="home-mode-nav__num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="home-mode-nav__name">{mode.short}</span>
                  <span className="home-mode-nav__arrow" aria-hidden>→</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ NYRA COMMANDER SPOTLIGHT ═══ */}
      <section id="nyra" className="home-section home-nyra">
        <div className="container-dd home-nyra__grid">
          <div className="home-nyra__visual" data-reveal="left">
            <img
              src={asset('spotlight-nyra.jpg')}
              alt="Nyra Vale, Dino Warfront commander"
              loading="lazy"
              decoding="async"
            />
            <div className="home-nyra__plate">
              <div>
                <p className="home-nyra__plate-role">Field commander · Hero spotlight</p>
                <p className="home-nyra__plate-title">Nyra Vale</p>
              </div>
              <Link to="/features/heroes" className="btn-secondary no-underline !py-2.5 !px-4">
                Open roster
              </Link>
            </div>
          </div>

          <div className="home-nyra__copy" data-reveal="right">
            <span className="home-section-head__kicker">Command has a face</span>
            <h2>
              Lead from
              <br />
              <span className="text-gradient-gold">the front</span>
            </h2>
            <p>
              Dino Warfront is not just a city seen from above. Heroes give the army a
              human identity, while the prehistoric roster gives every formation its silhouette.
              Nyra is the first commander you should recognize before the battlefield fills up.
            </p>

            <div className="home-nyra__doctrine" aria-label="Hero system pillars">
              <div><strong>Command</strong><span>Build a squad</span></div>
              <div><strong>Synergy</strong><span>Pair roles</span></div>
              <div><strong>Progress</strong><span>Grow the roster</span></div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/features/heroes" className="btn-primary no-underline">
                Meet the heroes
              </Link>
              <Link to="/story" className="btn-secondary no-underline">
                Enter the story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE APEX DOSSIER ═══ */}
      <section id="apex" className="home-section home-apex">
        <div className="container-dd">
          <div className="home-section-head home-section-head--center" data-reveal="up">
            <span className="home-section-head__kicker">Apex dossier</span>
            <h2 className="home-section-head__title">
              Your army should look
              <br />
              <span className="text-gradient-magma">prehistoric</span>
            </h2>
            <p className="home-section-head__copy">
              Pick a creature and inspect the roster without loading every giant character image at once.
              The page only pulls the active specimen until you ask for another one.
            </p>
          </div>

          <div
            className="home-apex__grid"
            style={{ ['--apex-accent' as string]: activeDino.accent }}
            data-reveal="up"
          >
            <div className="home-apex__selector" role="tablist" aria-label="Select a dinosaur">
              {DINOS.map((dino, index) => {
                const active = dino.name === activeDino.name
                return (
                  <button
                    key={dino.name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-active={active ? 'true' : undefined}
                    className="home-apex__button"
                    onPointerEnter={() => setActiveDinoName(dino.name)}
                    onFocus={() => setActiveDinoName(dino.name)}
                    onClick={() => setActiveDinoName(dino.name)}
                  >
                    <span className="home-apex__button-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="home-apex__button-name">{dino.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="home-apex__stage">
              <div className="home-apex__stage-grid" aria-hidden />
              <div className="home-apex__number" aria-hidden>{String(activeDinoIndex + 1).padStart(2, '0')}</div>

              <div className="home-apex__dossier">
                <p className="home-apex__dossier-label">Specimen {String(activeDinoIndex + 1).padStart(2, '0')}</p>
                <h3>{activeDino.name}</h3>
                <p className="home-apex__dossier-role">{activeDino.role}</p>
                <p className="home-apex__dossier-copy">{activeDino.copy}</p>
                <div className="home-apex__threat">
                  <span>Battlefield identity</span>
                  <strong>{activeDino.threat}</strong>
                </div>
              </div>

              <div className="home-apex__creature">
                <img
                  key={activeDino.name}
                  src={activeDino.img}
                  alt={activeDino.name}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <div className="home-apex__stage-footer">
                <span>Interactive bestiary preview · switch specimen above</span>
                <Link to="/features/dinos" className="btn-secondary no-underline !py-2.5 !px-4">
                  Full dino intel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real players remain the strongest proof that the build is alive. */}
      <TopCommanders />

      {/* ═══ STRATEGY LAYERS ═══ */}
      <section className="home-section home-section--tight">
        <div className="container-dd">
          <div className="home-section-head" data-reveal="up">
            <span className="home-section-head__kicker">One empire, several layers</span>
            <h2 className="home-section-head__title">
              From the city gate
              <br />
              <span className="text-gradient-gold">to the center of the map</span>
            </h2>
          </div>

          <div className="home-layers__grid" data-reveal-stagger>
            {STRATEGY_LAYERS.map((layer) => (
              <Link key={layer.index} to={layer.to} className="home-layer-card" data-reveal-item>
                <img src={layer.img} alt="" loading="lazy" decoding="async" />
                <div className="home-layer-card__body">
                  <p className="home-layer-card__index">{layer.index}</p>
                  <h3>{layer.title}</h3>
                  <p>{layer.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="home-final">
        <img
          src={asset('hero-dino-volcano.jpg')}
          alt=""
          className="home-final__bg"
          loading="lazy"
          decoding="async"
        />
        <div className="home-final__shade" aria-hidden />
        <div className="container-dd">
          <div className="home-final__body" data-reveal="up">
            <span className="home-section-head__kicker">The gate is open</span>
            <h2 className="home-final__title">
              Build the empire.
              <br />
              <span className="text-gradient-magma">Take the warfront.</span>
            </h2>
            <p className="home-final__copy">
              The website is the command briefing. The beta is where the city, heroes,
              dinosaurs, campaign and shared world actually meet.
            </p>
            <div className="home-final__actions">
              <Link to="/download" className="btn-primary no-underline !px-8 !py-4">
                Download the beta
              </Link>
              <Link to="/progress" className="btn-secondary no-underline">
                See development progress
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
