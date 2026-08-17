import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import './HomeIntro.css'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function HomeIntro() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pathname !== '/' || prefersReducedMotion()) {
      setVisible(false)
      return
    }

    let seen = false
    try {
      seen = window.sessionStorage.getItem('dw-home-intro-v2') === '1'
    } catch {
      seen = false
    }

    if (seen) return

    setVisible(true)
    try {
      window.sessionStorage.setItem('dw-home-intro-v2', '1')
    } catch {
      // The intro can still run when session storage is unavailable.
    }

    const timer = window.setTimeout(() => setVisible(false), 3100)
    return () => window.clearTimeout(timer)
  }, [pathname])

  if (!visible) return null

  return (
    <div className="home-intro" role="presentation">
      <div className="home-intro__shutter home-intro__shutter--top" />
      <div className="home-intro__shutter home-intro__shutter--bottom" />
      <div className="home-intro__scan" />
      <div className="home-intro__mark" aria-hidden>
        <span className="home-intro__code">WORLD 01 // COMMAND LINK</span>
        <strong>DINO</strong>
        <strong className="home-intro__warfront">WARFRONT</strong>
        <span className="home-intro__sub">SURVIVE · COMMAND · CONQUER</span>
      </div>
      <button type="button" className="home-intro__skip" onClick={() => setVisible(false)}>
        Skip intro
      </button>
    </div>
  )
}
