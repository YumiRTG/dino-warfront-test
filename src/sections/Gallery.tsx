import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

const ADVENTURE_IMAGES = [
  { src: asset('campaign-1.png'), caption: 'Campaign — Opening' },
  { src: asset('campaign-2.png'), caption: 'Campaign — The Hunt' },
  { src: asset('campaign-3.png'), caption: 'Campaign — Ambush' },
  { src: asset('campaign-4.png'), caption: 'Campaign — Ruins' },
  { src: asset('campaign-5.png'), caption: 'Campaign — Summit' },
  { src: asset('campaign-6.png'), caption: 'Campaign — Clash' },
  { src: asset('campaign-7.png'), caption: 'Campaign — Storm' },
  { src: asset('campaign-8.png'), caption: 'Campaign — Victory' },
  { src: asset('campaign-9.png'), caption: 'Campaign — Legacy' },
]

const ATMOSPHERE_IMAGES = [
  { src: asset('dino-tyranno.png'), caption: 'Tyrannosaurus' },
  { src: asset('dino-triceratops.png'), caption: 'Triceratops' },
  { src: asset('dino-raptor.png'), caption: 'Velociraptor' },
  { src: asset('dino-stego.png'), caption: 'Stegosaurus' },
  { src: asset('dino-dilo.png'), caption: 'Dilophosaurus' },
  { src: asset('dino-allo.png'), caption: 'Allosaurus' },
  { src: asset('dino-para.png'), caption: 'Parasaurolophus' },
  { src: asset('dino-ptera.png'), caption: 'Pterodactyl' },
  { src: asset('dino-smilodon.png'), caption: 'Smilodon' },
  { src: asset('dino-dragon.png'), caption: 'Fire Dragon' },
  { src: asset('dino-mammoth.png'), caption: 'Mammoth' },
  { src: asset('campaign-map.png'), caption: 'World Map' },
]

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const adventureGridRef = useRef<HTMLDivElement>(null)
  const atmosphereGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const adventureGrid = adventureGridRef.current
    const atmosphereGrid = atmosphereGridRef.current
    if (!section || !adventureGrid || !atmosphereGrid) return

    const advImages = adventureGrid.querySelectorAll('.gallery-img')
    const advColumns: Element[][] = [[], [], []]
    advImages.forEach((img, i) => {
      advColumns[i % 3].push(img)
    })

    advColumns.forEach((col, colIndex) => {
      gsap.fromTo(col,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          delay: colIndex * 0.2,
          ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          scrollTrigger: {
            trigger: adventureGrid,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      )
    })

    const atmoGrid = atmosphereGrid
    atmoGrid.style.perspective = '1000px'

    const atmoImages = atmoGrid.querySelectorAll('.gallery-img')
    const atmoColumns: Element[][] = [[], [], []]
    atmoImages.forEach((img, i) => {
      atmoColumns[i % 3].push(img)
    })

    const delays = [0, 0.15, 0.25]
    atmoColumns.forEach((col, colIndex) => {
      gsap.fromTo(col,
        { scale: 0.3, rotateY: 90, opacity: 0 },
        {
          scale: 1,
          rotateY: 0,
          opacity: 1,
          duration: 1.3,
          delay: delays[colIndex],
          ease: 'power3.out',
          scrollTrigger: {
            trigger: atmoGrid,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === adventureGrid || st.trigger === atmoGrid) st.kill()
      })
    }
  }, [])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-light pt-[120px] md:pt-[200px] pb-[80px] md:pb-[160px] px-6 md:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
        <div>
          <div className="flex items-center gap-4">
            <span className="label-text text-sage whitespace-nowrap">GALLERY</span>
            <div className="flex-1 h-[1px] bg-teal/15" />
          </div>

          <h2
            className="font-display text-teal uppercase mt-6"
            style={{
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            CAMPAIGN STORY
          </h2>
          <p
            className="font-body text-teal/70 mt-4 max-w-[500px]"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              lineHeight: 1.6,
            }}
          >
            Official campaign scenes from Dino Warfront — the battles and milestones that define your rise.
          </p>

          <div
            ref={adventureGridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-16 md:mt-24"
          >
            {ADVENTURE_IMAGES.map((img, i) => (
              <div
                key={i}
                className="gallery-img relative group overflow-hidden rounded-[4px] cursor-pointer"
                style={{ aspectRatio: '16/10' }}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  style={{
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(8, 76, 97, 0.6)',
                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  <span className="font-ui text-cream text-xs uppercase tracking-wider">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[120px] md:mt-[200px]">
          <h2
            className="font-display text-teal uppercase text-center"
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            CREATURES & WORLD
          </h2>
          <p
            className="font-body text-teal/70 text-center mt-4 max-w-[500px] mx-auto"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              lineHeight: 1.6,
            }}
          >
            Dinosaurs, beasts, and maps straight from the game roster.
          </p>

          <div
            ref={atmosphereGridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-16 md:mt-24"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {ATMOSPHERE_IMAGES.map((img, i) => (
              <div
                key={i}
                className="gallery-img relative group overflow-hidden rounded-[4px] cursor-pointer"
                style={{
                  aspectRatio: '16/10',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  style={{
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(8, 76, 97, 0.6)',
                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  <span className="font-ui text-cream text-xs uppercase tracking-wider">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
