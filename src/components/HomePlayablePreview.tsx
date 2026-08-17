import { useMemo, useState } from 'react'
import { asset } from '@/lib/assets'
import './HomePlayablePreview.css'

type Stats = { attack: number; defense: number; control: number; speed: number }

const MAP_POINTS = [
  {
    key: 'base',
    label: 'YOUR BASE',
    type: 'COMMAND',
    detail: 'Your protected staging point. Reinforce marches, manage growth and prepare the next attack.',
    status: 'SAFE ZONE',
    x: '24%',
    y: '64%',
    accent: '#f0c14d',
  },
  {
    key: 'boss',
    label: 'WORLD BOSS',
    type: 'ALLIANCE HUNT',
    detail: 'A colossal predator is active. Join the alliance hunt and stack damage for higher reward tiers.',
    status: 'RALLY OPEN',
    x: '70%',
    y: '33%',
    accent: '#ff5a2d',
  },
  {
    key: 'fort',
    label: 'ALLIANCE FORT',
    type: 'TERRITORY',
    detail: 'A forward alliance position used to hold territory, reinforce allies and project pressure nearby.',
    status: 'CONTROLLED',
    x: '48%',
    y: '48%',
    accent: '#38e8ff',
  },
  {
    key: 'enemy',
    label: 'ENEMY BASE',
    type: 'PVP TARGET',
    detail: 'Scout the formation before committing. Counter the defender or wait for alliance support.',
    status: 'SCOUTED',
    x: '80%',
    y: '68%',
    accent: '#ff4d1a',
  },
  {
    key: 'resource',
    label: 'IRON DEPOSIT',
    type: 'RESOURCE',
    detail: 'Send a gathering march to secure iron while your main army remains available for combat.',
    status: 'AVAILABLE',
    x: '35%',
    y: '26%',
    accent: '#3dffb5',
  },
] as const

const HEROES = [
  { key: 'nyra', name: 'Nyra Vale', role: 'Apex Commander', img: asset('hero-nyra.png'), stats: { attack: 18, defense: 8, control: 11, speed: 8 } },
  { key: 'alyssa', name: 'Alyssa Mey', role: 'Field Tactician', img: asset('hero-alyssa.png'), stats: { attack: 10, defense: 9, control: 18, speed: 8 } },
  { key: 'ronan', name: 'Ronan', role: 'Frontline Leader', img: asset('hero-ronan.png'), stats: { attack: 13, defense: 17, control: 6, speed: 6 } },
] as const

const DINOS = [
  { key: 'trex', name: 'Tyrannosaurus', role: 'Breaker', img: asset('dino-tyranno.png'), stats: { attack: 19, defense: 8, control: 3, speed: 5 } },
  { key: 'raptor', name: 'Velociraptor', role: 'Hunter', img: asset('dino-raptor.png'), stats: { attack: 10, defense: 4, control: 6, speed: 19 } },
  { key: 'trike', name: 'Triceratops', role: 'Bulwark', img: asset('dino-triceratops.png'), stats: { attack: 6, defense: 20, control: 7, speed: 4 } },
] as const

const TROOPS = [
  { key: 'riders', name: 'Raptor Riders', role: 'Shock', mark: 'RR', stats: { attack: 12, defense: 4, control: 3, speed: 12 } },
  { key: 'tanks', name: 'T-Rex Tanks', role: 'Frontline', mark: 'TT', stats: { attack: 6, defense: 15, control: 5, speed: 2 } },
  { key: 'marksmen', name: 'Marksmen', role: 'Ranged', mark: 'MK', stats: { attack: 9, defense: 3, control: 12, speed: 6 } },
] as const

const STAT_META: { key: keyof Stats; label: string }[] = [
  { key: 'attack', label: 'ATTACK' },
  { key: 'defense', label: 'DEFENSE' },
  { key: 'control', label: 'CONTROL' },
  { key: 'speed', label: 'SPEED' },
]

function totalStats(...sets: Stats[]): Stats {
  return sets.reduce(
    (sum, stats) => ({
      attack: sum.attack + stats.attack,
      defense: sum.defense + stats.defense,
      control: sum.control + stats.control,
      speed: sum.speed + stats.speed,
    }),
    { attack: 28, defense: 28, control: 28, speed: 28 },
  )
}

