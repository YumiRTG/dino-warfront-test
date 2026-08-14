import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'

export default function StoryPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div data-reveal="left">
          <p className="eyebrow">Chapter fragment · I of many</p>
          <h1 className="display-lg text-white mt-4">
            A world where
            <br />
            <span className="text-gradient-magma">only the adaptable</span>
            <br />
            survive
          </h1>
          <p className="body-lg mt-6">
            Nyra Vale holds a fractured tribe at the edge of a waking age.
            Jungles hide riches. Volcanoes hide death. Rival clans are already
            moving — and not everything that hunts has a name on this page.
          </p>
          <p className="body-lg mt-4">
            This is the opening. Beasts, campaigns and the true cost of power
            sit one layer deeper. The whole picture is in the systems — and in the game.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-10" data-reveal-stagger>
            {[
              { k: 'I', v: 'You are here' },
              { k: 'II', v: 'Systems next' },
              { k: 'III', v: 'Play to finish' },
            ].map((s) => (
              <div key={s.k} className="stat-chip" data-reveal-item>
                <p className="font-display text-lg text-[var(--gold)]">{s.k}</p>
                <p className="font-ui text-[10px] uppercase tracking-wider text-[var(--bone-dim)] mt-1">
                  {s.v}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-10" data-reveal="up" data-reveal-delay="0.1">
            <Link to="/features" className="btn-primary no-underline">
              Uncover systems
            </Link>
            <Link to="/features/campaign" className="btn-secondary no-underline">
              Campaign path
            </Link>
            <Link to="/download" className="btn-secondary no-underline">
              Enter the beta
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto" data-reveal="right">
          <div
            className="media-frame relative w-full overflow-hidden group"
            style={{ aspectRatio: '3 / 4', minHeight: 420 }}
          >
            <img
              data-parallax="0.1"
              src={asset('hero-nyra.png')}
              alt="Nyra Vale"
              className="absolute inset-0 w-full h-[115%] transition-transform duration-700 group-hover:scale-105 will-change-transform"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 12%',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none z-[1]"
              style={{
                background:
                  'linear-gradient(to top, rgba(7,6,10,0.95) 0%, transparent 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
              <p className="font-ui text-xs tracking-[0.22em] uppercase text-[var(--gold)]">
                Chapter I · Nyra Vale
              </p>
              <p className="font-display text-3xl text-white mt-2">
                Dawn of the Dominion
              </p>
            </div>
          </div>

          <div
            className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl animate-pulse-glow"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(255,77,26,0.3), transparent 65%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
