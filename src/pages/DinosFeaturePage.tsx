import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { asset } from '@/lib/assets'
import { BASIC_DINOS } from '@/lib/dinos'
import { usePageMotion } from '@/hooks/useMotion'

export default function DinosFeaturePage() {
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
        <div className="dd-card overflow-hidden mb-12" data-reveal="scale">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '16 / 10', minHeight: 240 }}
          >
            <img
              src={asset('feature-dinos-hero.jpg')}
              alt="Tame dinosaurs"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(7,6,10,0.95) 0%, rgba(7,6,10,0.35) 50%, rgba(7,6,10,0.2) 100%)',
              }}
            />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
              <p className="eyebrow">Feature · Beasts</p>
              <h1 className="display-lg text-white mt-3">
                Tame
                <br />
                <span className="text-gradient-magma">dinosaurs</span>
              </h1>
              <p className="body-lg mt-4 max-w-xl">
                Basic creatures you can command — simple roles, clear jobs in battle.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mb-10" data-reveal="up">
          <p className="body-lg">
            Basic beasts only — clear roles, no walls of text. How they chain with heroes
            and troops is something you feel in campaign, not on a website.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">BASIC DINOS</h2>
          <div className="hud-line flex-1 opacity-50" />
          <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]/80">
            {BASIC_DINOS.length} beasts
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-14" data-reveal-stagger>
          {BASIC_DINOS.map((d) => (
            <article
              key={d.id}
              id={d.id}
              data-reveal-item
              className="dd-card flex flex-col sm:flex-row gap-0 overflow-hidden scroll-mt-28"
            >
              <div className="relative w-full sm:w-[42%] min-h-[180px] sm:min-h-[200px] shrink-0 bg-[#0a0810] flex items-center justify-center p-3">
                <img
                  src={d.img}
                  alt={d.name}
                  className="dino-fit w-full h-[160px] sm:h-[180px]"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]">
                  {d.role}
                </p>
                <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-wide mt-0.5">
                  {d.name}
                </h3>
                <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                  {d.blurb}
                </p>
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
