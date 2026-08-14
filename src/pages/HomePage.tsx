import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'
import { MODES } from '@/config/modes'
import TopCommanders from '@/sections/TopCommanders'
import WarRoom from '@/sections/WarRoom'
import './HomePage.css'

const SECTION_NAV = [
  { id: 'empire', num: '01', label: 'Empire' },
  { id: 'commander', num: '02', label: 'Commander' },
  { id: 'beasts', num: '03', label: 'Beasts' },
  { id: 'fronts', num: '04', label: 'Fronts' },
  { id: 'live', num: '05', label: 'Live' },
]

const BROADCAST = [
  'FRIEND BETA ACTIVE',
  '8000 × 8000 SHARED WORLD',
  '78 CAMPAIGN STAGES',
  'WEEKLY ARENA SEASONS',
  '12 + DAILY DEFENSE MAPS',
  'DINOSAURS ARE COMBAT UNITS',
]

const WAR_CHAPTERS = [
  {
    number: '01',
    signal: 'CITY // ECONOMY // PROGRESSION',
    eyebrow: 'Build the engine',
    title: 'Raise a city that can survive the war outside.',
    body: 'Your base is not a menu between battles. Production, upgrades and long-term progression decide how much power you can actually put on the map when the pressure arrives.',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 40%',
    stats: [
      ['Economy', 'Always moving'],
      ['Purpose', 'Fund every march'],
    ],
    to: '/features/base',
    cta: 'Enter the city system',
  },
  {
    number: '02',
    signal: 'ROSTER // HEROES // DINOSAURS',
    eyebrow: 'Build the army',
    title: 'Command people. Tame predators. Make them fight as one.',
    body: 'Heroes shape the decision layer. Dinosaurs shape the battlefield. Speed, control, defense and raw pressure are meant to combine into a roster that feels like your own army instead of a stack of numbers.',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center center',
    stats: [
      ['Identity', 'Role-driven roster'],
      ['Fantasy', 'Prehistoric command'],
    ],
    to: '/features/dinos',
    cta: 'Open the roster',
  },
  {
    number: '03',
    signal: 'MARCHES // ALLIANCES // TERRITORY',
    eyebrow: 'Leave the walls',
    title: 'The world map is where preparation becomes consequence.',
    body: 'Scout, gather, hunt, reinforce, raid and rally across one shared persistent world. Every visible base belongs to another commander, and the safest place on the map is still only the outer ring.',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    stats: [
      ['World', '8000 × 8000'],
      ['Danger', '5 concentric zones'],
    ],
    to: '/modes/world-map',
    cta: 'Open the world map',
  },
  {
    number: '04',
    signal: 'ARENA // CAMPAIGN // DEFENSE',
    eyebrow: 'Fight on every front',
    title: 'One army. Four completely different ways to prove it.',
    body: 'Real-time defense, two competitive ladders, a persistent shared world and a 78-stage campaign all ask for different decisions. The point is not to build one perfect squad. It is to build an empire that adapts.',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    stats: [
      ['Major fronts', '4'],
      ['Campaign', '78 stages'],
    ],
    to: '/modes',
    cta: 'Compare every mode',
  },
]

const DINOS = [
  {
    name: 'Tyrannosaurus',
    short: 'T-Rex',
    role: 'Apex breaker',
    field: 'Front-line pressure',
    copy: 'The benchmark for brute force. When the formation needs to break instead of bend, this is the silhouette that should be moving forward.',
    img: asset('dino-tyranno.png'),
    accent: '#ff5a27',
  },
  {
    name: 'Velociraptor',
    short: 'Raptor',
    role: 'Shock hunter',
    field: 'Tempo and speed',
    copy: 'Fast pressure that rewards momentum. The raptor fantasy is about turning an opening into a problem before the enemy can reset.',
    img: asset('dino-raptor.png'),
    accent: '#f0c14d',
  },
  {
    name: 'Triceratops',
    short: 'Trike',
    role: 'Bulwark',
    field: 'Formation control',
    copy: 'A moving wall. Triceratops gives a march defensive weight and creates the feeling that the line itself is advancing with you.',
    img: asset('dino-triceratops.png'),
    accent: '#38e8ff',
  },
  {
    name: 'Dilophosaurus',
    short: 'Dilo',
    role: 'Control predator',
    field: 'Attrition and disruption',
    copy: 'Less about one crushing hit, more about changing how the opponent is allowed to stand. Control is a weapon when the battlefield is crowded.',
    img: asset('dino-dilo.png'),
    accent: '#3dffb5',
  },
  {
    name: 'Stegosaurus',
    short: 'Stego',
    role: 'Defense specialist',
    field: 'Staying power',
    copy: 'Heavy, deliberate and difficult to move. A defensive creature for commanders who want the formation to survive the first impact.',
    img: asset('dino-stego.png'),
    accent: '#8ecb65',
  },
  {
    name: 'Allosaurus',
    short: 'Allo',
    role: 'Pursuit hunter',
    field: 'Target pressure',
    copy: 'A predator built around pursuit. Allosaurus sits between pure speed and apex brutality and keeps the pressure feeling personal.',
    img: asset('dino-allo.png'),
    accent: '#ff9f43',
  },
  {
    name: 'Pterodactyl',
    short: 'Ptera',
    role: 'Air specialist',
    field: 'Reach and mobility',
    copy: 'The battlefield changes when the roster gains a second axis. Air presence makes the world feel bigger than the ground beneath the march.',
    img: asset('dino-ptera.png'),
    accent: '#8bb8ff',
  },
  {
    name: 'Fire Dragon',
    short: 'Dragon',
    role: 'Special threat',
    field: 'Area denial',
    copy: 'A rare silhouette that should feel like an event when it enters the frame. Some units exist to change the memory of the battle.',
    img: asset('dino-dragon.png'),
    accent: '#ff3b16',
  },
]

