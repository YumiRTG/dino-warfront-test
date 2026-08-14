import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

const REALMS = [
  {
    src: asset('realm-base.png'),
    name: 'HOME BASE',
    text: 'Your fortress. Build, produce, and prepare for war.',
  },
  {
    src: asset('realm-volcano.png'),
    name: 'VOLCANO',
    text: 'Scorching terrain and deadly encounters.',
  },
  {
    src: asset('realm-ice.png'),
    name: 'ICE LANDS',
    text: 'Frozen realms where only the prepared survive.',
  },
  {
    src: asset('realm-water.png'),
    name: 'WATER',
    text: 'Coastal routes, rare resources, new threats.',
  },
  {
    src: asset('campaign-map.png'),
    name: 'WORLD MAP',
    text: 'Chart your conquest across the prehistoric continent.',
  },
  {
    src: asset('env-loading-scene-6.png'),
    name: 'JUNGLE',
    text: 'Dense wilds packed with beasts and ambushes.',
  },
]

export default function WorldRealms() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    gsap.fromTo(
      grid.querySelectorAll('.realm-card'),
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill()
      })
    }
  }, [])

  return (
    <section
      id="world"
      ref={sectionRef}
      className="section-light py-[100px] md:py-[160px] px-6 md:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-14 md:mb-20">
          <span className="label-text text-sage">CAMPAIGN WORLD</span>
          <h2
            className="font-display text-teal uppercase mt-4"
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            EXPLORE EVERY REALM
          </h2>
          <p
            className="font-body text-teal/70 mt-5"
            style={{ fontSize: 'clamp(16px, 1.8vw, 18px)', lineHeight: 1.6 }}
          >
            Progress through campaign stages, unlock new biomes, and claim territory
            across the living world of Dino Warfront.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
        >
          {REALMS.map((realm) => (
            <article
              key={realm.name}
              className="realm-card group relative overflow-hidden rounded-[6px] opacity-0"
              style={{ aspectRatio: '16/11' }}
            >
              <img
                src={realm.src}
                alt={realm.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,76,97,0.15) 0%, rgba(8,76,97,0.88) 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-cream text-2xl tracking-wide">{realm.name}</h3>
                <p className="font-body text-cream/75 mt-2 text-sm leading-relaxed">
                  {realm.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
