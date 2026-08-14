import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import {
  animateHero,
  initAmbientLoops,
  initReveals,
  pageEnter,
  ensureGsap,
} from '@/lib/motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Page enter + scroll reveals.
 * Ambient image scale loops removed (caused flicker).
 * Scroll uses IntersectionObserver. No Lenis.
 */
export function usePageMotion(enabled = true) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    ensureGsap()
    pageEnter(el)

    const killHero = animateHero(el)
    // Wait one frame so layout is stable before measuring reveals (reduces flash)
    let killReveal: (() => void) | undefined
    let killAmbient: (() => void) | undefined
    let raf = 0
    let refreshTimer = 0

    raf = window.requestAnimationFrame(() => {
      killReveal = initReveals(el)
      killAmbient = initAmbientLoops(el)
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(refreshTimer)
      killHero()
      killReveal?.()
      killAmbient?.()
    }
  }, [pathname, enabled])

  return ref
}

/** Native smooth scroll only — Lenis broke ScrollTrigger visibility. */
export function useSmoothScroll() {
  useEffect(() => {
    // Keep native scrolling; document already has scroll-behavior: smooth in CSS
  }, [])
}
