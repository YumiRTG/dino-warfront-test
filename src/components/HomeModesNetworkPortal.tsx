import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { asset } from '@/lib/assets'

const FEATURES = [
  {
    key: 'defense',
    slot: 'base',
    label: 'TOWER DEFENSE',
    title: 'DAILY SKILL TEST',
    stat: 'RANKED DAILY',
    text: 'A fresh defense challenge every day. Everyone faces the same battlefield and rules — placement, timing and adaptation decide how high you climb.',
    hook: 'Build smarter. React faster. Take the ranking.',
    img: asset('modes/mode-defense.jpg'),
    pos: 'center center',
    accent: '#3dffb5',
    to: '/modes/tower-defense',
    chips: ['Daily challenge', 'Skill ranking', 'Same rules for all'],
  },
  {
    key: 'campaign',
    slot: 'dinos',
    label: 'CAMPAIGN',
    title: 'LIVE RPG FIGHTS',
    stat: '78 STAGES',
    text: 'Push through the prehistoric campaign in real-time RPG battles. Build the right squad, trigger skills at the right moment and adapt while the fight is still happening.',
    hook: 'The campaign is fought — not simulated.',
    img: asset('hero-dino-volcano.jpg'),
    pos: 'center center',
    accent: '#f0c14d',
    to: '/modes/campaign',
    chips: ['Real-time combat', 'Hero + dino squads', 'Boss regions'],
  },
  {
    key: 'world',
    slot: 'heroes',
    label: 'WORLD MAP',
    title: 'FIGHT YOUR WAY',
    stat: 'WORLD ACTIVE',
    text: 'Hunt alone, move with friends or rally your entire alliance. Raid rivals, reinforce allies, fight world bosses and turn a shared map into your territory.',
    hook: 'Solo when you want. Together when it matters.',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    accent: '#38e8ff',
    to: '/modes/world-map',
    chips: ['Solo attacks', 'Alliance rallies', 'Shared persistent world'],
  },
  {
    key: 'arena',
    slot: 'war',
    label: 'ARENA',
    title: 'OUTPLAY THE META',
    stat: 'WEEKLY PVP',
    text: 'Take your strongest formations into competitive ladders. Read the enemy lineup, build the counter and prove your squad can beat another player — not just scripted AI.',
    hook: 'Every defense creates a new counter to solve.',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    accent: '#ff4d1a',
    to: '/modes/arena',
    chips: ['Weekly ladders', 'Counter squads', 'Team Arena'],
  },
  {
    key: 'partner',
    slot: 'partner',
    label: 'PARTNER SYSTEM',
    title: 'RAISE YOUR DINOSAUR',
    stat: 'BABY → APEX',
    text: 'Choose your partner as a baby and raise it beside your empire. Feed it, pet it, strengthen the bond, watch it grow and bring it with you on marches as a true companion.',
    hook: 'You do not unlock a pet. You raise a partner.',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center center',
    accent: '#c78cff',
    to: '/features/dinos',
    chips: ['Baby → adult', 'Feed & bond', 'March together'],
  },
] as const

const CONNECTIONS = [
  [365, 260, 170, 125],
  [635, 260, 830, 125],
  [365, 420, 190, 555],
  [635, 420, 810, 555],
  [500, 450, 500, 585],
]

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pageHref(path: string) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL
  return `${base}${path}`
}

