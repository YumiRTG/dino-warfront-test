import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'

const GROWTH = [
  ['01', 'Choose', 'At Town Hall 18, enter the partner selection and choose one of three starter dinosaurs.'],
  ['02', 'Hatch', 'Your partner begins small. The relationship starts before the power does.'],
  ['03', 'Bond', 'Feed and pet your dinosaur every day to build the bond and make progression feel personal.'],
  ['04', 'Grow', 'Advance through six upgrade paths while your partner develops from baby to battle companion.'],
  ['05', 'Equip', 'Attach visible armor pieces as the dinosaur becomes stronger and more battle-ready.'],
  ['06', 'March', 'Your partner gains progress alongside your marches and joins the empire you built together.'],
]

export default function PartnerSystemPage() {
  const motionRef = usePageMotion()
  const partnerArtwork = asset('promo/partner-system-promo.webp')

  return (
    <div ref={motionRef} className="page-shell partner-system-page">
      <div className="container-dd">
        <section className="dd-card overflow-hidden">
          <div
            className="relative min-h-[34rem] md:min-h-[42rem] overflow-hidden partner-artwork-safe partner-system-hero-media"
            style={{
              backgroundColor: '#080710',
              transform: 'none',
              filter: 'none',
              backfaceVisibility: 'visible',
              WebkitBackfaceVisibility: 'visible',
              willChange: 'auto',
            }}
          >
            <img
              src={partnerArtwork}
              alt="A young dinosaur growing beside its human partner"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center center',
                transform: 'none',
                filter: 'none',
                opacity: 1,
                animation: 'none',
                transition: 'none',
                backfaceVisibility: 'visible',
                WebkitBackfaceVisibility: 'visible',
                willChange: 'auto',
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,4,11,.96)_0%,rgba(6,4,11,.72)_38%,rgba(6,4,11,.12)_76%),linear-gradient(to_top,rgba(6,4,11,.96),transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-3xl">
              <p className="eyebrow">Feature · Partner System</p>
              <h1 className="display-lg text-white mt-3">
                Raise your
                <br />
                <span style={{ color: '#c78cff' }}>dinosaur</span>
              </h1>
              <p className="body-lg mt-5 max-w-2xl">
                Start with a baby. Build the bond, watch it grow, equip it and take the same companion into the marches that shape your empire.
              </p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-3 mt-6" data-reveal-stagger>
          {[
            ['TOWN HALL 18', 'Unlock the partner selection'],
            ['3 STARTERS', 'Different dinosaurs, equal starting power'],
            ['6 PATHS', 'Long-term partner progression'],
          ].map(([value, label]) => (
            <div key={value} className="dd-card p-5" data-reveal-item>
              <strong className="font-display text-2xl text-white tracking-wide">{value}</strong>
              <p className="font-body text-sm text-[var(--bone-dim)] mt-2">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 md:mt-20">
          <div className="sec-ornament mb-4 max-w-[260px]"><span>From hatch to warfront</span></div>
          <h2 className="display-md text-white">
            Not a pet slot.
            <br />
            <span style={{ color: '#c78cff' }}>A companion you raise.</span>
          </h2>
          <p className="body-lg mt-5 max-w-3xl">
            The system replaces a passive manager-equipment feeling with something visible and personal. Your partner grows because you keep using it, caring for it and taking it into the world.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8" data-reveal-stagger>
            {GROWTH.map(([step, title, text]) => (
              <article key={step} className="dd-card p-5" data-reveal-item>
                <span className="font-ui text-[10px] tracking-[.22em] uppercase" style={{ color: '#c78cff' }}>{step}</span>
                <h3 className="font-display text-xl text-white uppercase mt-2">{title}</h3>
                <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed mt-2">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5 mt-16 md:mt-20">
          <div className="dd-card p-6 md:p-8" data-reveal="left">
            <p className="eyebrow">Daily bond</p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mt-3">Feed. Pet. Train.</h2>
            <p className="body-lg mt-4">
              Small daily interactions keep the partner alive as a relationship instead of turning it into another invisible stat sheet. Progress still matters, but the dinosaur remains the thing you see growing.
            </p>
          </div>
          <div className="dd-card p-6 md:p-8" data-reveal="right">
            <p className="eyebrow">Long-term identity</p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mt-3">Your partner. Your build.</h2>
            <p className="body-lg mt-4">
              Armor pieces appear on the model, marches add progression, and a special change item lets you switch your chosen dinosaur without making the starter choice a permanent mistake.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 mt-12" data-reveal="up">
          <Link to="/features/dinos" className="btn-primary no-underline">Explore Dino Roster</Link>
          <Link to="/features" className="btn-secondary no-underline">All Features</Link>
          <Link to="/" className="btn-secondary no-underline">Back Home</Link>
        </div>
      </div>
    </div>
  )
}
