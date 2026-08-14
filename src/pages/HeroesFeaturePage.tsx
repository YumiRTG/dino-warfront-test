import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { asset } from '@/lib/assets'
import { BASIC_HEROES } from '@/lib/heroes'
import { usePageMotion } from '@/hooks/useMotion'

export default function HeroesFeaturePage() {
  const motionRef = usePageMotion()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 350)
    }
  }, [hash])

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        {/* Hero banner */}
        <div className="dd-card overflow-hidden mb-12 md:mb-16" data-reveal="scale">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10', minHeight: 240 }}>
            <img
              src={asset('feature-heroes-hero.jpg')}
              alt="Command heroes"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(7,6,10,0.95) 0%, rgba(7,6,10,0.35) 45%, rgba(7,6,10,0.25) 100%)',
              }}
            />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
              <p className="eyebrow">Feature · Roster</p>
              <h1 className="display-lg text-white mt-3">
                Command
                <br />
                <span className="text-gradient-magma">heroes</span>
              </h1>
              <p className="body-lg mt-4 max-w-xl">
                Nyra Vale and elite allies with unique skill kits that rewrite every battle.
              </p>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16" data-reveal="up">
          <div className="lg:col-span-5">
            <p className="eyebrow">The vision</p>
            <h2 className="display-md text-white mt-4">
              Legends who
              <br />
              <span className="text-gradient-gold">lead the hunt</span>
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p className="body-lg">
              Heroes are not cosmetics — they are the commanders that turn a raw tribe into a
              fighting dominion. Each basic hero brings a different focus: leadership, strike,
              support, control, frontline power, or wild versatility.
            </p>
            <p className="body-lg">
              Recruit them in-game, level their skills, and pair them with dinosaurs and troops.
              The same basic roster you see here is what friends meet in the beta — no filler,
              just the core legends.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mt-6">
              {[
                'Unique skill kits per hero',
                'Synergy with dinos & troops',
                'Grow power through levels',
                'Story anchored by Nyra Vale',
              ].map((t) => (
                <li
                  key={t}
                  className="stat-chip font-ui text-xs uppercase tracking-[0.14em] text-[var(--bone)] list-none"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Basic heroes */}
        <div className="flex items-center gap-4 mb-8" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">BASIC HEROES</h2>
          <div className="hud-line flex-1 opacity-50" />
          <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]/80">
            {BASIC_HEROES.length} legends
          </span>
        </div>

        <div className="space-y-5 mb-14">
          {BASIC_HEROES.map((h, i) => (
            <article
              key={h.id}
              id={h.id}
              data-reveal={i % 2 === 0 ? 'left' : 'right'}
              className="dd-card scroll-mt-28"
            >
              <div className="grid md:grid-cols-12 gap-0">
                <div className="md:col-span-4 relative min-h-[220px] bg-[#0a0810]">
                  <img
                    src={h.img}
                    alt={h.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 12%' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 md:hidden"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(7,6,10,0.9), transparent 50%)',
                    }}
                  />
                </div>
                <div className="md:col-span-8 p-5 md:p-8 flex flex-col justify-center">
                  <p className="font-ui text-[10px] tracking-[0.22em] uppercase text-[var(--gold)]">
                    {h.role} · {h.focus}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide mt-1">
                    {h.name}
                  </h3>
                  <p className="font-body text-sm md:text-base text-[var(--bone-dim)] mt-3 leading-relaxed">
                    {h.blurb}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {h.tips.map((tip) => (
                      <li
                        key={tip}
                        className="font-body text-sm text-[var(--mist)] flex gap-2 leading-relaxed"
                      >
                        <span className="text-[var(--magma)] shrink-0">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Download & play
          </Link>
          <Link to="/bestiary" className="btn-secondary no-underline">
            Full bestiary
          </Link>
          <Link to="/features" className="btn-secondary no-underline">
            All features
          </Link>
        </div>
      </div>
    </div>
  )
}
