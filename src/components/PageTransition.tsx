import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

type Phase = 'idle' | 'in' | 'out'

/**
 * Subtle page-change FX — no creatures, no icons.
 * Short cinematic wipe + glow so navigation feels premium without blocking content.
 */
export default function PageTransition() {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<Phase>('idle')
  const [ready, setReady] = useState(false)
  const [variant, setVariant] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Skip heavy wipe on small screens — felt like flicker during navigation
    if (window.matchMedia('(max-width: 768px)').matches) return

    setVariant(Math.floor(Math.random() * 3))
    setPhase('in')

    const t1 = window.setTimeout(() => setPhase('out'), 220)
    const t2 = window.setTimeout(() => setPhase('idle'), 520)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pathname, ready])

  if (phase === 'idle') return null

  return (
    <div
      className={`page-fx page-fx--${phase} page-fx--v${variant}`}
      aria-hidden
    >
      <div className="page-fx__veil" />
      <div className="page-fx__beam" />
      <div className="page-fx__line page-fx__line--a" />
      <div className="page-fx__line page-fx__line--b" />
      <div className="page-fx__spark" />
    </div>
  )
}
