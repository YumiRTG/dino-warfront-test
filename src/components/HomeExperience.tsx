import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import '../pages/HomeTransitionsLab.css'

const REEL = [
  {
    label: 'BUILD',
    title: 'BUILD WHILE AWAY',
    sub: 'Come back stronger than you left.',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 42%',
    accent: '#f0c14d',
    to: '/features/base',
  },
  {
    label: 'TAME',
    title: 'UNLEASH THE PACK',
    sub: 'Apex. Speed. Tank. Your formation changes.',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center 48%',
    accent: '#ff4d1a',
    to: '/features/dinos',
  },
  {
    label: 'POWER',
    title: 'STACK THE ADVANTAGE',
    sub: 'Heroes, research and bonds feed one army.',
    img: asset('feature-heroes-hero.jpg'),
    pos: 'center center',
    accent: '#38e8ff',
    to: '/features',
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
  if (section.classList.contains('home-exp-sequence')) return 'Why Warfront'

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

function BaseVisual({ active }: { active: boolean }) {
  return (
    <div className="home-reel-demo home-reel-demo--base" data-active={active ? 'true' : undefined}>
      <div className="home-reel-base-core">
        <span className="home-reel-base-ring home-reel-base-ring--a" />
        <span className="home-reel-base-ring home-reel-base-ring--b" />
        <span className="home-reel-base-ping" />
        <strong>BASE</strong>
        <small>ONLINE</small>
      </div>
      <div className="home-reel-resource home-reel-resource--food"><small>FOOD</small><strong>+18K</strong></div>
      <div className="home-reel-resource home-reel-resource--iron"><small>IRON</small><strong>+9.4K</strong></div>
      <div className="home-reel-resource home-reel-resource--oil"><small>OIL</small><strong>+6.8K</strong></div>
      <div className="home-reel-buildbar"><span>OFFLINE PRODUCTION</span><i /></div>
    </div>
  )
}

function PackVisual({ active }: { active: boolean }) {
  return (
    <div className="home-reel-demo home-reel-demo--pack" data-active={active ? 'true' : undefined}>
      <div className="home-reel-dino home-reel-dino--raptor">
        <img src={asset('dino-raptor.png')} alt="" />
        <span>SPEED</span>
      </div>
      <div className="home-reel-dino home-reel-dino--rex">
        <img src={asset('dino-tyranno.png')} alt="" />
        <span>APEX</span>
      </div>
      <div className="home-reel-dino home-reel-dino--trike">
        <img src={asset('dino-triceratops.png')} alt="" />
        <span>TANK</span>
      </div>
      <div className="home-reel-pack-line"><i /><strong>PACK READY</strong><i /></div>
    </div>
  )
}

function PowerVisual({ active }: { active: boolean }) {
  return (
    <div className="home-reel-demo home-reel-demo--power" data-active={active ? 'true' : undefined}>
      <div className="home-reel-power-number">
        <small>ARMY POWER</small>
        <strong>2.4M</strong>
        <span>▲ 18.6%</span>
      </div>
      <div className="home-reel-stack home-reel-stack--hero"><span>HERO</span><i><b /></i><strong>84</strong></div>
      <div className="home-reel-stack home-reel-stack--research"><span>RESEARCH</span><i><b /></i><strong>71</strong></div>
      <div className="home-reel-stack home-reel-stack--bond"><span>DINO BOND</span><i><b /></i><strong>93</strong></div>
      <div className="home-reel-power-burst" />
    </div>
  )
}

export function HomeCinematicSequence() {
  const [active, setActive] = useState(0)
  const refs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        setActive(Number((visible.target as HTMLElement).dataset.sceneIndex || 0))
      },
      { rootMargin: '-28% 0px -28% 0px', threshold: [0.15, 0.35, 0.55] },
    )

    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="home-exp-sequence" aria-label="Why Dino Warfront">
      <div className="home-exp-sequence__stage">
        <div className="home-reel-bg" aria-hidden>
          {REEL.map((scene, index) => (
            <img
              key={scene.label}
              src={scene.img}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              data-active={active === index ? 'true' : undefined}
              style={{ objectPosition: scene.pos }}
            />
          ))}
          <div className="home-reel-bg__shade" />
          <div className="home-reel-bg__grid" />
        </div>

        <BaseVisual active={active === 0} />
        <PackVisual active={active === 1} />
        <PowerVisual active={active === 2} />

        <div className="home-reel-copy" key={active} style={{ ['--reel-accent' as string]: REEL[active].accent }}>
          <p>{REEL[active].label}</p>
          <h2>{REEL[active].title}</h2>
          <span>{REEL[active].sub}</span>
          <Link to={REEL[active].to}>Explore <b>→</b></Link>
        </div>

        <div className="home-reel-progress" aria-hidden>
          {REEL.map((scene, index) => <span key={scene.label} data-active={active === index ? 'true' : undefined} />)}
        </div>
      </div>

      <div className="home-exp-sequence__chapters" aria-hidden>
        {REEL.map((scene, index) => (
          <div
            key={scene.label}
            ref={(node) => { refs.current[index] = node }}
            data-scene-index={index}
            className="home-exp-sequence__chapter"
          />
        ))}
      </div>
    </section>
  )
}
