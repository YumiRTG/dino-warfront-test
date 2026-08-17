import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '@/lib/assets'
import './HomeModesNetworkPortal.css'
import './HomeModesNetworkPortalFix.css'

const FEATURES = [
  {
    key: 'defense', slot: 'defense', label: 'TOWER DEFENSE', title: 'DAILY SKILL TEST', stat: 'RANKED DAILY',
    text: 'A fresh defense challenge every day. Everyone faces the same battlefield and rules — placement, timing and adaptation decide how high you climb.',
    hook: 'Build smarter. React faster. Take the ranking.', img: asset('promo/tower-defense-promo.jpg'), pos: 'center center', accent: '#e7b84b',
    to: '/modes/tower-defense', chips: ['Daily challenge', 'Skill ranking', 'Primitive defenses'], signal: 'NEW MAP DAILY',
  },
  {
    key: 'campaign', slot: 'campaign', label: 'CAMPAIGN', title: 'LIVE RPG FIGHTS', stat: '78 STAGES',
    text: 'Push through the prehistoric campaign in real-time RPG battles. Build the right squad, trigger skills at the right moment and adapt while the fight is still happening.',
    hook: 'The campaign is fought — not simulated.', img: asset('hero-dino-volcano.jpg'), pos: 'center center', accent: '#f0c14d',
    to: '/modes/campaign', chips: ['Real-time combat', 'Hero + dino squads', 'Boss regions'], signal: '78 STAGES ONLINE',
  },
  {
    key: 'world', slot: 'world', label: 'WORLD MAP', title: 'FIGHT YOUR WAY', stat: 'WORLD ACTIVE',
    text: 'Hunt alone, move with friends or rally your entire alliance. Raid rivals, reinforce allies and turn a shared persistent map into your territory.',
    hook: 'Solo when you want. Together when it matters.', img: asset('modes/mode-world.jpg'), pos: 'center 45%', accent: '#38e8ff',
    to: '/modes/world-map', chips: ['Solo attacks', 'Alliance rallies', 'Shared world'], signal: 'PERSISTENT WORLD',
  },
  {
    key: 'arena', slot: 'arena', label: 'ARENA', title: 'BUILD THE COUNTER', stat: 'WEEKLY PVP',
    text: 'Take your strongest formations into competitive ladders. Read the enemy lineup, build the counter and prove your squad can beat another player — not just scripted AI.',
    hook: 'Every defense creates a new counter to solve.', img: asset('modes/mode-arena.jpg'), pos: 'center center', accent: '#ff4d1a',
    to: '/modes/arena', chips: ['Weekly ladders', 'Counter squads', 'Team Arena'], signal: 'SEASON LADDER',
  },
  {
    key: 'partner', slot: 'partner', label: 'PARTNER SYSTEM', title: 'RAISE YOUR DINOSAUR', stat: 'BABY → APEX',
    text: 'Choose your partner as a baby and raise it beside your empire. Feed it, pet it, strengthen the bond, watch it grow and bring it with you on marches as a true companion.',
    hook: 'You do not unlock a pet. You raise a partner.', img: asset('promo/partner-system-promo.jpg'), pos: 'center center', accent: '#b86cff',
    to: '/features/partner-system', chips: ['Hatch & bond', 'Grow together', 'March companion'], signal: 'BOND SYSTEM',
  },
  {
    key: 'worldboss', slot: 'worldboss', label: 'WORLD BOSS', title: 'RALLY THE HUNT', stat: 'ALLIANCE EVENT',
    text: 'A colossal predator has entered the world map. Join the hunt at any point during the event, stack damage with your alliance and push for the highest reward tiers.',
    hook: 'One target. Every march. Rally the hunt.', img: asset('promo/worldboss-promo.jpg'), pos: 'center center', accent: '#ff8a38',
    to: '/features/world-boss', chips: ['Alliance hunt', 'Timed world event', 'Tiered rewards'], signal: '3× WEEKLY',
  },
] as const

