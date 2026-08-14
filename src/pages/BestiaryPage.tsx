import { Link } from 'react-router'
import { BASIC_DINOS } from '@/lib/dinos'
import { BASIC_HEROES } from '@/lib/heroes'
import { usePageMotion } from '@/hooks/useMotion'

export default function BestiaryPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="max-w-2xl mb-12 md:mb-14" data-reveal="up">
          <p className="eyebrow">Bestiary</p>
          <h1 className="display-lg text-white mt-4">
            Beasts &
            <br />
            <span className="text-gradient-magma">legends</span>
          </h1>
          <p className="body-lg mt-5">
            First glance only — names and faces. Tap a card for roles and tips.
            The full picture of how they fight together is in the beta.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">DINOSAURS</h2>
          <div className="hud-line flex-1 opacity-50" />
          <Link
            to="/features/dinos"
            className="font-ui text-[10px] tracking-[0.18em] uppercase text-[var(--gold)] no-underline hover:text-[var(--magma-glow)] shrink-0"
          >
            All details →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-16" data-reveal-stagger>
          {BASIC_DINOS.map((d) => (
            <Link
              key={d.id}
              to={`/features/dinos#${d.id}`}
              className="dd-card group no-underline text-inherit"
              data-reveal-item
            >
              <div className="aspect-[3/4] relative bg-[#0a0810] flex flex-col">
                <div className="flex-1 flex items-center justify-center p-3 min-h-0">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="dino-fit w-full h-full max-h-[78%] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="absolute top-2 right-2 font-ui text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/50 border border-[var(--gold)]/25 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Info
                </span>
                <div className="relative z-10 p-3 pt-0">
                  <p className="font-ui text-[9px] tracking-widest uppercase text-[var(--gold)]">
                    {d.role}
                  </p>
                  <p className="font-display text-base md:text-lg text-white uppercase tracking-wide mt-0.5">
                    {d.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">HEROES</h2>
          <div className="hud-line flex-1 opacity-50" />
          <Link
            to="/features/heroes"
            className="font-ui text-[10px] tracking-[0.18em] uppercase text-[var(--gold)] no-underline hover:text-[var(--magma-glow)] shrink-0"
          >
            All details →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" data-reveal-stagger>
          {BASIC_HEROES.map((h) => (
            <Link
              key={h.id}
              to={`/features/heroes#${h.id}`}
              className="dd-card group no-underline text-inherit"
              data-reveal-item
            >
              <div className="aspect-[3/4] relative bg-[#0a0810]">
                <img
                  src={h.img}
                  alt={h.name}
                  className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                  style={{ objectFit: 'cover', objectPosition: 'center 12%' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(7,6,10,0.95), transparent)',
                  }}
                />
                <span className="absolute top-2 right-2 font-ui text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/50 border border-[var(--gold)]/25 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Info
                </span>
                <div className="absolute bottom-0 inset-x-0 z-10 p-3">
                  <p className="font-ui text-[10px] tracking-widest uppercase text-[var(--gold)]">
                    {h.role}
                  </p>
                  <p className="font-display text-base text-white uppercase mt-0.5">
                    {h.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/features/dinos" className="btn-primary no-underline">
            Dino details
          </Link>
          <Link to="/features/heroes" className="btn-secondary no-underline">
            Hero details
          </Link>
          <Link to="/download" className="btn-secondary no-underline">
            Play free
          </Link>
        </div>
      </div>
    </div>
  )
}
