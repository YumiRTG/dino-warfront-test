import { usePageMotion } from '@/hooks/useMotion'
import { MODE_BY_KEY, WM_MARCHES, WM_SYSTEMS, WM_ZONES } from '@/config/modes'
import {
  FactGrid,
  LoopSteps,
  ModeFooterCta,
  ModeHero,
  ModeSwitcher,
  SectionHead,
  SpecRail,
} from '@/components/ModeKit'
import { WorldZoneDiagram } from '@/components/ModeDiagrams'
import AllianceStandings from '@/sections/AllianceStandings'

const mode = MODE_BY_KEY['world-map']

const LOOP = [
  {
    step: '01',
    title: 'You are placed',
    text: 'The first time you open the map the game finds you a spot out in the safe ring. Your neighbours are real accounts, and the gaps between you are there on purpose. Travel costs you time.',
  },
  {
    step: '02',
    title: 'Send marches',
    text: 'Three ground marches at a time. Farm a node, hunt a monster, scout a rival, reinforce an ally under pressure, or plant an outpost on ground nobody holds.',
  },
  {
    step: '03',
    title: 'Take risks inward',
    text: 'Levels rise with every ring you cross toward the centre. So does what you find, and so does the number of people who can see you coming.',
  },
  {
    step: '04',
    title: 'Fight or shield',
    text: 'Attacks come down to defense power, garrisons and shields. Whatever happens lands in your mail as a full report, including what it cost the other side.',
  },
  {
    step: '05',
    title: 'Hold ground together',
    text: 'Alliance ground grows tile by tile out from a centre and gets paid for from the shared pool. Gathering inside it feeds the pool back. This is the one mode you are not going to solo.',
  },
]

export default function WorldMapPage() {
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
            ornament="How the map plays"
            title="Everything here"
            accentWord="belongs to somebody"
            text="This is the only mode that keeps going after you close the app. Marches land, gathers finish, and somewhere out there another player is deciding whether your base is worth the trip."
          />
          <LoopSteps steps={LOOP} />
        </section>

        <section className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-8 items-center">
          <div data-reveal="left">
            <WorldZoneDiagram />
          </div>
          <div data-reveal="right">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>Five rings</span>
            </div>
            <h2 className="display-md text-white">
              Safety is
              <br />
              <span className="text-mode-accent">a direction</span>
            </h2>
            <p className="body-lg mt-5">
              The world is eight thousand units across and the danger is laid out in rings.
              You start on the outside, where the monsters are small and the neighbours are
              quiet. Everything worth having is further in.
            </p>
            <ol className="mt-7 space-y-3">
              {WM_ZONES.map((z, i) => (
                <li key={z.zone} className="flex gap-4 items-start">
                  <span
                    className="font-display text-xs tracking-[0.15em] uppercase shrink-0 w-14 pt-0.5"
                    style={{ color: mode.accent, opacity: 0.45 + i * 0.13 }}
                  >
                    {z.zone}
                  </span>
                  <span>
                    <span className="font-display text-base text-white uppercase tracking-wide block">
                      {z.name}
                    </span>
                    <span className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">
                      {z.text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead
            ornament="Ten kinds of march"
            title="What you send"
            accentWord="is the decision"
            text="Ground marches take one of your three slots. Scout and rescue flights do not, which is why finding things out is cheap on this map and doing something about it never is."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-reveal-stagger>
            {WM_MARCHES.map((m) => (
              <div key={m.name} className="fact-card" data-reveal-item>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-lg text-white uppercase tracking-wide">{m.name}</p>
                  <span className="font-ui text-[9px] tracking-[0.18em] uppercase text-mode-accent whitespace-nowrap">
                    {m.cost}
                  </span>
                </div>
                <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead
            ornament="Systems"
            title="The numbers"
            accentWord="that decide it"
          />
          <FactGrid items={WM_SYSTEMS} />
        </section>

        <AllianceStandings />

        <ModeFooterCta mode={mode} line="Claim your ground" />
      </div>
    </div>
  )
}
