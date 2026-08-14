import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AuthProvider } from '@/hooks/useAuth'
import Navigation from '@/sections/Navigation'
import Footer from '@/sections/Footer'
import PageTransition from '@/components/PageTransition'
import { asset } from '@/lib/assets'
import { useSmoothScroll } from '@/hooks/useMotion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsap, initBackgroundScroll } from '@/lib/motion'

const SupportChat = lazy(() => import('@/components/SupportChat'))

// Fewer particles = less GPU thrash / flicker on mid-range phones
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 17 + 5) % 100}%`,
  delay: `${(i * 0.55) % 14}s`,
  duration: `${12 + (i % 8)}s`,
  size: i % 4 === 0 ? 2 : 1,
}))

export default function MainLayout() {
  const { pathname } = useLocation()
  useSmoothScroll()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  useEffect(() => {
    ensureGsap()
    const killBg = initBackgroundScroll()
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      window.clearTimeout(t)
      killBg()
    }
  }, [])

  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col bg-[var(--void)]">
        <div className="site-atmosphere" aria-hidden />

        {/* One lightweight global texture is enough. The former second fixed
            background was a ~2.6 MB PNG downloaded on every first visit. */}
        <div
          data-bg-scroll="0.28"
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.28] fx-bg-layer"
          aria-hidden
          style={{
            backgroundImage: `url(${asset('fx-void-bg.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5) saturate(1.15)',
            transform: 'scale(1.08)',
          }}
        />
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(circle at 65% 20%, rgba(72,91,64,0.12), transparent 38%), linear-gradient(180deg, rgba(5,4,10,0.3) 0%, rgba(5,4,10,0.62) 40%, rgba(5,4,10,0.94) 100%)',
          }}
        />

        <div className="fx-fog fx-fog-a fx-desktop-only" aria-hidden />
        <div className="fx-fog fx-fog-b fx-desktop-only" aria-hidden />

        <div
          data-bg-orb
          className="glow-orb-magma fixed w-[480px] h-[480px] -top-24 -right-16 z-0 opacity-35 animate-orb-float fx-desktop-only"
          aria-hidden
        />
        <div
          data-bg-orb
          className="fixed w-[380px] h-[380px] bottom-[8%] -left-20 z-0 opacity-30 animate-orb-float-slow rounded-full pointer-events-none fx-desktop-only"
          aria-hidden
          style={{
            background: 'radial-gradient(circle, rgba(79,143,99,0.45), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          data-bg-orb
          className="fixed w-[300px] h-[300px] top-[40%] left-[40%] z-0 opacity-18 animate-orb-drift rounded-full pointer-events-none fx-desktop-only"
          aria-hidden
          style={{
            background: 'radial-gradient(circle, rgba(240,193,77,0.35), transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="fx-light-sweep fx-desktop-only" aria-hidden />

        <div className="fx-particles fx-desktop-only" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className="grain-overlay" />
        <div className="site-vignette" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <PageTransition />
          <Suspense fallback={null}>
            <SupportChat />
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  )
}
