import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'

const features = [
  {
    title: 'Build your base',
    text: 'The plaza is only the first layer. Offline production never fully sleeps…',
    hook: 'Open to see which buildings actually feed the war.',
    img: asset('feature-base-hero.jpg'),
    pos: 'center 35%',
    to: '/features/base',
  },
  {
    title: 'Command heroes',
    text: 'Nyra is the face — not the whole war. Other legends wait behind the ranks.',
    hook: 'Open the basic roster and their real roles.',
    img: asset('feature-heroes-hero.jpg'),
    pos: 'center center',
    to: '/features/heroes',
  },
  {
    title: 'Tame dinosaurs',
    text: 'You know the names. You do not yet know how they break a line together.',
    hook: 'Simple roles — full list inside.',
    img: asset('feature-dinos-hero.jpg'),
    pos: 'center center',
    to: '/features/dinos',
  },
  {
    title: 'Conquer campaigns',
    text: 'Jungle first. Then ice, fire, water — each realm changes the cost of a mistake.',
    hook: 'See how stages, squads and loot actually work.',
    img: asset('feature-campaign-hero.jpg'),
    pos: 'center 35%',
    to: '/features/campaign',
  },
  {
    title: 'Train your army',
    text: 'Infantry, riders, shooters… tiers matter. The full formation math is in the build.',
    hook: 'Teaser only — master it in the APK.',
    img: asset('troop-infantry.png'),
    pos: 'center 15%',
  },
  {
    title: 'Forge alliances',
    text: 'Lone tribes fall. What alliances unlock mid-campaign is still unfolding in beta.',
    img: asset('campaign-2.png'),
    pos: 'center 35%',
  },
]

export default function FeaturesPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="max-w-2xl mb-12 md:mb-16" data-reveal="up">
          <p className="eyebrow">Systems · layered intel</p>
          <h1 className="display-lg text-white mt-4">
            Built for
            <br />
            <span className="text-gradient-magma">domination</span>
          </h1>
          <p className="body-lg mt-5">
            You only get fragments here. Each card is a door — open it for the next
            layer. The full loop only closes when you play the beta.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" data-reveal-stagger>
          {features.map((f) => {
            const inner = (
              <>
                <div
                  className="relative w-full overflow-hidden bg-[#0a0810]"
                  style={{ aspectRatio: '16 / 11' }}
                >
                  <img
                    src={f.img}
                    alt={f.title}
                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.06]"
                    style={{
                      objectFit: 'cover',
                      objectPosition: f.pos,
                    }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(7,6,10,0.7), transparent 50%)',
                    }}
                  />
                  {f.to && (
                    <span className="absolute top-3 right-3 font-ui text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-black/45 border border-[var(--gold)]/30 text-[var(--gold)]">
                      More info
                    </span>
                  )}
                </div>

                <div className="px-5 py-5 border-t border-[var(--gold)]/10">
                  <h2 className="font-display text-xl md:text-2xl text-white tracking-wide uppercase">
                    {f.title}
                  </h2>
                  <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                    {f.text}
                  </p>
                  {f.hook && (
                    <p className="font-body text-xs text-[var(--gold)]/85 mt-2 italic leading-relaxed">
                      {f.hook}
                    </p>
                  )}
                  {f.to && (
                    <p className="font-ui text-[10px] tracking-[0.18em] uppercase text-[var(--gold)] mt-3 group-hover:text-[var(--magma-glow)] transition-colors">
                      Open this layer →
                    </p>
                  )}
                </div>
              </>
            )

            if (f.to) {
              return (
                <Link
                  key={f.title}
                  to={f.to}
                  className="dd-card group no-underline text-inherit"
                  data-reveal-item
                >
                  {inner}
                </Link>
              )
            }

            return (
              <article key={f.title} className="dd-card group" data-reveal-item>
                {inner}
              </article>
            )
          })}
        </div>

        <div className="mt-14 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/play" className="btn-primary no-underline">
            Claim rewards
          </Link>
          <Link to="/download" className="btn-secondary no-underline">
            Download the game
          </Link>
        </div>
      </div>
    </div>
  )
}
