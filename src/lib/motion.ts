import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return { gsap, ScrollTrigger }
}

export const EASE = 'power3.out'
export const EASE_SOFT = 'power2.out'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function forceVisible(el: HTMLElement) {
  el.classList.remove('reveal-pending', 'hero-pending')
  el.classList.add('reveal-in')
  gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform,opacity' })
}

function isInViewport(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight || 0
  // Already on screen (with small margin) → show immediately, no fade-in flash
  return r.top < vh * 0.92 && r.bottom > 0
}

/**
 * Reliable scroll reveals — never leave black empty boxes.
 * Above-the-fold items skip the hide frame (prevents flicker).
 */
export function initReveals(root: HTMLElement | Document = document) {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-item]')
  )

  if (prefersReducedMotion()) {
    targets.forEach(forceVisible)
    return () => {}
  }

  const delayed: HTMLElement[] = []

  targets.forEach((el) => {
    if (isInViewport(el)) {
      // No opacity:0 frame — was a major flicker source for some users
      el.classList.remove('reveal-pending')
      el.classList.add('reveal-in')
      return
    }
    el.classList.add('reveal-pending')
    delayed.push(el)
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        el.classList.remove('reveal-pending')
        el.classList.add('reveal-in')
        observer.unobserve(el)
      })
    },
    { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
  )

  delayed.forEach((el) => observer.observe(el))

  // Safety net: never stay invisible
  const safety = window.setTimeout(() => {
    delayed.forEach((el) => {
      if (el.classList.contains('reveal-pending')) {
        el.classList.remove('reveal-pending')
        el.classList.add('reveal-in')
      }
    })
  }, 2200)

  // Optional GSAP parallax only (does not hide content)
  ensureGsap()
  const tweens: gsap.core.Tween[] = []
  const triggers: ScrollTrigger[] = []

  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax') || '0.12') || 0.12
    const tween = gsap.to(el, {
      yPercent: speed * 22,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    tweens.push(tween)
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  return () => {
    window.clearTimeout(safety)
    observer.disconnect()
    tweens.forEach((t) => t.kill())
    triggers.forEach((t) => t.kill())
  }
}

export function initBackgroundScroll() {
  ensureGsap()
  if (prefersReducedMotion()) return () => {}

  // Skip scrubbed full-screen layers on small screens (jank/flicker)
  if (window.matchMedia('(max-width: 768px)').matches) return () => {}

  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  document.querySelectorAll<HTMLElement>('[data-bg-scroll]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-bg-scroll') || '0.2') || 0.2
    const tween = gsap.to(el, {
      y: () => Math.min(window.innerHeight * speed * 0.18, 80),
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    })
    tweens.push(tween)
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll<HTMLElement>('[data-bg-orb]').forEach((el, i) => {
    const dir = i % 2 === 0 ? 1 : -1
    const tween = gsap.to(el, {
      y: dir * 48,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    })
    tweens.push(tween)
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  return () => {
    tweens.forEach((t) => t.kill())
    triggers.forEach((t) => t.kill())
  }
}

export function animateHero(root: HTMLElement) {
  ensureGsap()
  const targets = root.querySelectorAll<HTMLElement>('[data-hero]')
  if (!targets.length) return () => {}

  if (prefersReducedMotion()) {
    targets.forEach(forceVisible)
    return () => {}
  }

  // Only hide hero bits that aren't already painted visible
  targets.forEach((el) => {
    el.classList.add('hero-pending')
  })

  const tl = gsap.timeline({ defaults: { ease: EASE } })
  targets.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-hero-delay') || '0') || 0
    tl.to(
      el,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        onStart: () => {
          el.classList.remove('hero-pending')
        },
        onComplete: () => {
          el.classList.remove('hero-pending')
          gsap.set(el, { clearProps: 'transform,opacity' })
        },
      },
      0.06 + delay
    )
  })

  const safety = window.setTimeout(() => {
    targets.forEach(forceVisible)
  }, 1600)

  // Subtle bg settle only — no continuous ken-burns from GSAP (CSS handles static frame)
  const bg = root.querySelector<HTMLElement>('[data-hero-bg]')
  if (bg && !window.matchMedia('(max-width: 768px)').matches) {
    gsap.fromTo(
      bg,
      { scale: 1.06 },
      { scale: 1.02, duration: 1.6, ease: EASE_SOFT, clearProps: 'transform' }
    )
  }

  return () => {
    window.clearTimeout(safety)
    tl.kill()
  }
}

/**
 * Ambient loops used to scale every card image forever — that fought CSS hover
 * transforms and caused visible flicker on many devices. Disabled on purpose.
 */
export function initAmbientLoops(_root: HTMLElement) {
  return () => {}
}

/** Soft page enter — never flash opacity on the whole page. */
export function pageEnter(el: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,opacity' })
    return
  }
  // Translate only (no opacity) so content never dims/flickers on route change
  gsap.fromTo(
    el,
    { y: 10 },
    { y: 0, duration: 0.35, ease: EASE_SOFT, clearProps: 'transform' }
  )
}
