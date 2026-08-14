import { useEffect, useRef, useState } from 'react'

/**
 * Counts a number up once the element scrolls into view.
 * Ticks on requestAnimationFrame so the reveal reads as a readout coming
 * online rather than a value that was simply printed.
 */
export function useCountUp(target: number, durationMs = 1400) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let start = 0

    // No animation wanted: show the final figure, still off the render pass.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      raf = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(raf)
    }

    const run = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / durationMs)
      // Fast out of the gate, easing into the final figure.
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(run)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !done.current) {
          done.current = true
          raf = requestAnimationFrame(run)
        }
      },
      { threshold: 0.35 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, durationMs])

  return { ref, value }
}
