import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

export default function Gameplay() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const title = titleRef.current
    const desc = descRef.current
    if (!section || !video || !title || !desc) return

    let triggerInstance: ScrollTrigger | null = null

    const setupScrollTrigger = () => {
      const duration = video.duration
      if (!duration || isNaN(duration)) return

      triggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          video.currentTime = duration * (1 - self.progress)
        },
      })

      const chars = title.querySelectorAll('.char')
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          chars.forEach((char, i) => {
            const charStart = (i / chars.length) * 0.5
            const charEnd = charStart + 0.5 / chars.length
            const charProgress = (progress - charStart) / (charEnd - charStart)
            const el = char as HTMLElement
            el.style.opacity = String(Math.max(0.1, Math.min(1, charProgress)))
          })
        },
      })

      gsap.fromTo(
        desc,
        { opacity: 0, y: 20 },
        {
          opacity: 0.85,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        }
      )
    }

    const text = title.textContent || ''
    title.innerHTML = text
      .split('')
      .map((char) =>
        char === ' '
          ? '<span class="char inline-block">&nbsp;</span>'
          : `<span class="char inline-block" style="opacity:0.1">${char}</span>`
      )
      .join('')

    video.addEventListener('loadedmetadata', setupScrollTrigger)
    if (video.readyState >= 1) setupScrollTrigger()

    return () => {
      video.removeEventListener('loadedmetadata', setupScrollTrigger)
      if (triggerInstance) triggerInstance.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section id="gameplay" ref={sectionRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          muted
          preload="auto"
          className="w-full h-full object-cover"
          poster={asset('ui-hero-screen.png')}
        >
          <source src={asset('gameplay-heroes.mp4')} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(8, 76, 97, 0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] px-6">
          <span className="label-text text-cream/70 mb-4">GAMEPLAY LOOP</span>
          <h2
            ref={titleRef}
            className="font-display text-cream uppercase text-center"
            style={{
              fontSize: 'clamp(42px, 6.5vw, 88px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            GROW. FIGHT. REWARD.
          </h2>
          <p
            ref={descRef}
            className="font-body text-cream/80 text-center mt-6 max-w-[600px]"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              lineHeight: 1.6,
            }}
          >
            Collect resources, upgrade your base, recruit heroes, train troops, clear campaign stages,
            and pull for legendary creatures — then do it all again, stronger than before.
          </p>
        </div>
      </div>
    </section>
  )
}
