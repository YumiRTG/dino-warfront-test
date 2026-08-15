import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { BASIC_HEROES } from '@/lib/heroes'
import { BASIC_DINOS } from '@/lib/dinos'
import '../pages/HomeTransitionsLab.css'

type JourneyChapter = {
  id: string
  label: string
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function chapterLabel(section: HTMLElement, index: number) {
  if (section.classList.contains('home-exp-hero')) return 'Opening'
  if (section.classList.contains('home-roster-showcase')) return 'Hero rosters'
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

type RosterMode = 'heroes' | 'dinos'

export function HomeCinematicSequence() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [mode, setMode] = useState<RosterMode>('heroes')
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  const roster = mode === 'heroes'
    ? BASIC_HEROES.map((hero) => ({
        id: hero.id,
        name: hero.name,
        role: hero.role,
        meta: hero.focus,
        blurb: hero.blurb,
        img: hero.img,
      }))
    : BASIC_DINOS.map((dino) => ({
        id: dino.id,
        name: dino.name,
        role: dino.role,
        meta: dino.role,
        blurb: dino.blurb,
        img: dino.img,
      }))

  const accent = mode === 'heroes' ? '#38e8ff' : '#ff6b3d'
  const backdrop = mode === 'heroes' ? asset('feature-heroes-hero.jpg') : asset('feature-dinos-hero.jpg')
  const activeEntry = roster[Math.min(active, roster.length - 1)]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setActive(0)
  }, [mode])

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % roster.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [inView, paused, roster.length])

  return (
    <section
      ref={sectionRef}
      className="home-command-showcase home-roster-showcase"
      aria-label="Dino Warfront human and dinosaur hero rosters"
      style={{ ['--command-accent' as string]: accent }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="home-command-showcase__backdrop" aria-hidden>
        <img src={backdrop} alt="" loading="lazy" decoding="async" />
        <div className="home-command-showcase__fog" />
        <div className="home-command-showcase__horizon" />
      </div>

      <div className="container-dd relative z-10">
        <header className="home-command-showcase__header">
          <p>ROSTER DATABASE // TWO FORCES ONLINE</p>
          <h2>
            Command the heroes.
            <span> Unleash the dinosaurs.</span>
          </h2>
        </header>

        <div className="flex justify-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMode('heroes')}
            className="font-ui text-[10px] tracking-[.2em] uppercase px-5 py-3 border transition-all"
            style={{
              borderColor: mode === 'heroes' ? '#38e8ff' : 'rgba(255,255,255,.12)',
              color: mode === 'heroes' ? '#38e8ff' : 'rgba(255,255,255,.5)',
              background: mode === 'heroes' ? 'rgba(56,232,255,.08)' : 'rgba(0,0,0,.18)',
            }}
          >
            Human hero roster · {BASIC_HEROES.length}
          </button>
          <button
            type="button"
            onClick={() => setMode('dinos')}
            className="font-ui text-[10px] tracking-[.2em] uppercase px-5 py-3 border transition-all"
            style={{
              borderColor: mode === 'dinos' ? '#ff6b3d' : 'rgba(255,255,255,.12)',
              color: mode === 'dinos' ? '#ff6b3d' : 'rgba(255,255,255,.5)',
              background: mode === 'dinos' ? 'rgba(255,107,61,.08)' : 'rgba(0,0,0,.18)',
            }}
          >
            Dino hero roster · {BASIC_DINOS.length}
          </button>
        </div>

        <div className="grid lg:grid-cols-[.82fr_1.18fr] gap-4">
          <Link
            to={mode === 'heroes' ? '/features/heroes' : '/features/dinos'}
            className="relative min-h-[32rem] overflow-hidden border border-white/10 bg-[#090812] no-underline text-inherit group"
            style={{ boxShadow: `0 0 55px ${accent}18, 0 30px 90px rgba(0,0,0,.38)` }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-5 pb-28">
              <img
                key={activeEntry.id}
                src={activeEntry.img}
                alt={activeEntry.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05040a] via-transparent to-transparent" />
            <div className="absolute top-5 left-5 font-ui text-[9px] tracking-[.22em] uppercase px-3 py-2 border bg-black/40" style={{ color: accent, borderColor: `${accent}55` }}>
              ACTIVE ROSTER SIGNAL // {String(active + 1).padStart(2, '0')}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
              <p className="font-ui text-[9px] tracking-[.22em] uppercase" style={{ color: accent }}>
                {activeEntry.role}
              </p>
              <h3 className="font-display text-3xl md:text-5xl text-white uppercase leading-none mt-1">
                {activeEntry.name}
              </h3>
              <p className="font-body text-sm text-white/58 mt-3 max-w-xl leading-relaxed">
                {activeEntry.blurb}
              </p>
              <p className="font-ui text-[9px] tracking-[.18em] uppercase text-white/45 mt-4">
                {activeEntry.meta}
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 content-start">
            {roster.map((entry, index) => {
              const selected = index === active
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className="relative min-h-[13.5rem] overflow-hidden border bg-[#090812] text-left group transition-all duration-300"
                  style={{
                    borderColor: selected ? `${accent}aa` : 'rgba(255,255,255,.08)',
                    boxShadow: selected ? `0 0 28px ${accent}18` : 'none',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-2 pb-14">
                    <img
                      src={entry.img}
                      alt=""
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05040a] via-[#05040a]/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <p className="font-ui text-[8px] tracking-[.16em] uppercase" style={{ color: selected ? accent : 'rgba(255,255,255,.4)' }}>
                      {entry.role}
                    </p>
                    <strong className="block font-display text-sm md:text-base text-white uppercase mt-1 leading-none">
                      {entry.name}
                    </strong>
                  </div>
                  {selected && <span className="absolute inset-x-0 top-0 h-px" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="home-command-showcase__footer">
          <span className="home-command-showcase__pulse"><i /> ROSTER LIVE</span>
          <strong>{mode === 'heroes' ? 'HUMAN HEROES' : 'DINO HEROES'}</strong>
          <span>Select a card · full kits stay on the roster page</span>
        </div>
      </div>
    </section>
  )
}
