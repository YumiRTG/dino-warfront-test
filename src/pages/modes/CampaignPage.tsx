import { usePageMotion } from '@/hooks/useMotion'
import { CAMPAIGN_DIFFICULTIES, CAMPAIGN_LOOP, CAMPAIGN_REGIONS, MODE_BY_KEY } from '@/config/modes'
import {
  FactGrid,
  LoopSteps,
  ModeFooterCta,
  ModeHero,
  ModeSwitcher,
  SectionHead,
  SpecRail,
} from '@/components/ModeKit'
import { CampaignPathDiagram } from '@/components/ModeDiagrams'

const mode = MODE_BY_KEY.campaign

const SYSTEMS = [
  {
    title: 'Stars, per difficulty',
    text: 'Three stars a stage, tracked separately on each of the four difficulties. Finish the campaign on Normal and the whole map is still sitting there on Hard. Same 78 stages, very different fights.',
  },
  {
    title: 'Sweep',
    text: 'Once a stage is cleared you can sweep it instead of playing it again. As soon as a stage stops being a challenge it stops eating your evening.',
  },
  {
    title: 'Idle income',
    text: 'Your furthest cleared stage keeps paying out while the app is shut. Progress is not just a tick on a map, it raises the floor under everything else you do.',
  },
  {
    title: 'Stamina',
    text: 'Stamina limits how many attempts you get, not the map. It refills over time, which turns the campaign into something you dip into daily.',
  },
  {
    title: 'Boss stages',
    text: 'Every region ends on a boss with its own kit. They are the checkpoints. If a boss stops you, the fix is usually back in the city rather than on the retry button.',
  },
  {
    title: 'Feeds everything',
    text: 'Hero shards, gear and upgrade materials all come out of campaign loot. The arena ladder and the world map both run on what you pull out of here.',
  },
]

export default function CampaignPage() {
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
            ornament="How it plays"
            title="Stage, squad,"
            accentWord="stars"
            text="Turn-based hero combat along a fixed path of regions. This is the mode that teaches you the rest of the game: what roles actually do, what your heroes can survive, and where your roster runs out."
          />
          <LoopSteps steps={CAMPAIGN_LOOP} />
        </section>

        <section className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-8 items-center">
          <div data-reveal="left">
            <CampaignPathDiagram />
          </div>
          <div data-reveal="right">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>The path</span>
            </div>
            <h2 className="display-md text-white">
              Nine regions,
              <br />
              <span className="text-mode-accent">seventy-eight stages</span>
            </h2>
            <p className="body-lg mt-5">
              The regions get longer as you go: six stages in the opening steppe, twelve on
              the final coast. Each one ends on a boss and each one wants something else
              from your squad. Raw damage walks through the steppe and dies in the swamp.
            </p>
            <p className="body-lg mt-4">
              The same map runs on four difficulties. Normal expects the roster you should
              have when you get there. Hard expects finished heroes with upgraded gear.
              Extreme is about as far as a complete account can push with good skill timing.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead
            ornament="The world"
            title="Every region"
            accentWord="asks differently"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-reveal-stagger>
            {CAMPAIGN_REGIONS.map((r, i) => (
              <article key={r.name} className="unit-card" data-reveal-item>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                  <img
                    src={r.img}
                    alt={r.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 38%' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(7,6,10,0.95) 8%, transparent 65%)',
                    }}
                  />
                  <span className="unit-card__role">Region {String(i + 1).padStart(2, '0')}</span>
                  <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between gap-3">
                    <h3 className="font-display text-xl text-white uppercase tracking-wide leading-none">
                      {r.name}
                    </h3>
                    <span className="font-ui text-[10px] tracking-[0.16em] uppercase text-mode-accent whitespace-nowrap">
                      {r.stages} stages
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed">{r.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead
            ornament="Difficulty"
            title="The same map,"
            accentWord="four times"
            text="Difficulty only scales the enemy values. The stages, the models and the layouts stay exactly as you learned them. What shrinks is how much room a mistake leaves you."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" data-reveal-stagger>
            {CAMPAIGN_DIFFICULTIES.map((d, i) => (
              <div key={d.name} className="fact-card" data-reveal-item>
                <p className="font-ui text-[10px] tracking-[0.22em] uppercase text-mode-accent">
                  Grade {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-display text-xl text-white uppercase tracking-wide mt-1">{d.name}</p>
                <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <SectionHead ornament="Systems" title="What the campaign" accentWord="feeds" />
          <FactGrid items={SYSTEMS} />
        </section>

        <ModeFooterCta mode={mode} line="Take the first region" />
      </div>
    </div>
  )
}
