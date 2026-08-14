import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    const text = el.textContent || ''
    const words = text.split(' ')
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block opacity-0 translate-y-[10px]" style="transition: none;">${word}</span>`
      )
      .join(' ')

    const wordSpans = el.querySelectorAll('span')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="section-light py-[100px] md:py-[160px] px-6 md:px-20">
      <div className="max-w-[1000px] mx-auto text-center">
        <div className="claw-divider mb-8">
          <span className="label-text text-sage">PREHISTORIC STRATEGY SURVIVAL</span>
        </div>

        <p
          ref={textRef}
          className="font-display text-teal uppercase text-center"
          style={{
            fontSize: 'clamp(22px, 3.2vw, 42px)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          BUILD YOUR BASE. RECRUIT HEROES. TRAIN TROOPS. TAME DINOSAURS. CONQUER THE CAMPAIGN.
          IN DINO WARFRONT, EVERY CHOICE FORGES AN EMPIRE THAT OUTLIVES THE AGE OF BEASTS.
        </p>
      </div>
    </section>
  )
}
