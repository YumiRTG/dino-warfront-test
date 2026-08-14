import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/assets'

gsap.registerPlugin(ScrollTrigger)

export default function CTADownload() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const headline = headlineRef.current
    const sub = subRef.current
    const buttons = buttonsRef.current
    if (!section || !headline || !sub || !buttons) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      headline,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'cubic-bezier(0.23, 1, 0.32, 1)' }
    )
      .fromTo(
        sub,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        '-=0.4'
      )
      .fromTo(
        buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        '-=0.3'
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      id="download"
      ref={sectionRef}
      className="relative overflow-hidden py-[120px] md:py-[180px] px-6 md:px-20"
    >
      <img
        src={asset('banner-bg.png')}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,76,97,0.88) 0%, rgba(8,76,97,0.94) 100%)',
        }}
      />

      <div className="relative z-[1] max-w-[800px] mx-auto text-center">
        <span className="label-text text-terracotta">READY TO RULE?</span>
        <h2
          ref={headlineRef}
          className="font-display text-cream uppercase mt-4 opacity-0"
          style={{
            fontSize: 'clamp(42px, 6.5vw, 88px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
        >
          CLAIM YOUR DOMINION
        </h2>

        <p
          ref={subRef}
          className="font-body text-cream/75 mt-5 opacity-0 max-w-[520px] mx-auto"
          style={{
            fontSize: 'clamp(16px, 1.8vw, 18px)',
            lineHeight: 1.6,
          }}
        >
          Download the Android beta APK for friends testing, or get the game on the stores later.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 opacity-0"
        >
          <button
            type="button"
            onClick={() => document.getElementById('apk')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Android APK
          </button>

          <button
            type="button"
            disabled
            className="btn-secondary opacity-50 cursor-not-allowed"
            title="Coming later"
          >
            App Store · Soon
          </button>

          <button
            type="button"
            disabled
            className="btn-secondary opacity-50 cursor-not-allowed"
            title="Coming later"
          >
            Google Play · Soon
          </button>
        </div>

        <p className="font-body text-cream/40 text-xs mt-8 uppercase tracking-wider">
          Friend beta via APK · Free to play · Strategy survival
        </p>
      </div>
    </section>
  )
}