export default function HomePlayablePreview() {
  const [mapKey, setMapKey] = useState<(typeof MAP_POINTS)[number]['key']>('boss')
  const [heroKey, setHeroKey] = useState<(typeof HEROES)[number]['key']>('nyra')
  const [dinoKey, setDinoKey] = useState<(typeof DINOS)[number]['key']>('trex')
  const [troopKey, setTroopKey] = useState<(typeof TROOPS)[number]['key']>('riders')

  const mapPoint = MAP_POINTS.find((point) => point.key === mapKey) ?? MAP_POINTS[0]
  const hero = HEROES.find((item) => item.key === heroKey) ?? HEROES[0]
  const dino = DINOS.find((item) => item.key === dinoKey) ?? DINOS[0]
  const troop = TROOPS.find((item) => item.key === troopKey) ?? TROOPS[0]
  const stats = useMemo(() => totalStats(hero.stats, dino.stats, troop.stats), [hero, dino, troop])

  const role = useMemo(() => {
    const highest = STAT_META.reduce((best, current) => (stats[current.key] > stats[best.key] ? current : best), STAT_META[0])
    return highest.key === 'attack'
      ? 'AGGRESSIVE BREAKER'
      : highest.key === 'defense'
        ? 'FRONTLINE HOLD'
        : highest.key === 'control'
          ? 'COUNTER FORMATION'
          : 'FAST STRIKE'
  }, [stats])

  return (
    <section className="home-playable section-band" aria-label="Interactive Dino Warfront preview">
      <div className="container-dd">
        <header className="home-playable__header" data-reveal="up">
          <div>
            <p className="eyebrow">FIELD TERMINAL // INTERACTIVE PREVIEW</p>
            <h2 className="display-lg text-white">Read the world.<br /><span className="text-gradient-magma">Build the march.</span></h2>
          </div>
          <p className="body-lg">Two small pieces of the strategy loop. Pick a target on the world map, then assemble a march that fits the job.</p>
        </header>

        <div className="home-field-map" data-reveal="scale">
          <img src={asset('modes/mode-world.jpg')} alt="Dino Warfront world map preview" className="home-field-map__image" />
          <div className="home-field-map__grid" aria-hidden />
          <div className="home-field-map__scan" aria-hidden />

          {MAP_POINTS.map((point) => (
            <button
              key={point.key}
              type="button"
              className="home-field-map__point"
              data-active={mapKey === point.key ? 'true' : undefined}
              style={{ left: point.x, top: point.y, ['--map-accent' as string]: point.accent }}
              onClick={() => setMapKey(point.key)}
              aria-label={`Inspect ${point.label}`}
            >
              <i />
              <span>{point.label}</span>
            </button>
          ))}

          <aside className="home-field-map__intel" style={{ ['--map-accent' as string]: mapPoint.accent }}>
            <p>{mapPoint.type} // INTEL</p>
            <h3>{mapPoint.label}</h3>
            <div>{mapPoint.detail}</div>
            <strong><i /> {mapPoint.status}</strong>
          </aside>

          <div className="home-field-map__hint">SELECT A MAP SIGNAL</div>
        </div>

        <div className="home-march-builder" data-reveal="up">
          <div className="home-march-builder__top">
            <div>
              <p>FORMATION LAB // 03 SLOTS</p>
              <h3>BUILD YOUR MARCH</h3>
            </div>
            <strong>{role}</strong>
          </div>

          <div className="home-march-builder__body">
            <div className="home-march-picker">
              <SelectionGroup label="01 // HERO">
                {HEROES.map((item) => (
                  <button key={item.key} type="button" data-active={heroKey === item.key ? 'true' : undefined} onClick={() => setHeroKey(item.key)}>
                    <img src={item.img} alt="" />
                    <span><strong>{item.name}</strong><small>{item.role}</small></span>
                  </button>
                ))}
              </SelectionGroup>

              <SelectionGroup label="02 // DINOSAUR">
                {DINOS.map((item) => (
                  <button key={item.key} type="button" data-active={dinoKey === item.key ? 'true' : undefined} onClick={() => setDinoKey(item.key)}>
                    <img src={item.img} alt="" />
                    <span><strong>{item.name}</strong><small>{item.role}</small></span>
                  </button>
                ))}
              </SelectionGroup>

              <SelectionGroup label="03 // TROOPS">
                {TROOPS.map((item) => (
                  <button key={item.key} type="button" data-active={troopKey === item.key ? 'true' : undefined} onClick={() => setTroopKey(item.key)}>
                    <b>{item.mark}</b>
                    <span><strong>{item.name}</strong><small>{item.role}</small></span>
                  </button>
                ))}
              </SelectionGroup>
            </div>

            <aside className="home-march-result">
              <div className="home-march-result__visual">
                <img src={hero.img} alt={hero.name} className="home-march-result__hero" />
                <img src={dino.img} alt={dino.name} className="home-march-result__dino" />
                <span>{troop.mark}</span>
              </div>
              <div className="home-march-result__title">
                <p>READY FORMATION</p>
                <h4>{hero.name} + {dino.name}</h4>
                <small>{troop.name}</small>
              </div>
              <div className="home-march-result__stats">
                {STAT_META.map((stat) => (
                  <div key={stat.key}>
                    <span><b>{stat.label}</b><strong>{stats[stat.key]}</strong></span>
                    <i><em style={{ width: `${Math.min(100, stats[stat.key])}%` }} /></i>
                  </div>
                ))}
              </div>
              <p className="home-march-result__note">Concept preview only. Final in-game values and counters can use the real combat balance later.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="home-march-group">
      <p>{label}</p>
      <div>{children}</div>
    </div>
  )
}
