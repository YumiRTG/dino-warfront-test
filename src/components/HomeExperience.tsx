import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'

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

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function HomeExperienceFx() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const root = document.documentElement
    let raf = 0

    const paintPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(() => {
        root.style.setProperty('--home-pointer-x', `${event.clientX}px`)
        root.style.setProperty('--home-pointer-y', `${event.clientY}px`)
      })
    }

    const paintScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      root.style.setProperty('--home-scroll', String(progress))
    }

    paintScroll()
    window.addEventListener('pointermove', paintPointer, { passive: true })
    window.addEventListener('scroll', paintScroll, { passive: true })
    window.addEventListener('resize', paintScroll, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', paintPointer)
      window.removeEventListener('scroll', paintScroll)
      window.removeEventListener('resize', paintScroll)
    }
  }, [])

  return (
    <>
      <div className="home-exp-progress" aria-hidden><span /></div>
      <div className="home-exp-pointer" aria-hidden />
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
  const refs = useRef<Array<HTMLElement | null>>([])

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
      { rootMargin: '-18% 0px -18% 0px', threshold: [0.2, 0.45, 0.7] },
    )

    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="home-exp-sequence" aria-label="From city to warfront">
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
