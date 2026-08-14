/**
 * Hand-built SVG diagrams for the mode pages.
 * Deliberately not screenshots: they explain a system in one glance and stay
 * crisp at any size. All strokes read `--mode-accent` from the page shell.
 */

const GRID = (
  <defs>
    <pattern id="dd-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </pattern>
  </defs>
)

/** The defense field: one path, slots either side, the gate at the end. */
export function TdPathDiagram() {
  const slots: [number, number][] = [
    [120, 92], [196, 178], [286, 96], [352, 200],
    [138, 246], [268, 262], [408, 128], [432, 246],
  ]
  return (
    <figure className="diagram">
      <svg viewBox="0 0 520 320" className="diagram__svg" role="img" aria-label="Tower defense path layout">
        {GRID}
        <rect x="0" y="0" width="520" height="320" fill="url(#dd-grid)" />

        {/* path */}
        <path
          d="M12 60 H 240 Q 268 60 268 88 V 150 Q 268 178 296 178 H 400 Q 428 178 428 206 V 300"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 60 H 240 Q 268 60 268 88 V 150 Q 268 178 296 178 H 400 Q 428 178 428 206 V 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          className="diagram__flow"
          opacity="0.85"
        />

        {/* spawn */}
        <circle cx="12" cy="60" r="7" fill="currentColor" />
        <text x="26" y="42" className="diagram__label">Spawn</text>

        {/* gate */}
        <rect x="404" y="292" width="48" height="10" rx="2" fill="#ff4d1a" opacity="0.9" />
        <text x="352" y="282" className="diagram__label">Your gate · 20 lives</text>

        {/* tower slots */}
        {slots.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
            <circle cx={x} cy={y} r="6" fill="currentColor" opacity={i < 3 ? 0.95 : 0.35} />
          </g>
        ))}

        <text x="20" y="306" className="diagram__label">Build slots · range shown at placement</text>
      </svg>
      <figcaption className="diagram__caption">
        Every stage generates its own path and its own slot layout. The camera shows the
        whole 60 × 60 field at once, so nothing is hidden from you except what you can
        afford.
      </figcaption>
    </figure>
  )
}

/** Best-of-three team arena bracket. */
const DEFENDER = '#7b5cff'