export default function HomeModesNetworkPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.home-exp-home > section'))
    const section = sections.find((candidate) => {
      const heading = candidate.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase()
      return heading?.includes('four ways') && heading.includes('to fight')
    })

    if (!section) return

    const originalChildren = Array.from(section.children) as HTMLElement[]
    const hadSectionBand = section.classList.contains('section-band')
    const previousLabel = section.getAttribute('aria-label')

    originalChildren.forEach((child) => {
      child.hidden = true
    })

    if (hadSectionBand) section.classList.remove('section-band')
    section.classList.add('home-command-showcase', 'home-modes-showcase')
    section.setAttribute('aria-label', 'Dino Warfront core gameplay features')
    section.style.setProperty('--command-accent', FEATURES[0].accent)
    setTarget(section)

    return () => {
      originalChildren.forEach((child) => {
        child.hidden = false
      })
      if (hadSectionBand) section.classList.add('section-band')
      section.classList.remove('home-command-showcase', 'home-modes-showcase')
      section.style.removeProperty('--command-accent')
      if (previousLabel === null) section.removeAttribute('aria-label')
      else section.setAttribute('aria-label', previousLabel)
    }
  }, [])

  useEffect(() => {
    if (!target) return
    target.style.setProperty('--command-accent', FEATURES[active].accent)
  }, [active, target])

  useEffect(() => {
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.26 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [target])

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % FEATURES.length)
    }, 3300)
    return () => window.clearInterval(timer)
  }, [inView, paused])

  if (!target) return null

  const feature = FEATURES[active]

  return createPortal(
    <>
      <div className="home-command-showcase__backdrop" aria-hidden>
        <img src={feature.img} alt="" loading="lazy" decoding="async" style={{ objectPosition: feature.pos }} />
        <div className="home-command-showcase__fog" />
        <div className="home-command-showcase__horizon" />
      </div>

      <div
        className="container-dd relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <header className="home-command-showcase__header">
          <p>WARFRONT SYSTEMS // 05 EXPERIENCES ONLINE</p>
          <h2>
            More than strategy.
            <span> Every system fights differently.</span>
          </h2>
        </header>

        <div className="home-command-board home-feature-command-board">
          <svg className="home-command-lines" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden>
            {CONNECTIONS.map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                data-active={active === index ? 'true' : undefined}
                style={{ stroke: FEATURES[index].accent }}
              />
            ))}
          </svg>

          <div className="home-command-core" aria-hidden>
            <span className="home-command-core__ring home-command-core__ring--outer" />
            <span className="home-command-core__ring home-command-core__ring--inner" />
            <span className="home-command-core__scanner" />
            <div className="home-command-core__content" key={active}>
              <small>{String(active + 1).padStart(2, '0')} / 05</small>
              <strong>WARFRONT</strong>
              <em>{feature.stat}</em>
            </div>
          </div>

          {FEATURES.map((item, index) => (
            <a
              key={item.key}
              href={pageHref(item.to)}
              className={`home-command-node home-command-node--${item.slot}`}
              data-active={active === index ? 'true' : undefined}
              style={{ ['--node-accent' as string]: item.accent }}
              onMouseEnter={() => setActive(index)}
              onFocus={() => {
                setPaused(true)
                setActive(index)
              }}
              onBlur={() => setPaused(false)}
            >
              <img src={item.img} alt="" style={{ objectPosition: item.pos }} loading="lazy" decoding="async" />
              <div className="home-command-node__shade" />
              <div className="home-command-node__signal" aria-hidden><i /><i /><i /></div>
              <div className="home-command-node__copy">
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <small>{item.stat}</small>
              </div>
              <b className="home-command-node__open">OPEN ↗</b>
            </a>
          ))}
        </div>

        <div
          className="mt-4 border border-white/[.08] bg-black/30 px-5 py-5 md:px-7 md:py-6"
          style={{ boxShadow: `inset 3px 0 0 ${feature.accent}, 0 20px 60px rgba(0,0,0,.22)` }}
        >
          <div className="grid md:grid-cols-[1.35fr_.65fr] gap-5 md:gap-8 items-end">
            <div>
              <p className="font-ui text-[9px] md:text-[10px] tracking-[.24em] uppercase" style={{ color: feature.accent }}>
                ACTIVE FEATURE // {feature.label}
              </p>
              <h3 className="font-display text-2xl md:text-4xl text-white uppercase mt-2 leading-none">
                {feature.title}
              </h3>
              <p className="font-body text-sm md:text-base text-white/65 leading-relaxed mt-3 max-w-3xl">
                {feature.text}
              </p>
              <p className="font-display uppercase text-base md:text-lg mt-3" style={{ color: feature.accent }}>
                {feature.hook}
              </p>
            </div>
            <div className="flex md:justify-end flex-wrap gap-2">
              {feature.chips.map((chip) => (
                <span
                  key={chip}
                  className="font-ui text-[9px] tracking-[.14em] uppercase px-3 py-2 border bg-black/30"
                  style={{ borderColor: `${feature.accent}55`, color: '#fff' }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="home-command-showcase__footer">
          <span className="home-command-showcase__pulse"><i /> 05 SYSTEMS LIVE</span>
          <strong>{feature.label}</strong>
          <span>Hover a feature · radar cycles automatically</span>
        </div>
      </div>
    </>,
    target,
  )
}
