import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

const TROOPS = [
  {
    art: asset('troop-infantry.png'),
    name: 'INFANTRY',
    role: 'Frontline Holders',
    text: 'Train soldiers from your infantry camp. Tank damage, hold lines, and push through enemy defenses.',
  },
  {
    art: asset('troop-rider.png'),
    name: 'RIDERS',
    role: 'Fast Assault',
    text: 'Mounted units strike hard and fast. Flank, break formations, and overwhelm weaker targets.',
  },
  {
    art: asset('troop-shooter.png'),
    name: 'SHOOTERS',
    role: 'Ranged Power',
    text: 'Archers and gunners rain damage from the backline. Protect them well — they win long fights.',
  },
  {
    art: asset('dino-raptor.png'),
    name: 'DINOS',
    role: 'Beast Force',
    text: 'Pair heroes with prehistoric beasts. Unique skills, high impact, and battlefield presence no troop can match.',
  },
]

export default function Troops() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    gsap.fromTo(
      grid.querySelectorAll('.troop-card'),
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
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
      id="army"
      ref={sectionRef}
      className="section-dark py-[100px] md:py-[160px] px-6 md:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-[640px]">
            <span className="label-text text-sage">ARMY SYSTEM</span>
            <h2
              className="font-display text-cream uppercase mt-4"
              style={{
                fontSize: 'clamp(40px, 6vw, 80px)',
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
              }}
            >
              TRAIN. DEPLOY. DOMINATE.
            </h2>
          </div>
          <p
            className="font-body text-cream/65 max-w-[420px] lg:text-right"
            style={{ fontSize: 'clamp(15px, 1.6vw, 17px)', lineHeight: 1.6 }}
          >
            Build specialized camps, upgrade troop tiers, and assemble the perfect formation —
            infantry, riders, shooters, and dinosaurs working as one war machine.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {TROOPS.map((troop) => (
            <article
              key={troop.name}
              className="troop-card dino-card opacity-0 bg-cream/[0.03]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={troop.art}
                  alt={troop.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 40%, rgba(6, 38, 28, 0.95) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="label-text text-amber text-[11px]">{troop.role}</span>
                  <h3 className="font-display text-cream text-2xl mt-1 tracking-wide">
                    {troop.name}
                  </h3>
                </div>
              </div>
              <p
                className="font-body text-cream/65 p-5 pt-4"
                style={{ fontSize: '14px', lineHeight: 1.6 }}
              >
                {troop.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