const CONNECTIONS = [
  [430, 305, 175, 105], [570, 305, 825, 105], [405, 360, 155, 355],
  [595, 360, 845, 355], [430, 415, 190, 615], [570, 415, 810, 615],
] as const

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function HomeModesNetworkPortal() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState(0)
  const [overview, setOverview] = useState(false)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused || overview || prefersReducedMotion()) return
    const timer = window.setInterval(() => setActive((value) => (value + 1) % FEATURES.length), 3600)
    return () => window.clearInterval(timer)
  }, [inView, paused, overview])

  const feature = FEATURES[active]
  const partnerActive = feature.key === 'partner'

  return (
    <section
      ref={sectionRef}
      className="home-command-showcase home-modes-showcase home-exp-chapter"
      aria-label="Dino Warfront core gameplay features"
      style={{ ['--command-accent' as string]: overview ? '#f0c14d' : feature.accent }}
    >
      <div className={`home-command-showcase__backdrop${partnerActive && !overview ? ' partner-artwork-safe' : ''}`} aria-hidden>
        <img
          key={overview ? 'overview' : feature.key}
          src={overview ? asset('banner-bg.png') : feature.img}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ objectPosition: overview ? 'center center' : feature.pos }}
        />
        <div className="home-command-showcase__fog" />
        <div className="home-command-showcase__horizon" />
      </div>

      <div
        className="container-dd relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <header className="home-command-showcase__header home-feature-header" data-reveal="up">
          <p>WARFRONT SYSTEMS // 06 EXPERIENCES ONLINE</p>
          <h2>Six ways to fight.<span> One empire to rule.</span></h2>
          <small>Every mode rewards progress. Every victory strengthens your empire.</small>
        </header>

        <div className="home-command-board home-feature-command-board" data-reveal="scale">
          <svg className="home-command-lines" viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden>
            {CONNECTIONS.map(([x1, y1, x2, y2], index) => (
              <g key={index}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  data-active={!overview && active === index ? 'true' : undefined}
                  style={{ stroke: FEATURES[index].accent }}
                />
                {!overview && active === index && !prefersReducedMotion() && (
                  <circle r="4" fill={FEATURES[index].accent} className="home-command-data-dot">
                    <animate attributeName="cx" values={`${x1};${x2}`} dur="1.7s" repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${y1};${y2}`} dur="1.7s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            ))}
          </svg>

          <button
            type="button"
            className="home-command-core home-feature-core home-feature-core--button"
            aria-label="Show overview of all six systems"
            data-overview={overview ? 'true' : undefined}
            onClick={() => setOverview((value) => !value)}
          >
            <span className="home-command-core__ring home-command-core__ring--outer" />
            <span className="home-command-core__ring home-command-core__ring--inner" />
            <span className="home-command-core__scanner" />
            <span className="home-feature-core__ping home-feature-core__ping--one" />
            <span className="home-feature-core__ping home-feature-core__ping--two" />
            <span className="home-command-core__content" key={overview ? 'overview' : active}>
              <small>{overview ? 'ALL / 06' : `${String(active + 1).padStart(2, '0')} / 06`}</small>
              <strong>{overview ? 'SYSTEMS' : 'WARFRONT'}</strong>
              <em>{overview ? 'OVERVIEW' : feature.stat}</em>
            </span>
          </button>

          {FEATURES.map((item, index) => (
            <Link
              key={item.key}
              to={item.to}
              className={`home-command-node home-feature-node home-feature-node--${item.slot}${item.key === 'partner' ? ' partner-artwork-safe' : ''}`}
              data-active={!overview && active === index ? 'true' : undefined}
              aria-label={`${item.label}: ${item.title}`}
              style={{ ['--node-accent' as string]: item.accent }}
              onMouseEnter={() => { setPaused(true); setOverview(false); setActive(index) }}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => { setPaused(true); setOverview(false); setActive(index) }}
              onBlur={() => setPaused(false)}
            >
              <img src={item.img} alt="" style={{ objectPosition: item.pos }} loading="lazy" decoding="async" />
              <div className="home-command-node__shade" />
              <div className="home-command-node__signal" aria-hidden><i /><i /><i /></div>
              <span className="home-feature-node__index">{String(index + 1).padStart(2, '0')}</span>
              <div className="home-command-node__copy">
                <span>{item.label}</span><strong>{item.title}</strong><small>{item.signal}</small>
              </div>
              <b className="home-command-node__open">OPEN ↗</b>
            </Link>
          ))}
        </div>

        <div className="home-feature-mobile-rail" aria-label="Warfront systems">
          {FEATURES.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className="home-feature-mobile-card"
              data-active={!overview && active === index ? 'true' : undefined}
              style={{ ['--node-accent' as string]: item.accent }}
              onClick={() => { setOverview(false); setActive(index) }}
            >
              <img src={item.img} alt="" style={{ objectPosition: item.pos }} loading="lazy" />
              <span>{String(index + 1).padStart(2, '0')} · {item.label}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>

        {overview ? (
          <div className="home-feature-overview" data-reveal="up">
            <div className="home-feature-overview__copy">
              <p>COMMAND NETWORK // COMPLETE</p>
              <h3>EVERY SYSTEM FEEDS THE SAME EMPIRE</h3>
              <div>Daily skill, campaign progression, the persistent world, competitive PvP, your bonded dinosaur and alliance-scale hunts all push the same account forward.</div>
            </div>
            <div className="home-feature-overview__grid">
              {FEATURES.map((item, index) => (
                <button key={item.key} type="button" onClick={() => { setOverview(false); setActive(index) }} style={{ ['--overview-accent' as string]: item.accent }}>
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong><small>{item.signal}</small>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`home-feature-detail home-feature-detail--${feature.key}`} style={{ ['--detail-accent' as string]: feature.accent }}>
            <div className={`home-feature-detail__image${partnerActive ? ' partner-artwork-safe' : ''}`}>
              <img key={feature.key} src={feature.img} alt="" style={{ objectPosition: feature.pos }} />
              <span aria-hidden />
            </div>
            <div className="home-feature-detail__copy">
              <p>ACTIVE FEATURE // {feature.label}</p><h3>{feature.title}</h3><div>{feature.text}</div><strong>{feature.hook}</strong>
            </div>
            <div className="home-feature-detail__chips">
              {feature.chips.map((chip) => <span key={chip}>{chip}</span>)}
              <Link to={feature.to}>ENTER FEATURE ↗</Link>
            </div>
          </div>
        )}

        <div className="home-command-showcase__footer">
          <span className="home-command-showcase__pulse"><i /> 06 SYSTEMS LIVE</span>
          <strong>{overview ? 'COMMAND NETWORK' : feature.label}</strong>
          <span>Hover, swipe or use the radar core</span>
        </div>
      </div>
    </section>
  )
}