const TRANSMISSIONS = [
  {
    label: 'City command',
    title: 'Your empire is visible before it is powerful.',
    img: asset('feature-base-hero.jpg'),
    to: '/features/base',
  },
  {
    label: 'Persistent war',
    title: 'The map does not wait for you to log back in.',
    img: asset('modes/mode-world.jpg'),
    to: '/modes/world-map',
  },
  {
    label: 'Campaign',
    title: 'Nine regions give the army a second proving ground.',
    img: asset('feature-campaign-hero.jpg'),
    to: '/modes/campaign',
  },
]

export default function HomePage() {
  const motionRef = usePageMotion()
  const heroRef = useRef<HTMLElement>(null)
  const [activeModeKey, setActiveModeKey] = useState(MODES[2]?.key ?? MODES[0]!.key)
  const [activeDinoIndex, setActiveDinoIndex] = useState(0)

  const activeMode = MODES.find((mode) => mode.key === activeModeKey) ?? MODES[0]!
  const activeModeIndex = Math.max(0, MODES.findIndex((mode) => mode.key === activeMode.key))
  const activeDino = DINOS[activeDinoIndex] ?? DINOS[0]!

  useEffect(() => {
    const root = motionRef.current
    if (!root) return

    let raf = 0
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      root.style.setProperty('--du-scroll', String(Math.min(1, window.scrollY / max)))
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [motionRef])

  const moveDino = (direction: number) => {
    setActiveDinoIndex((current) => (current + direction + DINOS.length) % DINOS.length)
  }

  return (
    <div ref={motionRef} className="du-home">
      <div className="du-progress" aria-hidden />

      <nav className="du-rail" aria-label="Homepage sections">
        <a href="#top" className="du-rail__brand" aria-label="Back to top">DW</a>
        <div className="du-rail__line" aria-hidden />
        {SECTION_NAV.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="du-rail__link">
            <span>{item.num}</span>
            <b>{item.label}</b>
          </a>
        ))}
      </nav>

      {/* ═══ CINEMATIC OPENING ═══ */}
      <section
        ref={heroRef}
        id="top"
        className="du-hero"
        aria-labelledby="du-title"
        onPointerMove={(event) => {
          if (!window.matchMedia('(pointer: fine)').matches) return
          const rect = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
          event.currentTarget.style.setProperty('--du-mx', x.toFixed(3))
          event.currentTarget.style.setProperty('--du-my', y.toFixed(3))
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty('--du-mx', '0')
          event.currentTarget.style.setProperty('--du-my', '0')
        }}
      >
        <img
          data-hero-bg
          src={asset('hero-poster.png')}
          alt="Dino Warfront prehistoric battlefield"
          className="du-hero__bg"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        <div className="du-hero__wash" aria-hidden />
        <div className="du-hero__grid" aria-hidden />
        <div className="du-hero__scan" aria-hidden />
        <div className="du-hero__flare du-hero__flare--a" aria-hidden />
        <div className="du-hero__flare du-hero__flare--b" aria-hidden />
        <img
          src={asset('dino-ptera.png')}
          alt=""
          className="du-hero__ptera"
          aria-hidden
          decoding="async"
        />

        <div className="container-dd du-hero__inner">
          <div className="du-hero__copy">
            <div data-hero data-hero-delay="0.02" className="du-kicker du-kicker--live">
              <span className="du-live-dot" aria-hidden />
              Friend beta // strategy survival
            </div>

            <h1 id="du-title" data-hero data-hero-delay="0.08" className="du-hero__title">
              <span className="du-hero__title-ghost" aria-hidden>WARFRONT</span>
              <span>Dino</span>
              <strong>Warfront</strong>
            </h1>

            <div data-hero data-hero-delay="0.18" className="du-hero__statement">
              <span className="du-hero__statement-rule" aria-hidden />
              <p>
                Build the city. Tame the predators. Send the march.
                <b> Own the map.</b>
              </p>
            </div>

            <div data-hero data-hero-delay="0.26" className="du-hero__actions">
              <Link to="/download" className="du-button du-button--primary">
                <span>Play the beta</span>
                <i aria-hidden>↗</i>
              </Link>
              <Link to="/modes" className="du-button du-button--ghost">
                <span>Explore the warfront</span>
                <i aria-hidden>→</i>
              </Link>
            </div>
          </div>

          <aside data-hero data-hero-delay="0.22" className="du-hero__intel" aria-label="Game scope">
            <div className="du-hero__intel-head">
              <span>COMMAND SIGNAL</span>
              <b>ONLINE</b>
            </div>
            <div className="du-hero__radar" aria-hidden>
              <span className="du-hero__radar-core" />
              <span className="du-hero__radar-contact du-hero__radar-contact--a" />
              <span className="du-hero__radar-contact du-hero__radar-contact--b" />
              <span className="du-hero__radar-contact du-hero__radar-contact--c" />
            </div>
            <div className="du-hero__intel-grid">
              <div><strong>8000²</strong><span>Shared world</span></div>
              <div><strong>78</strong><span>Campaign stages</span></div>
              <div><strong>4</strong><span>Major fronts</span></div>
              <div><strong>24/7</strong><span>Persistent pressure</span></div>
            </div>
          </aside>
        </div>

        <div className="du-hero__footer">
          <div className="container-dd du-hero__footer-inner">
            <div className="du-hero__coordinates">
              <span>WORLD // SECTOR 08</span>
              <b>PREHISTORIC COMMAND NETWORK</b>
            </div>
            <a href="#empire" className="du-scroll-cue">
              <span>Enter the war</span>
              <i aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <WarRoom />

      <div className="du-broadcast" aria-hidden>
        <div className="du-broadcast__track">
          {[...BROADCAST, ...BROADCAST].map((item, index) => (
            <span key={`${item}-${index}`}>
              <i />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ EDITORIAL SCROLL STORY ═══ */}
      <section id="empire" className="du-story" aria-labelledby="du-story-title">
        <div className="container-dd du-section-intro" data-reveal="up">
          <p className="du-kicker">The command loop // 01</p>
          <h2 id="du-story-title">
            Strategy should feel like
            <span>cause and consequence.</span>
          </h2>
          <p>
            Every layer exists to feed the next one. The city creates capacity. The roster creates identity.
            The world creates risk. The warfront decides whether any of it was enough.
          </p>
        </div>

        <div className="du-story__chapters">
          {WAR_CHAPTERS.map((chapter, index) => (
            <article
              key={chapter.number}
              className={`du-chapter ${index % 2 ? 'du-chapter--reverse' : ''}`}
            >
              <div className="du-chapter__media" data-reveal={index % 2 ? 'left' : 'right'}>
                <img
                  src={chapter.img}
                  alt=""
                  className="du-chapter__image"
                  style={{ objectPosition: chapter.pos }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="du-chapter__media-shade" aria-hidden />
                <span className="du-chapter__number" aria-hidden>{chapter.number}</span>
                <div className="du-chapter__signal">{chapter.signal}</div>
              </div>

              <div className="du-chapter__copy" data-reveal={index % 2 ? 'right' : 'left'}>
                <p className="du-kicker">{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p className="du-chapter__body">{chapter.body}</p>
                <div className="du-chapter__stats">
                  {chapter.stats.map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <Link to={chapter.to} className="du-text-link">
                  {chapter.cta}
                  <i aria-hidden>↗</i>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ COMMANDER SPOTLIGHT ═══ */}
      <section id="commander" className="du-commander" aria-labelledby="du-commander-title">
        <div className="du-commander__ghost" aria-hidden>NYRA</div>
        <div className="du-commander__light" aria-hidden />
        <div className="container-dd du-commander__inner">
          <div className="du-commander__copy" data-reveal="left">
            <p className="du-kicker">Commander spotlight // 02</p>
            <h2 id="du-commander-title">
              An army needs
              <span>a face.</span>
            </h2>
            <p className="du-commander__lead">
              Nyra Vale is the first commander players meet, but the hero system is bigger than one character.
              Build squads around roles, timing and the kind of warfront you are entering.
            </p>
            <div className="du-commander__facts">
              <div><span>System</span><strong>Hero command</strong></div>
              <div><span>Purpose</span><strong>Squad identity</strong></div>
              <div><span>Used across</span><strong>Multiple fronts</strong></div>
            </div>
            <Link to="/features/heroes" className="du-button du-button--primary">
              <span>Meet the commanders</span>
              <i aria-hidden>↗</i>
            </Link>
          </div>

          <div className="du-commander__visual" data-reveal="right">
            <div className="du-commander__frame" aria-hidden />
            <img
              src={asset('hero-nyra.png')}
              alt="Nyra Vale"
              className="du-commander__image"
              loading="lazy"
              decoding="async"
            />
            <div className="du-commander__tag du-commander__tag--top">
              <span>FIELD COMMAND</span>
              <b>NYRA VALE</b>
            </div>
            <div className="du-commander__tag du-commander__tag--bottom">
              <span>STATUS</span>
              <b>READY</b>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE BESTIARY ═══ */}
      <section
        id="beasts"
        className="du-bestiary"
        style={{ ['--du-accent' as string]: activeDino.accent }}
        aria-labelledby="du-bestiary-title"
      >
        <div className="du-bestiary__glow" aria-hidden />
        <div className="container-dd du-bestiary__inner">
          <div className="du-bestiary__header" data-reveal="up">
            <div>
              <p className="du-kicker">Apex dossier // 03</p>
              <h2 id="du-bestiary-title">Choose the silhouette <span>they remember.</span></h2>
            </div>
            <p>
              Dinosaurs are presented like a roster, not a gallery. Pick one and the whole dossier changes around it.
            </p>
          </div>

          <div className="du-bestiary__stage">
            <div className="du-bestiary__selector" role="tablist" aria-label="Choose a dinosaur" data-reveal="left">
              {DINOS.map((dino, index) => {
                const active = index === activeDinoIndex
                return (
                  <button
                    key={dino.name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-active={active ? 'true' : undefined}
                    onPointerEnter={() => setActiveDinoIndex(index)}
                    onFocus={() => setActiveDinoIndex(index)}
                    onClick={() => setActiveDinoIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{dino.short}</strong>
                  </button>
                )
              })}
            </div>

            <div className="du-bestiary__creature" data-reveal="scale">
              <div className="du-bestiary__name-ghost" aria-hidden>{activeDino.short}</div>
              <div className="du-bestiary__rings" aria-hidden />
              <img
                key={activeDino.name}
                src={activeDino.img}
                alt={activeDino.name}
                className="du-bestiary__image"
                decoding="async"
              />
              <div className="du-bestiary__counter">
                <span>{String(activeDinoIndex + 1).padStart(2, '0')}</span>
                <i />
                <span>{String(DINOS.length).padStart(2, '0')}</span>
              </div>
              <button type="button" className="du-bestiary__arrow du-bestiary__arrow--prev" onClick={() => moveDino(-1)} aria-label="Previous dinosaur">←</button>
              <button type="button" className="du-bestiary__arrow du-bestiary__arrow--next" onClick={() => moveDino(1)} aria-label="Next dinosaur">→</button>
            </div>

            <div className="du-bestiary__intel" data-reveal="right" aria-live="polite">
              <p className="du-kicker">Selected asset</p>
              <h3>{activeDino.name}</h3>
              <p className="du-bestiary__role">{activeDino.role}</p>
              <p className="du-bestiary__copy">{activeDino.copy}</p>
              <div className="du-bestiary__field">
                <span>Battlefield identity</span>
                <strong>{activeDino.field}</strong>
              </div>
              <Link to="/features/dinos" className="du-text-link">
                Open full dino intel
                <i aria-hidden>↗</i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GAME MODE THEATRE ═══ */}
      <section
        id="fronts"
        className="du-fronts"
        style={{ ['--du-mode-accent' as string]: activeMode.accent }}
        aria-labelledby="du-fronts-title"
      >
        <div className="du-fronts__media" aria-hidden>
          <img
            key={activeMode.key}
            src={activeMode.img}
            alt=""
            className="du-fronts__image"
            style={{ objectPosition: activeMode.pos }}
            loading="lazy"
            decoding="async"
          />
          <div className="du-fronts__shade" />
        </div>

        <div className="container-dd du-fronts__inner">
          <div className="du-fronts__title" data-reveal="left">
            <p className="du-kicker">Warfront theatre // 04</p>
            <h2 id="du-fronts-title">Four fronts. <span>No safe build.</span></h2>
          </div>

          <div className="du-fronts__tabs" role="tablist" aria-label="Choose a game mode" data-reveal="up">
            {MODES.map((mode, index) => {
              const active = mode.key === activeMode.key
              return (
                <button
                  key={mode.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-active={active ? 'true' : undefined}
                  onPointerEnter={() => setActiveModeKey(mode.key)}
                  onFocus={() => setActiveModeKey(mode.key)}
                  onClick={() => setActiveModeKey(mode.key)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{mode.short}</strong>
                </button>
              )
            })}
          </div>

          <div className="du-fronts__content">
            <div className="du-fronts__copy" data-reveal="left">
              <p className="du-fronts__count">FRONT {String(activeModeIndex + 1).padStart(2, '0')} / {String(MODES.length).padStart(2, '0')}</p>
              <h3>{activeMode.name}</h3>
              <p className="du-fronts__tagline">{activeMode.tagline}</p>
              <p className="du-fronts__body">{activeMode.blurb}</p>
              <div className="du-fronts__actions">
                <Link to={activeMode.to} className="du-button du-button--primary">
                  <span>Enter this front</span>
                  <i aria-hidden>↗</i>
                </Link>
                <Link to="/modes" className="du-button du-button--ghost">
                  <span>All game modes</span>
                  <i aria-hidden>→</i>
                </Link>
              </div>
            </div>

            <div className="du-fronts__specs" data-reveal="right">
              {activeMode.specs.map((spec, index) => (
                <div key={spec.label}>
                  <span>{String(index + 1).padStart(2, '0')} // {spec.label}</span>
                  <strong>{spec.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FIELD TRANSMISSIONS / VISUAL RHYTHM ═══ */}
      <section className="du-transmissions" aria-labelledby="du-transmissions-title">
        <div className="container-dd">
          <div className="du-section-intro du-section-intro--compact" data-reveal="up">
            <p className="du-kicker">Field transmissions</p>
            <h2 id="du-transmissions-title">A warfront should <span>look alive before you click.</span></h2>
          </div>

          <div className="du-transmissions__grid" data-reveal-stagger>
            {TRANSMISSIONS.map((item, index) => (
              <Link key={item.label} to={item.to} className={`du-transmission du-transmission--${index + 1}`} data-reveal-item>
                <img src={item.img} alt="" loading="lazy" decoding="async" />
                <div className="du-transmission__shade" />
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <i aria-hidden>↗</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVE COMPETITIVE PROOF ═══ */}
      <section id="live" className="du-live-board" aria-labelledby="du-live-title">
        <div className="container-dd du-live-board__head" data-reveal="up">
          <div>
            <p className="du-kicker du-kicker--live"><span className="du-live-dot" aria-hidden />Live world data // 05</p>
            <h2 id="du-live-title">The website watches <span>the same war.</span></h2>
          </div>
          <p>
            Live ranking data keeps the landing page connected to the actual game instead of becoming a static brochure.
          </p>
        </div>
        <TopCommanders />
      </section>

      {/* ═══ END CARD ═══ */}
      <section className="du-end" aria-labelledby="du-end-title">
        <img src={asset('banner-bg.png')} alt="" className="du-end__bg" loading="lazy" decoding="async" />
        <div className="du-end__shade" aria-hidden />
        <div className="du-end__grid" aria-hidden />
        <img src={asset('dino-dragon.png')} alt="" className="du-end__dragon" loading="lazy" decoding="async" aria-hidden />
        <div className="container-dd du-end__inner" data-reveal="scale">
          <p className="du-kicker">The map is waiting</p>
          <h2 id="du-end-title">
            Stop reading about
            <span>the warfront.</span>
          </h2>
          <p>
            Download the friend beta, build the first city and see how far the army survives once the gates open.
          </p>
          <div className="du-end__actions">
            <Link to="/download" className="du-button du-button--primary du-button--large">
              <span>Download Dino Warfront</span>
              <i aria-hidden>↗</i>
            </Link>
            <Link to="/features" className="du-button du-button--ghost du-button--large">
              <span>Explore every system</span>
              <i aria-hidden>→</i>
            </Link>
          </div>
          <div className="du-end__meta">
            <span>FRIEND BETA</span>
            <span>ANDROID APK</span>
            <span>PREHISTORIC STRATEGY</span>
          </div>
        </div>
      </section>
    </div>
  )
}
