import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

const DINOS = [
  'TYRANNOSAURUS',
  'TRICERATOPS',
  'VELOCIRAPTOR',
  'STEGOSAURUS',
  'DILOPHOSAURUS',
  'ALLOSAURUS',
  'PARASAUROLOPHUS',
  'PTERODACTYL',
  'SMILODON',
  'MAMMOTH',
  'FIRE DRAGON',
]

const DINO_CARDS = [
  { src: asset('dino-tyranno.png'), name: 'Tyrannosaurus' },
  { src: asset('dino-dilo.png'), name: 'Dilophosaurus' },
  { src: asset('dino-raptor.png'), name: 'Velociraptor' },
  { src: asset('dino-triceratops.png'), name: 'Triceratops' },
  { src: asset('dino-stego.png'), name: 'Stegosaurus' },
  { src: asset('dino-allo.png'), name: 'Allosaurus' },
]

export default function DinoShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const cylinderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const cylinder = cylinderRef.current
    const content = contentRef.current
    if (!section || !cylinder || !content) return

    gsap.fromTo(cylinder,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    gsap.fromTo(content,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.querySelectorAll('.dino-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section || st.trigger === cardsRef.current) st.kill()
      })
    }
  }, [])

  const itemCount = DINOS.length
  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 180

  return (
    <section
      id="dinos"
      ref={sectionRef}
      className="section-light py-[160px] md:py-[240px] px-6 md:px-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        <div className="w-full lg:w-[55%] relative" style={{ height: '400px' }}>
          <div
            className="absolute top-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #FEFAE0, transparent)' }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #FEFAE0, transparent)' }}
          />

          <div
            ref={cylinderRef}
            className="absolute top-1/2 left-1/2 w-full"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'cylinder-rotate 20s linear infinite',
            }}
          >
            {DINOS.map((dino, i) => {
              const angle = (360 / itemCount) * i
              return (
                <div
                  key={dino}
                  className="absolute top-1/2 left-1/2 w-full text-center font-display text-terracotta uppercase backface-hidden"
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                    letterSpacing: '-0.01em',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    transform: `translate(-50%, -50%) rotateX(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  {dino}
                </div>
              )
            })}
          </div>
        </div>

        <div ref={contentRef} className="w-full lg:w-[45%] lg:pl-20">
          <span className="label-text text-sage">YOUR ARMY</span>
          <h2
            className="font-display text-teal uppercase mt-4"
            style={{
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            MIGHTY CREATURES
          </h2>
          <p
            className="font-body text-teal/80 mt-6 max-w-[480px]"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              lineHeight: 1.6,
            }}
          >
            Collect and power up Tyrannosaurus, Dilophosaurus, Velociraptor, Mammoth, Fire Dragon and more — each with unique skills that define your army composition.
          </p>
          <button
            className="mt-10 bg-teal text-cream font-ui uppercase text-sm tracking-[0.06em] py-4 px-10 rounded-full hover:bg-[#0A5E78] transition-colors duration-300 cursor-pointer border-none"
            onClick={() => {}}
          >
            DISCOVER ALL DINOS
          </button>
        </div>
      </div>

      {/* Game art cards */}
      <div
        ref={cardsRef}
        className="max-w-[1400px] mx-auto mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
      >
        {DINO_CARDS.map((dino) => (
          <div
            key={dino.name}
            className="dino-card group relative overflow-hidden rounded-[4px] opacity-0"
            style={{ aspectRatio: '3/4' }}
          >
            <img
              src={dino.src}
              alt={dino.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
            <div
              className="absolute inset-x-0 bottom-0 p-4 md:p-6"
              style={{
                background: 'linear-gradient(transparent, rgba(8, 76, 97, 0.9))',
              }}
            >
              <span className="font-display text-cream text-lg md:text-2xl uppercase tracking-wide">
                {dino.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
