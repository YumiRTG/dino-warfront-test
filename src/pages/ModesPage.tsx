import { Link } from 'react-router'
import { usePageMotion } from '@/hooks/useMotion'
import { MODES } from '@/config/modes'

const COMPARE = [
  {
    mode: 'Primeval Defense',
    against: 'Wild waves',
    session: '6–12 min',
    pace: 'Real time',
    stake: 'Stars & defense marks',
  },
  {
    mode: 'The Arena',
    against: 'Other players',
    session: '1–3 min',
    pace: 'Asynchronous',
    stake: 'Season rating',
  },
  {
    mode: 'The World Map',
    against: 'Everyone',
    session: 'Hours to days',
    pace: 'Persistent',
    stake: 'Resources, troops, ground',
  },
  {
    mode: 'The Campaign',
    against: 'The world itself',
    session: '2–5 min',
    pace: 'Turn based',
    stake: 'Progress & stars',
  },
]

export default function ModesPage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="page-shell mode-page">
      <div className="container-dd">
        <div className="max-w-3xl mb-12 md:mb-16" data-reveal="up">
          <div className="sec-ornament mb-4 max-w-[240px]">
            <span>Four ways to play</span>
          </div>
          <h1 className="display-lg text-white">
            Four modes.
            <br />
            <span className="text-gradient-magma">One army.</span>
          </h1>
          <p className="body-lg mt-6">
            A defense run, an arena match, a march across the shared world and a campaign
            stage all draw on the same heroes, the same troops and the same research. Each
            one wants something different from them, which is why a roster that carries you
            through the campaign can still fall apart on the ladder. Whatever you build in
            the city gets spent in these four places.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5" data-reveal-stagger>
          {MODES.map((m, i) => (
            <Link
              key={m.key}
              to={m.to}
              className="mode-tile no-underline text-inherit"
              data-reveal-item
              style={{
                ['--tile-accent' as string]: m.accent,
                ['--tile-soft' as string]: m.accentSoft,
              }}
            >
              <img src={m.img} alt="" className="mode-tile__img" style={{ objectPosition: m.pos }} loading="lazy" />
              <div className="mode-tile__scrim" />
              <div className="mode-tile__body">
                <span className="mode-tile__index">{String(i + 1).padStart(2, '0')}</span>
                <p className="mode-tile__tag">{m.kicker.split('·')[1]?.trim() ?? m.kicker}</p>
                <h2 className="font-display text-3xl text-white uppercase tracking-wide mt-2">
                  {m.name}
                </h2>
                <p className="font-body text-sm text-[var(--bone-dim)] mt-3 leading-relaxed max-w-md">
                  {m.tagline}. {m.blurb.split('.')[0]}.
                </p>
                <div className="mode-tile__chips">
                  {m.specs.map((s) => (
                    <span key={s.label} className="mode-tile__chip">
                      {s.label} · {s.value}
                    </span>
                  ))}
                </div>
                <p
                  className="font-ui text-[10px] tracking-[0.2em] uppercase mt-4"
                  style={{ color: m.accent }}
                >
                  Open the mode →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-20" data-reveal="up">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-2xl text-white tracking-wide">AT A GLANCE</h2>
            <div className="hud-line flex-1 opacity-50" />
          </div>

          <div className="dd-panel overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {['Mode', 'You fight', 'A session', 'Pace', 'What is on the line'].map((h) => (
                    <th
                      key={h}
                      className="font-ui text-[10px] tracking-[0.24em] uppercase text-[var(--gold)] px-5 py-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr
                    key={row.mode}
                    className="border-b border-white/5 last:border-0"
                    style={{ background: i % 2 ? 'rgba(255,255,255,0.015)' : undefined }}
                  >
                    <td className="font-display text-base text-white uppercase tracking-wide px-5 py-4 whitespace-nowrap">
                      {row.mode}
                    </td>
                    <td className="font-body text-sm text-[var(--bone-dim)] px-5 py-4">{row.against}</td>
                    <td className="font-body text-sm text-[var(--bone-dim)] px-5 py-4 whitespace-nowrap">{row.session}</td>
                    <td className="font-body text-sm text-[var(--bone-dim)] px-5 py-4 whitespace-nowrap">{row.pace}</td>
                    <td className="font-body text-sm text-[var(--bone-dim)] px-5 py-4">{row.stake}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3" data-reveal="up">
          <Link to="/download" className="btn-primary no-underline">
            Download the beta
          </Link>
          <Link to="/features" className="btn-secondary no-underline">
            The systems behind them
          </Link>
        </div>
      </div>
    </div>
  )
}
