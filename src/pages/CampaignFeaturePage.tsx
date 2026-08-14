import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Open the map',
    text: 'The campaign is a stage path on the world map. Clear one stage to unlock the next.',
  },
  {
    step: '02',
    title: 'Pick your squad',
    text: 'Bring heroes, dinosaurs and troops. Match roles to the stage — tanks for hard hits, strikers for speed.',
  },
  {
    step: '03',
    title: 'Fight the stage',
    text: 'Battle enemy tribes and wild threats. Win to earn loot and progress further on the map.',
  },
  {
    step: '04',
    title: 'Heal & upgrade',
    text: 'Use the hospital, train more troops and level heroes/dinos. Come back stronger for harder stages.',
  },
  {
    step: '05',
    title: 'Claim rewards',
    text: 'Stages drop resources and progress rewards. Keep pushing to grow power and unlock new realms.',
  },
]

const REALMS = [
  {
    name: 'Jungle',
    img: asset('campaign-1.png'),
    text: 'Dense forests and ambushes. Early path — learn combat and grow your first squad.',
  },
  {
    name: 'Ice',
    img: asset('campaign-ice.png'),
    text: 'Harsh cold frontiers. Tougher stages that punish weak armies and thin supply.',
  },
  {
    name: 'Volcano',
    img: asset('campaign-volcano.png'),
    text: 'Fire and danger. High-pressure fights for stronger loot and late power.',
  },
  {
    name: 'Water',
    img: asset('campaign-water.png'),
    text: 'Coastal and flooded grounds. New threats and map variety as the campaign deepens.',
  },
]

const MECHANICS = [
  {
    title: 'Stage path',
    text: 'Stages are linked. You progress forward by winning. Harder stages need better troops, dinos and heroes.',
  },
  {
    title: 'Army composition',
    text: 'Mix Infantry, Riders and Shooters with dinos and a hero. Balance damage, tanking and skills.',
  },
  {
    title: 'Power & prep',
    text: 'Base buildings, research and training raise your battle power before you re-enter the map.',
  },
  {
    title: 'Losses & recovery',
    text: 'Troops can get wounded. Heal them in the hospital so your next push is not gutted.',
  },
  {
    title: 'Loot & growth',
    text: 'Wins feed resources into the base. That loop — fight → loot → build → fight — is the campaign core.',
  },
  {
    title: 'Story push',
    text: 'Campaign advances the prehistoric story under Nyra Vale. Each realm is a new chapter of conquest.',
  },
]

export default function CampaignFeaturePage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell">
      <div className="container-dd">
        <div className="dd-card overflow-hidden mb-12" data-reveal="scale">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '16 / 10', minHeight: 240 }}
          >
            <img
              src={asset('feature-campaign-hero.jpg')}
              alt="Conquer campaigns"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 35%' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(7,6,10,0.95) 0%, rgba(7,6,10,0.4) 50%, rgba(7,6,10,0.25) 100%)',
              }}
            />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
              <p className="eyebrow">Feature · Campaign</p>
              <h1 className="display-lg text-white mt-3">
                Conquer
                <br />
                <span className="text-gradient-magma">campaigns</span>
              </h1>
              <p className="body-lg mt-4 max-w-xl">
                Push stage by stage across jungle, ice, volcano and water — win battles, claim loot, advance the map.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mb-12" data-reveal="up">
          <p className="eyebrow">How it works · not the full map</p>
          <h2 className="display-md text-white mt-3">
            Simple loop,
            <br />
            <span className="text-gradient-gold">deeper map</span>
          </h2>
          <p className="body-lg mt-4">
            Campaign is the main PvE path: stage → fight → loot → upgrade → push.
            Realms change the pressure. Exact stage lists, bosses and late surprises
            stay in the build — this page is the hook, not the spoiler dump.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-14" data-reveal-stagger>
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="dd-panel p-5" data-reveal-item>
              <p className="font-display text-2xl text-gradient-magma">{s.step}</p>
              <h3 className="font-display text-lg text-white uppercase tracking-wide mt-2">
                {s.title}
              </h3>
              <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">REALMS</h2>
          <div className="hud-line flex-1 opacity-50" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14" data-reveal-stagger>
          {REALMS.map((r) => (
            <article key={r.name} className="dd-card group" data-reveal-item>
              <div className="relative h-40 overflow-hidden bg-[#0a0810]">
                <img
                  src={r.img}
                  alt={r.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: 'center 35%' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(7,6,10,0.92), transparent 55%)',
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="font-display text-xl text-white uppercase tracking-wide">
                    {r.name}
                  </h3>
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">{r.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6" data-reveal="up">
          <h2 className="font-display text-2xl text-white tracking-wide">MECHANICS</h2>
          <div className="hud-line flex-1 opacity-50" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14" data-reveal-stagger>
          {MECHANICS.map((m) => (
            <div key={m.title} className="stat-chip" data-reveal-item>
              <p className="font-display text-lg text-[var(--gold)] uppercase tracking-wide">
                {m.title}
              </p>
              <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
                {m.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Download & conquer
          </Link>
          <Link to="/features/dinos" className="btn-secondary no-underline">
            Dinos
          </Link>
          <Link to="/features" className="btn-secondary no-underline">
            All features
          </Link>
        </div>
      </div>
    </div>
  )
}
