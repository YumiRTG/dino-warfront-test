import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import '../pages/HomeTransitionsLab.css'

const SCENES = [
  {
    label: 'SEQUENCE 01',
    kicker: 'The gates wake',
    title: 'Your empire starts behind the walls.',
    body: 'Production spins up, research queues begin and the city starts feeding an army that does not exist yet.',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 42%',
    accent: '#f0c14d',
    stat: 'CITY ONLINE',
    to: '/features/base',
  },
  {
    label: 'SEQUENCE 02',
    kicker: 'The march leaves',
    title: 'The safe part of the game ends at the gate.',
    body: 'Marches cross the shared world to gather, scout, hunt, reinforce and collide with commanders who are doing the same thing at the same time.',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    accent: '#38e8ff',
    stat: '8000 × 8000',
    to: '/modes/world-map',
  },
  {
    label: 'SEQUENCE 03',
    kicker: 'The front ignites',
    title: 'Preparation becomes consequence.',
    body: 'Arena pressure, campaign bosses, alliance conflict and defense maps turn the roster you built into decisions that have to survive contact.',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    accent: '#ff4d1a',
    stat: 'WARFRONT LIVE',
    to: '/modes',
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
  if (section.classList.contains('home-exp-sequence')) return 'March to war'

  const ornament = section.querySelector<HTMLElement>('.sec-ornament span, .eyebrow')?.textContent?.trim()
  if (ornament) return ornament.replace(/·/g, ' ').slice(0, 24)

  const heading = section.querySelector<HTMLElement>('h2, h1')?.textContent?.replace(/\s+/g, ' ').trim()
  if (heading) return heading.slice(0, 24)

  return `Chapter ${String(index + 1).padStart(2, '0')}`
}

export function HomeExperienceFx() {
  const [chapters, setChapters] = useState<JourneyChapter[]>([])
  const [activeChapter, setActiveChapter] = useState(0)
  const [cutToken, setCutToken] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.home-exp-home > section'))
      .filter((section) => section.getBoundingClientRect().height > 180)

    sections.forEach((section, index) => {
      const id = section.id || `home-journey-${index + 1}`
      section.id = id
      section.classList.add('home-exp-chapter')
      section.style.setProperty('--home-chapter-index', String(index))
    })

    setChapters(sections.map((section, index) => ({ id: section.id, label: chapterLabel(section, index) })))

    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).classList.add('home-exp-chapter-entered')
        })
      },
      { rootMargin: '8% 0px -10% 0px', threshold: 0.06 },
    )
    sections.forEach((section) => entranceObserver.observe(section))

    let raf = 0
    let lastY = window.scrollY
    let lastTime = performance.now()
    let speedTimer = 0

    const paint = () => {
      raf = 0
      const now = performance.now()
      const currentY = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, currentY / max))
      root.style.setProperty('--home-scroll', String(progress))

      const dt = Math.max(16, now - lastTime)
      const velocity = Math.min(1, Math.abs(currentY - lastY) / dt / 1.8)
      root.style.setProperty('--home-scroll-speed', String(velocity))
      root.dataset.homeScrollDirection = currentY >= lastY ? 'down' : 'up'
      lastY = currentY
      lastTime = now

      window.clearTimeout(speedTimer)
      speedTimer = window.setTimeout(() => root.style.setProperty('--home-scroll-speed', '0'), 120)

      if (sections.length) {
        const viewportCenter = window.innerHeight * 0.5
        let closest = 0
        let closestDistance = Number.POSITIVE_INFINITY

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect()
          const sectionCenter = rect.top + Math.min(rect.height, window.innerHeight) * 0.5
          const distance = Math.abs(sectionCenter - viewportCenter)
          const local = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
          section.style.setProperty('--home-section-progress', String(local))

          if (rect.bottom > 0 && rect.top < window.innerHeight && distance < closestDistance) {
            closestDistance = distance
            closest = index
          }
        })

        if (closest !== activeRef.current) {
          sections[activeRef.current]?.classList.remove('home-exp-chapter-active')
          sections[closest]?.classList.add('home-exp-chapter-active')
          activeRef.current = closest
          setActiveChapter(closest)
          if (!reduced) setCutToken((value) => value + 1)
        } else {
          sections[closest]?.classList.add('home-exp-chapter-active')
        }
      }
    }

    const schedulePaint = () => {
      if (!raf) raf = window.requestAnimationFrame(paint)
    }

    const paintPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduced) return
      root.style.setProperty('--home-pointer-x', `${event.clientX}px`)
      root.style.setProperty('--home-pointer-y', `${event.clientY}px`)
    }

    paint()
    window.addEventListener('pointermove', paintPointer, { passive: true })
    window.addEventListener('scroll', schedulePaint, { passive: true })
    window.addEventListener('resize', schedulePaint, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(speedTimer)
      entranceObserver.disconnect()
      window.removeEventListener('pointermove', paintPointer)
      window.removeEventListener('scroll', schedulePaint)
      window.removeEventListener('resize', schedulePaint)
      sections.forEach((section) => {
        section.classList.remove('home-exp-chapter', 'home-exp-chapter-entered', 'home-exp-chapter-active')
        section.style.removeProperty('--home-section-progress')
      })
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
      <div className="home-exp-scroll-energy" aria-hidden />
      {cutToken > 0 && <div key={cutToken} className="home-exp-chapter-cut" aria-hidden />}

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
      // Session storage can be blocked; the intro still works.
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
  const [active, setActive] = useState(0)
  const [scenePulse, setScenePulse] = useState(0)
  const refs = useRef<Array<HTMLElement | null>>([])
  const sectionRef = useRef<HTMLElement | null>(null)
  const previousActive = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.sceneIndex || 0)
        setActive(index)
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: [0.18, 0.4, 0.62] },
    )

    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (active !== previousActive.current) {
      previousActive.current = active
      setScenePulse((value) => value + 1)
    }
  }, [active])

  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0

    const paintDepth = () => {
      raf = 0
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const local = Math.min(1, Math.max(0, -rect.top / total))
      const shift = (local - 0.5) * -28
      section.style.setProperty('--sequence-shift', `${shift.toFixed(1)}px`)
      section.style.setProperty('--sequence-progress', String(local))
    }

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(paintDepth)
    }

    paintDepth()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section ref={sectionRef} className="home-exp-sequence" aria-label="From city to warfront">
      <div className="home-exp-sequence__stage" aria-hidden>
        {SCENES.map((scene, index) => (
          <img
            key={scene.label}
            src={scene.img}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="home-exp-sequence__image"
            data-active={active === index ? 'true' : undefined}
            style={{ objectPosition: scene.pos }}
          />
        ))}
        <div className="home-exp-sequence__shade" />
        <div className="home-exp-sequence__grid" />
        <div className="home-exp-sequence__scan" />
        <div className="home-exp-sequence__vignette" />
        {scenePulse > 0 && (
          <div
            key={scenePulse}
            className="home-exp-sequence__wipe"
            style={{ ['--scene-accent' as string]: SCENES[active].accent }}
          />
        )}
        <div className="home-exp-sequence__hud">
          <span>TACTICAL FEED</span>
          <strong>{String(active + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}</strong>
        </div>
        <div className="home-exp-sequence__rail">
          {SCENES.map((scene, index) => (
            <span key={scene.label} data-active={active === index ? 'true' : undefined} />
          ))}
        </div>
      </div>

      <div className="home-exp-sequence__chapters">
        {SCENES.map((scene, index) => (
          <article
            key={scene.label}
            ref={(node) => { refs.current[index] = node }}
            data-scene-index={index}
            className="home-exp-sequence__chapter"
            style={{ ['--scene-accent' as string]: scene.accent }}
          >
            <div className="home-exp-sequence__copy" data-active={active === index ? 'true' : undefined}>
              <div className="home-exp-sequence__signal">
                <span>{scene.label}</span>
                <strong>{scene.stat}</strong>
              </div>
              <p className="home-exp-sequence__kicker">{scene.kicker}</p>
              <h2>{scene.title}</h2>
              <p className="home-exp-sequence__body">{scene.body}</p>
              <Link to={scene.to} className="home-exp-sequence__link">Open system <span>→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
