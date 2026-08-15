import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import '../pages/HomeTransitionsLab.css'

const SHOWCASE = [
  {
    key: 'base',
    label: 'BUILD',
    title: 'BASE NEVER SLEEPS',
    stat: '+18K OFFLINE',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 42%',
    accent: '#f0c14d',
    to: '/features/base',
  },
  {
    key: 'dinos',
    label: 'TAME',
    title: 'UNLEASH THE PACK',
    stat: 'APEX READY',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center 48%',
    accent: '#ff4d1a',
    to: '/features/dinos',
  },
  {
    key: 'heroes',
    label: 'COMMAND',
    title: 'BUILD YOUR META',
    stat: 'POWER +18.6%',
    img: asset('feature-heroes-hero.jpg'),
    pos: 'center center',
    accent: '#38e8ff',
    to: '/features/heroes',
  },
  {
    key: 'war',
    label: 'CONQUER',
    title: 'OWN THE WARFRONT',
    stat: 'WORLD ACTIVE',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 46%',
    accent: '#ff6b3d',
    to: '/modes/world-map',
  },
]

type JourneyChapter = {
  id: string
  label: string
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function chapterLabel(section: HTMLElement, index: number) {
  if (section.classList.contains('home-exp-hero')) return 'Opening'
  if (section.classList.contains('home-command-showcase')) return 'Command network'

  const ornament = section.querySelector<HTMLElement>('.sec-ornament span, .eyebrow')?.textContent?.trim()
  if (ornament) return ornament.replace(/·/g, ' ').slice(0, 24)

  const heading = section.querySelector<HTMLElement>('h2, h1')?.textContent?.replace(/\s+/g, ' ').trim()
  if (heading) return heading.slice(0, 24)

  return `Chapter ${String(index + 1).padStart(2, '0')}`
}

export function HomeExperienceFx() {
  const [chapters, setChapters] = useState<JourneyChapter[]>([])
  const [activeChapter, setActiveChapter] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.home-exp-home > section'))
      .filter((section) => section.getBoundingClientRect().height > 180)

    sections.forEach((section, index) => {
      const id = section.id || `home-journey-${index + 1}`
      section.id = id
      section.classList.add('home-exp-chapter')
    })

    setChapters(sections.map((section, index) => ({ id: section.id, label: chapterLabel(section, index) })))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).classList.add('home-exp-chapter-entered')
        })
      },
      { rootMargin: '5% 0px -8% 0px', threshold: 0.05 },
    )
    sections.forEach((section) => observer.observe(section))

    let raf = 0
    const paint = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      root.style.setProperty('--home-scroll', String(Math.min(1, Math.max(0, window.scrollY / max))))

      const center = window.innerHeight * 0.5
      let closest = activeRef.current
      let distance = Number.POSITIVE_INFINITY
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
        const d = Math.abs(rect.top + Math.min(rect.height, window.innerHeight) * 0.5 - center)
        if (d < distance) {
          distance = d
          closest = index
        }
      })

      if (closest !== activeRef.current) {
        activeRef.current = closest
        setActiveChapter(closest)
      }
    }

    const schedulePaint = () => {
      if (!raf) raf = window.requestAnimationFrame(paint)
    }

    const paintPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || prefersReducedMotion()) return
      root.style.setProperty('--home-pointer-x', `${event.clientX}px`)
      root.style.setProperty('--home-pointer-y', `${event.clientY}px`)
    }

    paint()
    window.addEventListener('scroll', schedulePaint, { passive: true })
    window.addEventListener('resize', schedulePaint, { passive: true })
    window.addEventListener('pointermove', paintPointer, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', schedulePaint)
      window.removeEventListener('resize', schedulePaint)
      window.removeEventListener('pointermove', paintPointer)
      sections.forEach((section) => section.classList.remove('home-exp-chapter', 'home-exp-chapter-entered'))
    }
  }, [])

  const jumpToChapter = (index: number) => {
    const chapter = chapters[index]
    if (!chapter) return
    document.getElementById(chapter.id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="home-exp-progress" aria-hidden><span /></div>
      <div className="home-exp-pointer" aria-hidden />
      {chapters.length > 3 && (
        <nav className="home-exp-journey" aria-label="Homepage journey">
          <div className="home-exp-journey__counter">
            <strong>{String(activeChapter + 1).padStart(2, '0')}</strong>
            <span>/ {String(chapters.length).padStart(2, '0')}</span>
          </div>
          <div className="home-exp-journey__rail">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                className="home-exp-journey__step"
                data-active={index === activeChapter ? 'true' : undefined}
                onClick={() => jumpToChapter(index)}
                aria-label={`Jump to ${chapter.label}`}
                aria-current={index === activeChapter ? 'step' : undefined}
              >
                <span className="home-exp-journey__dot" />
                <span className="home-exp-journey__label">{chapter.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  )
}

export function HomeIntro({ replayToken }: { replayToken: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let seen = false
    try {
      seen = window.sessionStorage.getItem('dw-home-intro-v2') === '1'
    } catch {
      seen = false
    }

    if (replayToken === 0 && seen) return

    setVisible(true)
    try {
      window.sessionStorage.setItem('dw-home-intro-v2', '1')
    } catch {
      // Storage can be blocked; the intro still works.
    }

    const timer = window.setTimeout(() => setVisible(false), 3100)
    return () => window.clearTimeout(timer)
  }, [replayToken])

  if (!visible) return null

  return (
    <div className="home-intro" role="presentation">
      <div className="home-intro__shutter home-intro__shutter--top" />
      <div className="home-intro__shutter home-intro__shutter--bottom" />
      <div className="home-intro__scan" />
      <div className="home-intro__mark" aria-hidden>
        <span className="home-intro__code">WORLD 01 // COMMAND LINK</span>
        <strong>DINO</strong>
        <strong className="home-intro__warfront">WARFRONT</strong>
        <span className="home-intro__sub">SURVIVE · COMMAND · CONQUER</span>
      </div>
      <button type="button" className="home-intro__skip" onClick={() => setVisible(false)}>
        Skip intro
      </button>
    </div>
  )
}

export function HomeCinematicSequence() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.28 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % SHOWCASE.length)
    }, 2300)
    return () => window.clearInterval(timer)
  }, [inView, paused])

  const activeScene = SHOWCASE[active]

  return (
    <section
      ref={sectionRef}
      className="home-command-showcase"
      aria-label="Dino Warfront command network"
      style={{ ['--command-accent' as string]: activeScene.accent }}
    >
      <div className="home-command-showcase__backdrop" aria-hidden>
        <img src={asset('modes/mode-world.jpg')} alt="" loading="lazy" decoding="async" />
        <div className="home-command-showcase__fog" />
        <div className="home-command-showcase__horizon" />
      </div>

      <div className="container-dd relative z-10">
        <header className="home-command-showcase__header">
          <p>COMMAND NETWORK // 04 SYSTEMS ONLINE</p>
          <h2>
            One empire.
            <span> Everything connected.</span>
          </h2>
        </header>

        <div className="home-command-board">
          <svg className="home-command-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden>
            {[
              [360, 245, 210, 130],
              [640, 245, 790, 125],
              [365, 375, 220, 500],
              [635, 375, 790, 500],
            ].map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                data-active={active === index ? 'true' : undefined}
                style={{ stroke: SHOWCASE[index].accent }}
              />
            ))}
          </svg>

          <div className="home-command-core" aria-hidden>
            <span className="home-command-core__ring home-command-core__ring--outer" />
            <span className="home-command-core__ring home-command-core__ring--inner" />
            <span className="home-command-core__scanner" />
            <div className="home-command-core__content" key={active}>
              <small>{String(active + 1).padStart(2, '0')} / 04</small>
              <strong>WARFRONT</strong>
              <em>{activeScene.stat}</em>
            </div>
          </div>

          {SHOWCASE.map((scene, index) => (
            <Link
              key={scene.key}
              to={scene.to}
              className={`home-command-node home-command-node--${scene.key}`}
              data-active={active === index ? 'true' : undefined}
              style={{ ['--node-accent' as string]: scene.accent }}
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
              <img src={scene.img} alt="" style={{ objectPosition: scene.pos }} loading="lazy" decoding="async" />
              <div className="home-command-node__shade" />
              <div className="home-command-node__signal" aria-hidden><i /><i /><i /></div>
              <div className="home-command-node__copy">
                <span>{scene.label}</span>
                <strong>{scene.title}</strong>
                <small>{scene.stat}</small>
              </div>
              <b className="home-command-node__open">OPEN ↗</b>
            </Link>
          ))}
        </div>

        <div className="home-command-showcase__footer">
          <span className="home-command-showcase__pulse"><i /> LIVE NETWORK</span>
          <strong>{activeScene.title}</strong>
          <span>Hover a system · or watch the network cycle</span>
        </div>
      </div>
    </section>
  )
}
