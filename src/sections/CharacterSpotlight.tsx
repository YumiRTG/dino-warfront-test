import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: 'LEADERSHIP', value: 97 },
  { label: 'COMBAT', value: 94 },
  { label: 'STRATEGY', value: 91 },
]

const HEROES = [
  { src: asset('hero-nyra.png'), name: 'Nyra Vale', role: 'Commander' },
  { src: asset('hero-alyssa.png'), name: 'Alyssa Mey', role: 'Hero' },
  { src: asset('hero-carina.png'), name: 'Carina Vale', role: 'Hero' },
  { src: asset('hero-elara.png'), name: 'Elara Veyn', role: 'Hero' },
  { src: asset('hero-ronan.png'), name: 'Ronan', role: 'Hero' },
  { src: asset('hero-kailina.png'), name: 'Kailina', role: 'Hero' },
  { src: asset('hero-warrior.png'), name: 'Warrior', role: 'Hero' },
  { src: asset('dino-dragon-hero.png'), name: 'Fire Dragon', role: 'Beast' },
]

export default function CharacterSpotlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rosterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const content = contentRef.current
    if (!section || !image || !content) return

    gsap.fromTo(
      image,
      { opacity: 0, x: -60 },
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

    gsap.fromTo(
      content,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    if (rosterRef.current) {
      gsap.fromTo(
        rosterRef.current.querySelectorAll('.hero-tile'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: {
            trigger: rosterRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === rosterRef.current) st.kill()
      })
    }
  }, [])

  return (
    <section id="heroes" ref={sectionRef} className="section-dark py-[100px] md:py-[160px] px-6 md:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="w-full md:w-[55%]">
            <div
              ref={imageRef}
              className="relative overflow-hidden rounded-[6px]"
              style={{ aspectRatio: '3/4', maxHeight: '720px' }}
            >
              <img
                src={asset('hero-nyra.png')}
                alt="Nyra Vale"
                className="w-full h-full object-cover scale-105"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-6 md:p-8"
                style={{
                  background: 'linear-gradient(transparent, rgba(8,76,97,0.95))',
                }}
              >
                <span className="label-text text-terracotta">FEATURED HERO</span>
                <p className="font-display text-cream text-3xl md:text-4xl mt-1">NYRA VALE</p>
              </div>
            </div>
          </div>

          <div ref={contentRef} className="w-full md:w-[45%] flex flex-col justify-center">
            <span className="label-text text-sage">HERO ROSTER</span>
            <h2
              className="font-display text-cream uppercase mt-4"
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
              }}
            >
              LEAD WITH LEGENDS
            </h2>

            <div className="w-10 h-[2px] bg-terracotta mt-6" />

            <p
              className="font-body text-cream/80 mt-6 max-w-[460px]"
              style={{ fontSize: 'clamp(16px, 1.8vw, 18px)', lineHeight: 1.7 }}
            >
              Collect and level unique heroes with skill kits, exclusive visuals, and massive battle
              impact. Form squads with dinos and troops to dominate PvE campaigns and alliance wars.
            </p>

            <div className="flex items-center gap-0 mt-10">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center">
                  <div className="flex flex-col items-center px-5 md:px-7">
                    <span className="label-text text-sage text-[10px]">{stat.label}</span>
                    <span
                      className="font-display text-terracotta mt-1"
                      style={{ fontSize: 'clamp(28px, 4vw, 36px)' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  {i < STATS.length - 1 && <div className="w-[1px] h-12 bg-cream/15" />}
                </div>
              ))}
            </div>

            <Link to="/download" className="btn-primary mt-12 w-fit no-underline">
              PLAY AS NYRA
            </Link>
          </div>
        </div>

        <div ref={rosterRef} className="mt-16 md:mt-20">
          <span className="label-text text-sage mb-6 block">MEET THE CAST</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {HEROES.map((hero) => (
              <div
                key={hero.name}
                className="hero-tile opacity-0 group text-center"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] border border-cream/10">
                  <img
                    src={hero.src}
                    alt={hero.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-ui text-cream text-xs mt-2 uppercase tracking-wide truncate">
                  {hero.name}
                </p>
                <p className="font-body text-cream/40 text-[10px] uppercase tracking-wider">
                  {hero.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
