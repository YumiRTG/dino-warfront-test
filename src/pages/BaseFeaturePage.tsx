import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { BASE_BUILDINGS } from '@/lib/buildings'
import { usePageMotion } from '@/hooks/useMotion'

export default function BaseFeaturePage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="dd-card overflow-hidden mb-12 md:mb-16" data-reveal="scale">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10', minHeight: 240 }}>
            <img
              src={asset('feature-base-hero.jpg')}
              alt="Build your base"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 35%' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(7,6,10,0.95) 0%, rgba(7,6,10,0.35) 45%, rgba(7,6,10,0.2) 100%)',
              }}
            />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
              <p className="eyebrow">Feature · Base</p>
              <h1 className="display-lg text-white mt-3">
                Build your
                <br />
                <span className="text-gradient-magma">base</span>
              </h1>
              <p className="body-lg mt-4 max-w-xl">
                Town halls, camps, hospitals and production chains that grow your empire while offline.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 mb-16" data-reveal="up">
          <div className="lg:col-span-5">
            <p className="eyebrow">The vision</p>
            <h2 className="display-md text-white mt-4">
              From outpost to
              <br />
              <span className="text-gradient-gold">fortress city</span>
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p className="body-lg">
              Your base is the heart of Dino Warfront. Start as a fragile camp on the plaza —
              raise halls, production lines and defenses until the wild itself respects your walls.
            </p>
            <p className="body-lg">
              Buildings feed each other: farms and mines run offline, camps fill your army,
              hospitals recover losses, research unlocks power. The vision is a living city that
              grows even when you step away — then backs every campaign push with steel and supply.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">BUILDINGS</h2>
          <div className="hud-line flex-1 opacity-50" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14" data-reveal-stagger>
          {BASE_BUILDINGS.map((b) => (
            <article key={b.id} className="dd-card group" data-reveal-item>
              <div className="relative h-36 overflow-hidden bg-[#0a0810]">
                <img
                  src={b.img}
                  alt={b.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: 'center 30%' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(7,6,10,0.9), transparent 60%)',
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]">
                    {b.role}
                  </p>
                  <h3 className="font-display text-xl text-white uppercase tracking-wide">
                    {b.name}
                  </h3>
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">{b.blurb}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Download & build
          </Link>
          <Link to="/features/heroes" className="btn-secondary no-underline">
            Command heroes
          </Link>
          <Link to="/features" className="btn-secondary no-underline">
            All features
          </Link>
        </div>
      </div>
    </div>
  )
}
