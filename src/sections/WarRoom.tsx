import { useEffect, useState } from 'react'
import { compact, getServerPulse, seasonRemaining, type ServerPulse } from '@/lib/live'
import { useCountUp } from '@/hooks/useCountUp'

function Readout({ value, label, suffix, format = compact }: { value: number; label: string; suffix?: string; format?: (n: number) => string }) {
  const { ref, value: shown } = useCountUp(value)
  return (
    <div className="readout">
      <span ref={ref} className="readout__value">{format(shown)}{suffix && <span className="readout__suffix">{suffix}</span>}</span>
      <span className="readout__label">{label}</span>
    </div>
  )
}

function SeasonClock() {
  const [t, setT] = useState(seasonRemaining())
  useEffect(() => {
    const id = window.setInterval(() => setT(seasonRemaining()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const cells: [number, string][] = [[t.days, 'days'], [t.hours, 'hrs'], [t.minutes, 'min'], [t.seconds, 'sec']]
  return (
    <div className="season-clock">
      <p className="season-clock__label">Arena season ends in</p>
      <div className="season-clock__cells">
        {cells.map(([n, unit]) => (
          <div key={unit} className="season-clock__cell"><span className="season-clock__num">{String(n).padStart(2, '0')}</span><span className="season-clock__unit">{unit}</span></div>
        ))}
      </div>
    </div>
  )
}

export default function WarRoom() {
  const [pulse, setPulse] = useState<ServerPulse | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    getServerPulse().then((p) => alive && setPulse(p)).catch(() => alive && setFailed(true))
    return () => { alive = false }
  }, [])

  if (failed) return null

  const activeWorld = (pulse?.commanders ?? 0) > 0
  const signals = [
    { tag: 'WORLD EVENT', title: 'World Boss detected', text: 'Alliance hunt protocol ready', accent: '#ff8a38' },
    { tag: 'DAILY SYSTEM', title: 'Defense challenge ready', text: 'Fresh ranked battlefield available', accent: '#e7b84b' },
    { tag: 'WORLD STATUS', title: activeWorld ? 'Commanders in the field' : 'World awaiting orders', text: `${compact(pulse?.alliances ?? 0)} alliances registered`, accent: '#38e8ff' },
  ]

  return (
    <section className="war-room" aria-label="Server status">
      <div className="war-room__scan" aria-hidden />
      <div className="container-dd relative">
        <div className="war-room__grid">
          <div className="war-room__head">
            <p className="live-badge"><span className="live-badge__dot" />Server online</p>
            <h2 className="war-room__title">World <span className="text-gradient-magma">dev8d</span></h2>
            <p className="war-room__note">
              {pulse?.lastSeenMinutes != null
                ? `Last commander seen ${pulse.lastSeenMinutes < 60 ? `${pulse.lastSeenMinutes} min` : `${Math.round(pulse.lastSeenMinutes / 60)} h`} ago`
                : 'Reading the live server'}
            </p>
          </div>

          <div className="war-room__readouts">
            <Readout value={pulse?.commanders ?? 0} label="Commanders" />
            <Readout value={pulse?.alliances ?? 0} label="Alliances" />
            <Readout value={pulse?.troopKills ?? 0} label="Troops killed" />
            <Readout value={pulse?.topPower ?? 0} label="Highest power" />
            <Readout value={pulse?.season ?? 0} label="Season" format={(n) => String(n)} />
          </div>

          <SeasonClock />

          <div className="war-room__signals" aria-label="Warfront activity signals">
            {signals.map((signal) => (
              <div key={signal.title} className="war-room-signal" style={{ ['--signal-accent' as string]: signal.accent }}>
                <p>{signal.tag}</p><strong>{signal.title}</strong><span>{signal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
