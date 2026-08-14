import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

export default function DawnAtmosphere() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const elements = content.querySelectorAll('.animate-in')
    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      id="dawn"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex items-end"
    >
      {/* Real game loading art as world backdrop */}
      <img
        src={asset('env-loading-scene-3.png')}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(8, 76, 97, 0.35) 0%, rgba(8, 76, 97, 0.75) 70%, rgba(8, 76, 97, 0.92) 100%)',
        }}
      />

      <div
        ref={contentRef}
        className="relative z-[2] px-6 md:px-20 pb-[80px] md:pb-[120px] max-w-[600px]"
      >
        <span className="label-text text-cream/70 animate-in block">THE WORLD AWAKENS</span>
        <h2
          className="font-display text-cream uppercase mt-3 animate-in"
          style={{
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
        >
          A NEW AGE
        </h2>
        <p
          className="font-body text-cream/80 mt-5 animate-in"
          style={{
            fontSize: 'clamp(16px, 1.8vw, 18px)',
            lineHeight: 1.6,
          }}
        >
          Expand your base across jungle, ice, volcano, and water realms. Every region in Dino Warfront holds unique resources, threats, and legendary beasts.
        </p>
        <button className="btn-secondary mt-8 animate-in">
          EXPLORE THE WORLD
        </button>
      </div>
    </section>
  )
}
