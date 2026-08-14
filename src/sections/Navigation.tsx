import { useEffect, useState } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import LoginModal from '@/components/LoginModal'
import DinoMark from '@/components/DinoMark'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Story', to: '/story' },
  { label: 'Modes', to: '/modes' },
  { label: 'Features', to: '/features' },
  { label: 'Play', to: '/play' },
  { label: 'Redeem', to: '/redeem' },
  { label: 'Bestiary', to: '/bestiary' },
  { label: 'Progress', to: '/progress' },
  { label: 'Download', to: '/download' },
]

export default function Navigation() {
  const { session, logout, ready } = useAuth()
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (params.get('login') === '1') setLoginOpen(true)
  }, [params])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeLogin = () => {
    setLoginOpen(false)
    if (params.get('login')) {
      params.delete('login')
      setParams(params, { replace: true })
    }
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[100]">
        {/* Top news ticker — AAA game sites style */}
        <div className="news-strip hidden sm:block">
          <div className="container-dd flex items-center justify-between h-8 text-[10px] font-ui tracking-[0.2em] uppercase">
            <span className="text-[var(--magma-glow)]">Friend beta</span>
            <span className="text-[var(--bone)]/50 truncate px-4">
              Four modes live · Primeval Defense · Arena 1v1 &amp; 3×3 · Shared world map · 78-stage campaign
            </span>
            <Link
              to="/progress"
              className="text-[var(--gold)] no-underline hover:text-[var(--magma-glow)] shrink-0"
            >
              Latest updates →
            </Link>
          </div>
        </div>

        <div
          className="transition-all duration-400"
          style={{
            background: scrolled
              ? 'linear-gradient(180deg, rgba(5,4,10,0.96) 0%, rgba(8,6,16,0.92) 100%)'
              : 'linear-gradient(180deg, rgba(5,4,10,0.72) 0%, transparent 100%)',
            backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'blur(10px)',
            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'blur(10px)',
            borderBottom: scrolled
              ? '1px solid rgba(167,139,250,0.18)'
              : '1px solid transparent',
            boxShadow: scrolled
              ? '0 12px 50px rgba(0,0,0,0.45), 0 0 40px rgba(123,92,255,0.06)'
              : 'none',
          }}
        >
          <nav className="container-dd flex items-center justify-between gap-4 h-[4.25rem] sm:h-[4.5rem]">
            <Link
              to="/"
              className="flex items-center gap-3 no-underline shrink-0 group"
              onClick={() => setOpen(false)}
            >
              <span className="relative text-[var(--gold)] group-hover:text-[var(--magma-glow)] transition-colors">
                <span
                  className="absolute inset-0 blur-md opacity-50 bg-[var(--magma)] rounded-full scale-150"
                  aria-hidden
                />
                <DinoMark className="w-9 h-9 relative" />
              </span>
              <div className="leading-none">
                <span className="font-display text-[1rem] sm:text-lg tracking-[0.16em] text-white block">
                  DINO WARFRONT
                </span>
                <span className="hidden sm:block font-ui text-[9px] tracking-[0.32em] text-[var(--gold)]/70 uppercase mt-1">
                  Tame · Hunt · Conquer
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-7">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-link no-underline ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2.5">
              {ready && session ? (
                <>
                  <div className="text-right max-w-[140px] px-2">
                    <p className="font-ui text-[10px] tracking-wider uppercase text-[var(--gold)]/80">
                      Commander
                    </p>
                    <p className="font-ui text-[12px] tracking-wider uppercase text-[var(--bone)] truncate">
                      {session.displayName}
                    </p>
                  </div>
                  <button type="button" onClick={logout} className="btn-ghost">
                    Log out
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setLoginOpen(true)} className="btn-ghost">
                  Log in
                </button>
              )}
              <Link
                to="/download"
                className="btn-primary !py-2.5 !px-5 !text-[0.72rem] no-underline"
              >
                Play free
              </Link>
            </div>

            <button
              type="button"
              className="xl:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              <span
                className="block w-6 h-0.5 bg-[var(--bone)] transition-transform origin-center"
                style={{ transform: open ? 'translateY(4px) rotate(45deg)' : undefined }}
              />
              <span
                className="block w-6 h-0.5 bg-[var(--bone)] transition-opacity"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="block w-6 h-0.5 bg-[var(--bone)] transition-transform origin-center"
                style={{ transform: open ? 'translateY(-4px) rotate(-45deg)' : undefined }}
              />
            </button>
          </nav>
          <div
            className="h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(123,92,255,0.45), rgba(245,193,93,0.5), rgba(255,77,26,0.4), transparent)',
            }}
          />
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[99] xl:hidden pt-28 px-6 pb-10 overflow-y-auto"
          style={{
            background:
              'linear-gradient(165deg, rgba(5,4,10,0.98) 0%, rgba(18,10,28,0.98) 100%)',
          }}
        >
          <div className="flex flex-col gap-1 max-w-sm mx-auto">
            {navItems.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-4xl uppercase tracking-wide text-white no-underline hover:text-[var(--gold)] py-2 border-b border-white/5"
                style={{ animation: `rise-in 0.4s ease ${i * 0.05}s both` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              {session ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="btn-secondary w-full"
                >
                  Log out · {session.displayName}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setLoginOpen(true)
                  }}
                  className="btn-secondary w-full"
                >
                  Log in
                </button>
              )}
              <Link
                to="/download"
                onClick={() => setOpen(false)}
                className="btn-primary no-underline w-full"
              >
                Play free
              </Link>
            </div>
          </div>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={closeLogin} />
    </>
  )
}
