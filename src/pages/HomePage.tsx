import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import { usePageMotion } from '@/hooks/useMotion'
import TopCommanders from '@/sections/TopCommanders'
import WarRoom from '@/sections/WarRoom'
import { HomeCinematicSequence, HomeExperienceFx, HomeIntro } from '@/components/HomeExperience'
import HomeModesNetworkPortal from '@/components/HomeModesNetworkPortal'
import HomeDinoRoster from '@/components/HomeDinoRoster'
import HomeSoundToggle from '@/components/HomeSoundToggle'
import './HomePage.css'
import './HomeExperienceUpgrade.css'

export default function HomePage() {
  const motionRef = usePageMotion()

  return (
    <div ref={motionRef} className="relative home-exp-home">
      <HomeExperienceFx />
      <HomeIntro replayToken={0} />
      <HomeSoundToggle />

      <section className="relative min-h-[100svh] overflow-hidden home-exp-hero">
        <img
          data-hero-bg
          src={asset('hero-poster.png')}
          alt="Dino Warfront landscape with apex T-rex"
          className="absolute inset-0 w-full h-full object-cover will-change-transform hero-video-live"
          style={{ objectPosition: 'center center' }}
          draggable={false}
        />
        <div className="home-exp-hero-grid" aria-hidden />
        <div className="home-exp-hero-sweep" aria-hidden />
        <div className="home-exp-hero-pulse" aria-hidden />

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(5,4,10,0.76) 0%, rgba(5,4,10,0.34) 28%, transparent 50%),
              linear-gradient(to top, rgba(5,4,10,0.91) 0%, transparent 36%)
            `,
          }}
        />

        <div className="absolute z-10 left-0 right-0 top-[17%] sm:top-[16%] md:top-[15%] container-dd flex flex-col items-center text-center">
          <p data-hero data-hero-delay="0.05" className="eyebrow mb-2 sm:mb-3 justify-center">
            Friend beta · Persistent prehistoric strategy
          </p>

          <h1
            data-hero
            data-hero-delay="0.12"
            className="display-xl text-white title-glow home-exp-title drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)] !text-[clamp(2.75rem,9vw,6.5rem)]"
          >
            DINO<br /><span className="text-gradient-magma">WARFRONT</span>
          </h1>

          <p data-hero data-hero-delay="0.24" className="body-lg mt-4 max-w-xl !text-white/65">
            Build the empire. Raise the beasts. Fight where every system feeds the same war.
          </p>

          <div data-hero data-hero-delay="0.35" className="flex flex-wrap gap-3 mt-5 justify-center">
            <Link to="/download" className="btn-primary no-underline !text-[0.9rem] !px-8 !py-4">Play free</Link>
            <Link to="/modes" className="btn-secondary no-underline">Game modes</Link>
            <Link to="/bestiary" className="btn-secondary no-underline">Meet the pack</Link>
          </div>
        </div>

        <div className="home-hero-status" data-hero data-hero-delay="0.48" aria-label="Game highlights">
          <div><strong>06 SYSTEMS</strong><span>One progression loop</span></div>
          <div><strong>78 STAGES</strong><span>Live RPG campaign</span></div>
          <div><strong>WORLD MAP</strong><span>Persistent conflict</span></div>
          <div><strong>FRIEND BETA</strong><span>Development build</span></div>
        </div>

        <div data-hero data-hero-delay="0.6" className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-ui text-[9px] tracking-[0.35em] uppercase text-white/35">Scroll</span>
          <span className="scroll-cue-line" />
        </div>
      </section>

      <WarRoom />
      <HomeCinematicSequence />
      <HomeModesNetworkPortal />
      <HomeDinoRoster />
      <TopCommanders />

      <section className="section-band relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          data-parallax="0.08"
          style={{
            backgroundImage: `url(${asset('banner-bg.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.45) saturate(1.1)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(5,4,10,0.95) 0%, rgba(5,4,10,0.7) 50%, rgba(5,4,10,0.92) 100%)' }} />

        <div className="container-dd relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div data-reveal="left">
            <div className="sec-ornament mb-4 max-w-[200px]"><span>Rewards</span></div>
            <h2 className="display-lg text-white mt-2">Daily login<br /><span className="text-gradient-gold">& roulette</span></h2>
            <p className="body-lg mt-5 max-w-md">Streaks and spins create a reason to check the warfront every day, with rewards that sync back into the game.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/play" className="btn-primary no-underline">Claim the edge</Link>
              <Link to="/play?login=1" className="btn-secondary no-underline">Log in</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" data-reveal-stagger>
            {[
              { t: 'Daily streak', d: 'Better speed-ups the longer you claim' },
              { t: 'Free spin', d: '1 roulette spin every 24 hours' },
              { t: 'Account ID', d: 'No password — ID from game Settings' },
              { t: 'In-game sync', d: 'Open the app to collect rewards' },
            ].map((x) => (
              <div key={x.t} className="dd-panel p-5" data-reveal-item>
                <p className="font-display text-lg text-[var(--gold)] uppercase tracking-wide">{x.t}</p>
                <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-dd">
          <div className="dd-panel p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center relative overflow-hidden" data-reveal="up">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(123,92,255,0.4), transparent 70%)' }} />
            <div className="relative">
              <div className="sec-ornament mb-4 max-w-[200px]"><span>Studio</span></div>
              <h2 className="display-md text-white mt-2">Progress<span className="text-gradient-magma"> log</span></h2>
              <p className="body-lg mt-4">Screenshots, shipped systems and roadmap pieces land here first. Follow what is moving from prototype into the warfront.</p>
              <Link to="/progress" className="btn-primary no-underline mt-8 inline-flex">See what is next</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 relative">
              {[
                { t: 'Screenshots', d: 'Real Unity printscreens' },
                { t: 'Shipped', d: 'What friends can use now' },
                { t: 'In progress', d: 'Active development work' },
                { t: 'Roadmap', d: 'New systems & content' },
              ].map((x) => (
                <div key={x.t} className="stat-chip">
                  <p className="font-display text-lg text-[var(--gold)] uppercase">{x.t}</p>
                  <p className="font-body text-xs text-[var(--bone-dim)] mt-1">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band pb-28">
        <div className="container-dd">
          <div
            data-reveal="scale"
            className="relative overflow-hidden home-exp-final-cta rounded-sm border border-[var(--gold)]/25 px-6 py-14 md:px-16 md:py-20"
            style={{
              background: 'linear-gradient(125deg, rgba(255,77,26,0.16) 0%, rgba(18,12,32,0.92) 35%, rgba(8,6,16,0.96) 100%)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 100px rgba(255,77,26,0.12), 0 0 80px rgba(123,92,255,0.1)',
            }}
          >
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full opacity-50 blur-3xl pointer-events-none animate-pulse-glow" style={{ background: 'radial-gradient(circle, rgba(255,77,26,0.55), rgba(123,92,255,0.25), transparent 70%)' }} />
            <div className="relative z-10 home-final-cta-grid">
              <div>
                <div className="sec-ornament mb-4 max-w-[240px]"><span>Enter the wild</span></div>
                <h2 className="display-lg text-white mt-2">Download &<br /><span className="text-gradient-magma">command</span></h2>
                <p className="body-lg mt-5">The website is the command briefing. The game is the territory — base, battles, dinos, campaign and the shared world.</p>
                <div className="flex flex-wrap gap-3 mt-10">
                  <Link to="/download" className="btn-primary no-underline !text-[0.9rem] !px-8 !py-4">Download APK</Link>
                  <Link to="/features" className="btn-secondary no-underline">Still exploring?</Link>
                </div>
                <p className="font-ui text-[9px] tracking-[0.18em] uppercase text-white/35 mt-5">Android · Friend beta · ~2.6 GB · Wi-Fi recommended</p>
              </div>

              <div className="home-device" aria-label="Dino Warfront mobile game preview">
                <img src={asset('ui-hero-screen.png')} alt="Dino Warfront interface on a mobile device" loading="lazy" />
                <div className="home-device__status"><span>● BUILD ONLINE</span><br />ANDROID FRIEND BETA</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
