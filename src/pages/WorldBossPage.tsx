import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'

const EVENT_FLOW = [
  ['01', 'Boss appears', 'Three times each week, a colossal boss enters the world map at changing event times.'],
  ['02', 'Join anytime', 'Open the event while it is active and send your march without needing to be there at the first second.'],
  ['03', 'Stack damage', 'Attack alone, coordinate with friends or keep feeding alliance damage into the same target.'],
  ['04', 'Protect progress', 'Units are wounded during the event instead of permanently killed, keeping participation aggressive.'],
  ['05', 'Climb rewards', 'Push through three reward tiers while total damage and participation keep the hunt competitive.'],
]

export default function WorldBossPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <section className="dd-card overflow-hidden" data-reveal="scale">
          <div className="relative min-h-[34rem] md:min-h-[42rem] overflow-hidden">
            <img
              src={asset('promo/worldboss-promo.jpg')}
              alt="Alliance warriors attacking a colossal dinosaur world boss"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,4,4,.96)_0%,rgba(7,4,4,.70)_38%,rgba(7,4,4,.12)_76%),linear-gradient(to_top,rgba(7,4,4,.96),transparent_58%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-3xl">
              <p className="eyebrow">World Event · World Boss</p>
              <h1 className="display-lg text-white mt-3">
                Rally
                <br />
                <span style={{ color: '#ff8a38' }}>the hunt</span>
              </h1>
              <p className="body-lg mt-5 max-w-2xl">
                A giant threat enters the shared world. Hit it when you can, coordinate your alliance and turn every march into progress toward the next reward tier.
              </p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-3 mt-6" data-reveal-stagger>
          {[
            ['3× WEEKLY', 'Different event times'],
            ['WOUNDED ONLY', 'No permanent troop deaths'],
            ['3 TIERS', 'Damage-driven rewards'],
          ].map(([value, label]) => (
            <div key={value} className="dd-card p-5" data-reveal-item>
              <strong className="font-display text-2xl text-white tracking-wide">{value}</strong>
              <p className="font-body text-sm text-[var(--bone-dim)] mt-2">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 md:mt-20">
          <div className="sec-ornament mb-4 max-w-[260px]"><span>Live world-map event</span></div>
          <h2 className="display-md text-white">
            One target.
            <br />
            <span style={{ color: '#ff8a38' }}>Every march counts.</span>
          </h2>
          <p className="body-lg mt-5 max-w-3xl">
            The World Boss is built for repeated participation instead of a single scripted battle. The creature lives on the world map, the event sits in the calendar, and your alliance can keep pushing damage throughout the active window.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mt-8" data-reveal-stagger>
            {EVENT_FLOW.map(([step, title, text]) => (
              <article key={step} className="dd-card p-5" data-reveal-item>
                <span className="font-ui text-[10px] tracking-[.22em] uppercase" style={{ color: '#ff8a38' }}>{step}</span>
                <h3 className="font-display text-lg text-white uppercase mt-2">{title}</h3>
                <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed mt-2">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5 mt-16 md:mt-20">
          <div className="dd-card p-6 md:p-8" data-reveal="left">
            <p className="eyebrow">Alliance pressure</p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mt-3">Fight together without waiting.</h2>
            <p className="body-lg mt-4">
              Players do not need one perfectly synchronized attack window. They can enter while the event is active, send marches, compare damage and keep building the alliance result.
            </p>
          </div>
          <div className="dd-card p-6 md:p-8" data-reveal="right">
            <p className="eyebrow">Designed for repeat play</p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mt-3">Different boss. Same hunt.</h2>
            <p className="body-lg mt-4">
              The event UI stays reusable while different World Boss creatures rotate through the calendar. That keeps the system readable while the actual threat can change over time.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 mt-12" data-reveal="up">
          <Link to="/modes/world-map" className="btn-primary no-underline">Explore World Map</Link>
          <Link to="/modes" className="btn-secondary no-underline">All Modes</Link>
          <Link to="/" className="btn-secondary no-underline">Back Home</Link>
        </div>
      </div>
    </div>
  )
}
