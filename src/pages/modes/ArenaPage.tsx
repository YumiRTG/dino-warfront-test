import { usePageMotion } from '@/hooks/useMotion'
import { ARENA_MODES, ARENA_SEASON, MODE_BY_KEY } from '@/config/modes'
import {
  FactGrid,
  LoopSteps,
  ModeFooterCta,
  ModeHero,
  ModeSwitcher,
  SectionHead,
  SpecRail,
} from '@/components/ModeKit'
import { ArenaBracketDiagram } from '@/components/ModeDiagrams'
import ArenaLadder from '@/sections/ArenaLadder'

const mode = MODE_BY_KEY.arena

const LOOP = [
  {
    step: '01',
    title: 'Set your defense',
    text: 'Three heroes in the Tactical Arena, or nine across three teams in the Team Arena. The game stores that line-up and other players fight it while you are away. It is the only thing between your rating and everyone else.',
  },
  {
    step: '02',
    title: 'Read the board',
    text: 'You get shown opponents near your own rating, real players and bots, and you can see what they are defending with before you spend an attempt.',
  },
  {
    step: '03',
    title: 'Attack',
    text: 'Your squad against their stored defense, played out live. In the Team Arena that means up to three separate rounds, each one starting at full health.',
  },
  {
    step: '04',
    title: 'Take the points',
    text: 'When you win, the points come out of the defender and land on you. Same number both ways. When you lose, it costs you the attempt and nothing else.',
  },
  {
    step: '05',
    title: 'Collect the season',
    text: 'There is a daily reward based on where you sit, plus a placement reward when the season turns over. Then everybody starts again at 1000.',
  },
]

export default function ArenaPage() {
  const motionRef = usePageMotion()

  return (
    <div
      ref={motionRef}
      className="mode-page mode-detail"
      style={{
        ['--mode-accent' as string]: mode.accent,
        ['--mode-accent-soft' as string]: mode.accentSoft,
      }}
    >
      <ModeSwitcher active={mode.key} />

      <ModeHero mode={mode}>
        <SpecRail specs={mode.specs} />
      </ModeHero>

      <div className="container-dd pb-24">
        <section className="mt-14 md:mt-20">
          <SectionHead
            ornament="Two ladders"
            title="Same heroes."
            accentWord="Different question."
            text="The Tactical Arena wants to know who your best three are. The Team Arena wants to know how deep your bench goes. Nine heroes, no repeats, and giving up one team on purpose is a perfectly good plan."
          />

          <div className="grid lg:grid-cols-2 gap-4 md:gap-5" data-reveal-stagger>
            {ARENA_MODES.map((m, i) => (
              <article key={m.id} className="unit-card" data-reveal-item>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                  <img
                    src={m.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(7,6,10,0.97) 6%, rgba(7,6,10,0.45) 55%, transparent 100%)',
                    }}
                  />
                  <span className="unit-card__role">Ladder {String(i + 1).padStart(2, '0')}</span>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide">
                      {m.name}
                    </h3>
                    <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-mode-accent mt-1">
                      {m.format}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">{m.text}</p>

                  <ul className="mt-5 space-y-2.5 flex-1">
                    {m.points.map((p) => (
                      <li key={p} className="flex gap-3 items-start">
                        <span
                          className="mt-[0.45rem] w-1.5 h-1.5 rotate-45 shrink-0"
                          style={{ background: mode.accent }}
                        />
                        <span className="font-body text-sm text-[var(--bone)]/80 leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/8">
                    <div>
                      <dt className="font-ui text-[9px] tracking-[0.24em] uppercase text-mode-accent">Unlock</dt>
                      <dd className="font-body text-xs text-[var(--bone-dim)] mt-1.5 leading-relaxed">{m.unlock}</dd>
                    </div>
                    <div>
                      <dt className="font-ui text-[9px] tracking-[0.24em] uppercase text-mode-accent">Attempts</dt>
                      <dd className="font-body text-xs text-[var(--bone-dim)] mt-1.5 leading-relaxed">{m.tickets}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-8 items-center">
          <div data-reveal="left">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>Best of three</span>
            </div>
            <h2 className="display-md text-white">
              Nine heroes,
              <br />
              <span className="text-mode-accent">three fights</span>
            </h2>
            <p className="body-lg mt-5">
              A Team Arena match is three separate battles. Your first team meets theirs,
              then the second, then the third. Every round starts at full health no matter
              how the last one went.
            </p>
            <p className="body-lg mt-4">
              Two wins take the match, so at 2:0 the third round never happens. That one
              rule is what makes depth matter. Stack your best three into team one and you
              win a round, then lose the other two.
            </p>
          </div>
          <div data-reveal="right">
            <ArenaBracketDiagram />
          </div>
        </section>

        <ArenaLadder />

        <section className="mt-16 md:mt-20">
          <SectionHead ornament="A match" title="From line-up" accentWord="to rating" />
          <LoopSteps steps={LOOP} />
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead
            ornament="Season structure"
            title="Rating is"
            accentWord="borrowed, not owned"
            text="No rating gets invented out of thin air. Every point you gain came off somebody else, and every Monday the whole board hands it back."
          />
          <FactGrid items={ARENA_SEASON} cols={2} />
        </section>

        <ModeFooterCta mode={mode} line="Climb both ladders" />
      </div>
    </div>
  )
}
