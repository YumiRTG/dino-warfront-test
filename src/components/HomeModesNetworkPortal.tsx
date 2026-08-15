import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { asset } from '@/lib/assets'

const FEATURES = [
  {
    key: 'defense',
    eyebrow: 'Tower Defense',
    title: 'Daily Skill Test',
    text: 'Defend a fresh challenge every day. Everyone gets the same battlefield and the same rules — your decisions decide how high you climb.',
    hook: 'Build smarter. React faster. Take the ranking.',
    img: asset('modes/mode-defense.jpg'),
    pos: 'center center',
    accent: '#3dffb5',
    to: '/modes/tower-defense',
    chips: ['Daily challenge', 'Skill ranking', '5 tower types'],
  },
  {
    key: 'campaign',
    eyebrow: 'Campaign',
    title: 'Live RPG Battles',
    text: 'Push through the prehistoric campaign in real-time RPG fights. Build your squad, use the right heroes and dinosaurs, and adapt while the battle is happening.',
    hook: 'The campaign is fought — not simulated.',
    img: asset('hero-dino-volcano.jpg'),
    pos: 'center center',
    accent: '#f0c14d',
    to: '/modes/campaign',
    chips: ['Real-time combat', '78 stages', 'Boss regions'],
  },
  {
    key: 'world',
    eyebrow: 'World Map',
    title: 'Fight Your Way',
    text: 'Hunt alone, move with friends or rally your entire alliance. Raid rivals, reinforce allies, fight bosses and turn a shared world into your territory.',
    hook: 'Solo when you want. Together when it matters.',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    accent: '#38e8ff',
    to: '/modes/world-map',
    chips: ['Solo & co-op', 'Alliance rallies', 'Shared world'],
  },
  {
    key: 'arena',
    eyebrow: 'Arena',
    title: 'Build The Counter',
    text: 'Take your strongest squads into weekly PvP ladders. Read the enemy lineup, create the counter and prove that your strategy survives another player.',
    hook: 'Two ladders. Endless ways to outplay the meta.',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    accent: '#ff4d1a',
    to: '/modes/arena',
    chips: ['Weekly ladders', 'Squad tactics', 'Team Arena'],
  },
  {
    key: 'partner',
    eyebrow: 'Partner System',
    title: 'Raise Your Dinosaur',
    text: 'Start with a baby dinosaur and make it yours. Feed it, bond with it, let it grow beside you and bring your partner along as your empire gets stronger.',
    hook: 'You do not unlock a pet. You raise a companion.',
    img: asset('dino-raptor.png'),
    pos: 'center center',
    accent: '#c78cff',
    to: '/features/dinos',
    chips: ['Baby → adult', 'Bond & grow', 'March together'],
    contain: true,
  },
] as const

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

    const oldNetwork = sections.find((candidate) => {
      const heading = candidate.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase()
      return heading?.includes('one empire') && heading.includes('everything connected')
    })

    if (oldNetwork) oldNetwork.hidden = true

    const section = sections.find((candidate) => {
      const heading = candidate.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase()
      return heading?.includes('four ways') && heading.includes('to fight')
    })

    if (!section) {
      return () => {
        if (oldNetwork) oldNetwork.hidden = false
      }
    }

    const originalChildren = Array.from(section.children) as HTMLElement[]
    const previousLabel = section.getAttribute('aria-label')

    originalChildren.forEach((child) => {
      child.hidden = true
    })

    section.classList.add('home-feature-pitch')
    section.setAttribute('aria-label', 'Dino Warfront gameplay features')
    setTarget(section)

    return () => {
      if (oldNetwork) oldNetwork.hidden = false
      originalChildren.forEach((child) => {
        child.hidden = false
      })
      section.classList.remove('home-feature-pitch')
      if (previousLabel === null) section.removeAttribute('aria-label')
      else section.setAttribute('aria-label', previousLabel)
    }
  }, [])

  useEffect(() => {
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.24 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [target])

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % FEATURES.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [inView, paused])

  if (!target) return null

  const feature = FEATURES[active]

  return createPortal(
    <div
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: `
          radial-gradient(circle at 20% 15%, color-mix(in srgb, ${feature.accent} 14%, transparent), transparent 32%),
          radial-gradient(circle at 82% 78%, rgba(255,77,26,.10), transparent 30%),
          linear-gradient(180deg, #06050c 0%, #0a0712 48%, #05040a 100%)
        `,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
        }}
      />

      <div className="container-dd relative z-10">
        <header className="max-w-4xl mb-10 md:mb-14">
          <p className="font-ui text-[10px] md:text-xs tracking-[0.30em] uppercase text-[var(--gold)] mb-4">
            Core gameplay // 05 experiences
          </p>
          <h2 className="font-display uppercase text-white leading-[0.88] tracking-[-0.035em] text-[clamp(3rem,7vw,6.8rem)]">
            More than a
            <br />
            <span style={{ color: feature.accent, textShadow: `0 0 38px ${feature.accent}44` }}>
              strategy game.
            </span>
          </h2>
          <p className="body-lg mt-6 max-w-2xl">
            Build an empire, then actually use it. Every major system gives you a different reason to log in, improve and fight.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1.55fr_.85fr] gap-4 lg:gap-5 items-stretch">
          <a
            href={pageHref(feature.to)}
            className="group relative min-h-[33rem] md:min-h-[38rem] overflow-hidden border border-white/10 no-underline text-inherit bg-[#090710]"
            style={{ boxShadow: `0 28px 90px rgba(0,0,0,.5), 0 0 50px ${feature.accent}16` }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {feature.contain ? (
                <>
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage: `url(${asset('env-base.png')})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(.55) saturate(.8)',
                    }}
                  />
                  <img
                    key={feature.key}
                    src={feature.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain p-10 md:p-16 transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                </>
              ) : (
                <img
                  key={feature.key}
                  src={feature.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  style={{ objectPosition: feature.pos }}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(5,4,10,.96) 0%, rgba(5,4,10,.72) 38%, rgba(5,4,10,.18) 75%), linear-gradient(to top, rgba(5,4,10,.96) 0%, transparent 58%)',
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent 70%)` }}
            />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="h-px w-10"
                    style={{ background: feature.accent, boxShadow: `0 0 12px ${feature.accent}` }}
                  />
                  <span
                    className="font-ui text-[10px] tracking-[0.26em] uppercase"
                    style={{ color: feature.accent }}
                  >
                    {feature.eyebrow}
                  </span>
                </div>

                <h3 className="font-display text-white uppercase text-[clamp(2.4rem,5vw,5rem)] leading-[.9] tracking-[-.025em]">
                  {feature.title}
                </h3>
                <p className="font-body text-base md:text-lg text-white/75 leading-relaxed mt-5 max-w-lg">
                  {feature.text}
                </p>
                <p className="font-display uppercase text-lg md:text-xl mt-4" style={{ color: feature.accent }}>
                  {feature.hook}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {feature.chips.map((chip) => (
                    <span
                      key={chip}
                      className="font-ui text-[9px] md:text-[10px] tracking-[0.14em] uppercase px-3 py-2 border bg-black/30"
                      style={{ borderColor: `${feature.accent}55`, color: '#fff' }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-8 inline-flex items-center gap-3 font-ui text-[10px] tracking-[0.22em] uppercase text-white group-hover:gap-5 transition-all">
                  Explore feature <span style={{ color: feature.accent }}>↗</span>
                </div>
              </div>
            </div>

            <div className="absolute top-5 right-5 md:top-7 md:right-7 font-display text-5xl md:text-7xl text-white/[.08]">
              0{active + 1}
            </div>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {FEATURES.map((item, index) => {
              const selected = index === active
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(index)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  className="relative overflow-hidden text-left min-h-[6.3rem] border px-5 py-4 transition-all duration-300"
                  style={{
                    borderColor: selected ? `${item.accent}99` : 'rgba(255,255,255,.08)',
                    background: selected
                      ? `linear-gradient(105deg, ${item.accent}18, rgba(12,9,20,.92) 48%)`
                      : 'rgba(10,8,17,.72)',
                    boxShadow: selected ? `0 0 30px ${item.accent}12` : 'none',
                  }}
                >
                  {selected && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ background: item.accent, boxShadow: `0 0 14px ${item.accent}` }}
                    />
                  )}
                  <div className="flex items-start gap-4">
                    <span
                      className="font-ui text-[9px] tracking-[.18em] mt-1"
                      style={{ color: selected ? item.accent : 'rgba(255,255,255,.28)' }}
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p
                        className="font-ui text-[9px] tracking-[.20em] uppercase"
                        style={{ color: selected ? item.accent : 'rgba(255,255,255,.38)' }}
                      >
                        {item.eyebrow}
                      </p>
                      <strong className="block font-display uppercase text-lg md:text-xl text-white mt-1 leading-none">
                        {item.title}
                      </strong>
                      <span className="block font-body text-xs text-white/42 mt-2 leading-snug">
                        {item.chips.join(' · ')}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.07] pt-6">
          <p className="font-ui text-[9px] md:text-[10px] tracking-[.18em] uppercase text-white/35">
            Choose a feature · the showcase cycles automatically
          </p>
          <a href={pageHref('/features')} className="btn-secondary no-underline">
            Explore the whole game
          </a>
        </div>
      </div>
    </div>,
    target,
  )
}