export function ArenaBracketDiagram() {
  const rounds = [
    { label: 'Round 1', y: 56, won: true },
    { label: 'Round 2', y: 152, won: false },
    { label: 'Round 3', y: 248, won: true },
  ]
  return (
    <figure className="diagram">
      <svg viewBox="0 0 520 320" className="diagram__svg" role="img" aria-label="Team arena best of three">
        {GRID}
        <rect x="0" y="0" width="520" height="320" fill="url(#dd-grid)" />

        <text x="70" y="26" className="diagram__label" textAnchor="middle">Your teams</text>
        <text x="450" y="26" className="diagram__label" textAnchor="middle">Their defense</text>

        {rounds.map((r, i) => (
          <g key={r.label}>
            {/* attacker trio */}
            {[0, 1, 2].map((k) => (
              <circle
                key={`a${k}`}
                cx={34 + k * 36}
                cy={r.y}
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                opacity={r.won ? 0.95 : 0.3}
              />
            ))}
            {/* defender trio */}
            {[0, 1, 2].map((k) => (
              <circle
                key={`d${k}`}
                cx={414 + k * 36}
                cy={r.y}
                r="13"
                fill="none"
                stroke={DEFENDER}
                strokeWidth="1.4"
                opacity={r.won ? 0.3 : 0.95}
              />
            ))}
            <line
              x1="122"
              y1={r.y}
              x2="398"
              y2={r.y}
              stroke={r.won ? 'currentColor' : DEFENDER}
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.5"
            />
            <rect
              x="216"
              y={r.y - 16}
              width="88"
              height="32"
              rx="3"
              fill="rgba(10,8,18,0.9)"
              stroke={r.won ? 'currentColor' : DEFENDER}
              strokeWidth="1"
              opacity="0.9"
            />
            <text x="260" y={r.y + 5} className="diagram__value" textAnchor="middle">
              {r.won ? 'WIN' : 'LOSS'}
            </text>
            <text x="260" y={r.y - 24} className="diagram__label" textAnchor="middle">
              {r.label} · full health
            </text>
            {i === 2 && (
              <text x="260" y={r.y + 46} className="diagram__label" textAnchor="middle">
                2 : 1 — match taken
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="diagram__caption">
        Nine heroes, three teams, no repeats. Every round restarts at full health, so
        throwing away the first team can be the right call. At 2:0 the third never happens.
      </figcaption>
    </figure>
  )
}

/** Five concentric danger zones with the boss at the centre. */
export function WorldZoneDiagram() {
  const rings = [
    { r: 148, label: 'Zone 1', op: 0.14 },
    { r: 118, label: 'Zone 2', op: 0.22 },
    { r: 88, label: 'Zone 3', op: 0.32 },
    { r: 58, label: 'Zone 4', op: 0.46 },
    { r: 28, label: 'Zone 5', op: 0.7 },
  ]
  return (
    <figure className="diagram">
      <svg viewBox="0 0 520 340" className="diagram__svg" role="img" aria-label="World map danger zones">
        {GRID}
        <rect x="0" y="0" width="520" height="340" fill="url(#dd-grid)" />
        <g transform="translate(260 170)">
          {rings.map((ring) => (
            <circle
              key={ring.label}
              r={ring.r}
              fill="currentColor"
              fillOpacity={ring.op * 0.12}
              stroke="currentColor"
              strokeOpacity={ring.op}
              strokeWidth="1"
            />
          ))}
          <circle r="9" fill="#ff4d1a" />
          <circle r="9" fill="none" stroke="#ff4d1a" strokeWidth="1" className="diagram__ping" />
          <text y="-20" className="diagram__value" textAnchor="middle">RALLY BOSS</text>

          {/* your base out in zone 1 */}
          <g transform="translate(-124 74)">
            <rect x="-7" y="-7" width="14" height="14" rx="2" fill="currentColor" />
            <text y="26" className="diagram__label" textAnchor="middle">Your base</text>
          </g>

          {/* a march line inward */}
          <path
            d="M-124 74 Q -70 40 -20 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            className="diagram__flow"
            opacity="0.8"
          />
        </g>

        {rings.map((ring, i) => (
          <text key={ring.label} x="264" y={170 - ring.r + 14} className="diagram__label" textAnchor="middle" opacity={0.5 + i * 0.1}>
            {ring.label}
          </text>
        ))}
      </svg>
      <figcaption className="diagram__caption">
        Eight thousand units across. Monsters and resource nodes get stronger with every
        ring you cross, and the travel time you are looking at is the same one your target
        gets to look at.
      </figcaption>
    </figure>
  )
}

/** The nine-region campaign path with per-region stage counts. */
export function CampaignPathDiagram() {
  const nodes = [
    { x: 40, y: 250, n: 6, name: 'Steppe' },
    { x: 100, y: 190, n: 8, name: 'Grazer' },
    { x: 162, y: 244, n: 8, name: 'Volcano' },
    { x: 224, y: 170, n: 8, name: 'Camp' },
    { x: 286, y: 236, n: 8, name: 'Swamp' },
    { x: 344, y: 150, n: 8, name: 'Warrior' },
    { x: 404, y: 214, n: 10, name: 'Ice' },
    { x: 452, y: 120, n: 10, name: 'Mage' },
    { x: 496, y: 190, n: 12, name: 'Coast' },
  ]
  const d = nodes.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
  return (
    <figure className="diagram">
      <svg viewBox="0 0 520 300" className="diagram__svg" role="img" aria-label="Campaign region path">
        {GRID}
        <rect x="0" y="0" width="520" height="300" fill="url(#dd-grid)" />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 10" className="diagram__flow" />
        {nodes.map((p, i) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r={9 + p.n / 3} fill="rgba(10,8,18,0.95)" stroke="currentColor" strokeWidth="1.3" opacity={0.45 + i * 0.06} />
            <text x={p.x} y={p.y + 4} className="diagram__value" textAnchor="middle">{p.n}</text>
            <text x={p.x} y={p.y - 20} className="diagram__label" textAnchor="middle">{p.name}</text>
          </g>
        ))}
        <text x="20" y="40" className="diagram__label">78 stages · one boss per region · four difficulties</text>
      </svg>
      <figcaption className="diagram__caption">
        The numbers are how many stages each region holds. They unlock in order, the last
        stage of each one is a boss, and the stars start over on every difficulty.
      </figcaption>
    </figure>
  )
}
