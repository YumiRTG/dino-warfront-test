import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MODES } from '@/config/modes'
import { asset } from '@/lib/assets'

const SLOT_CLASSES = ['base', 'dinos', 'heroes', 'war'] as const

const CONNECTIONS = [
  [360, 245, 210, 130],
  [640, 245, 790, 125],
  [365, 375, 220, 500],
  [635, 375, 790, 500],
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
    section.setAttribute('aria-label', 'Dino Warfront combat modes')
    section.style.setProperty('--command-accent', MODES[0].accent)
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
    target.style.setProperty('--command-accent', MODES[active].accent)
  }, [active, target])

  useEffect(() => {
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.28 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [target])

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % MODES.length)
    }, 2300)
    return () => window.clearInterval(timer)
  }, [inView, paused])

  if (!target) return null

  const activeMode = MODES[active]

  return createPortal(
    <>
      <div className="home-command-showcase__backdrop" aria-hidden>
        <img src={asset('modes/mode-world.jpg')} alt="" loading="lazy" decoding="async" />
        <div className="home-command-showcase__fog" />
        <div className="home-command-showcase__horizon" />
      </div>

      <div className="container-dd relative z-10">
        <header className="home-command-showcase__header">
          <p>COMBAT NETWORK // 04 MODES ONLINE</p>
          <h2>
            Four ways
            <span> to fight.</span>
          </h2>
        </header>

        <div className="home-command-board">
          <svg className="home-command-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden>
            {CONNECTIONS.map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                data-active={active === index ? 'true' : undefined}
                style={{ stroke: MODES[index].accent }}
              />
            ))}
          </svg>

          <div className="home-command-core" aria-hidden>
            <span className="home-command-core__ring home-command-core__ring--outer" />
            <span className="home-command-core__ring home-command-core__ring--inner" />
            <span className="home-command-core__scanner" />
            <div className="home-command-core__content" key={active}>
              <small>{String(active + 1).padStart(2, '0')} / 04</small>
              <strong>COMBAT</strong>
              <em>{activeMode.specs[0]?.value}</em>
            </div>
          </div>

          {MODES.map((mode, index) => (
            <a
              key={mode.key}
              href={pageHref(mode.to)}
              className={`home-command-node home-command-node--${SLOT_CLASSES[index]}`}
              data-active={active === index ? 'true' : undefined}
              style={{ ['--node-accent' as string]: mode.accent }}
              onMouseEnter={() => {
                setPaused(true)
                setActive(index)
              }}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => {
                setPaused(true)
                setActive(index)
              }}
              onBlur={() => setPaused(false)}
            >
              <img src={mode.img} alt="" style={{ objectPosition: mode.pos }} loading="lazy" decoding="async" />
              <div className="home-command-node__shade" />
              <div className="home-command-node__signal" aria-hidden><i /><i /><i /></div>
              <div className="home-command-node__copy">
                <span>{mode.short}</span>
                <strong>{mode.name}</strong>
                <small>{mode.tagline}</small>
              </div>
              <b className="home-command-node__open">OPEN ↗</b>
            </a>
          ))}
        </div>

        <div className="home-command-showcase__footer">
          <span className="home-command-showcase__pulse"><i /> 04 MODES LIVE</span>
          <strong>{activeMode.name}</strong>
          <span>{activeMode.specs.slice(0, 2).map((spec) => spec.value).join(' · ')}</span>
        </div>

        <div className="mt-8 flex justify-center">
          <a href={pageHref('/modes')} className="btn-secondary no-underline">
            Compare all four modes
          </a>
        </div>
      </div>
    </>,
    target,
  )
}
