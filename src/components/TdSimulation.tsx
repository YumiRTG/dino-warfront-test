import { useEffect, useRef } from 'react'

/**
 * A miniature of a defense run, drawn on canvas: the wave walks the path, the
 * towers acquire and fire, hits register, kills burst. It is not the game, it
 * is the shape of the game, and it explains the mode faster than a screenshot.
 *
 * Runs only while on screen, and holds a single static frame when the visitor
 * has asked for reduced motion.
 */

const ACCENT = '#3dffb5'
const ENEMY = '#ff6b3d'
const GATE = '#ff4d1a'

// Same route as the static diagram, in the 520 × 320 design space.
const PATH: [number, number][] = [
  [12, 60], [240, 60], [268, 88], [268, 150],
  [296, 178], [400, 178], [428, 206], [428, 300],
]

const TOWERS: { x: number; y: number; range: number; rate: number }[] = [
  { x: 120, y: 92, range: 62, rate: 0.9 },
  { x: 286, y: 96, range: 58, rate: 1.3 },
  { x: 268, y: 262, range: 64, rate: 0.7 },
  { x: 408, y: 128, range: 66, rate: 1.1 },
]

type Enemy = { t: number; speed: number; hp: number; maxHp: number; size: number; dead: number }
type Shot = { x: number; y: number; tx: number; ty: number; life: number; target: Enemy }
type Burst = { x: number; y: number; life: number }

const segLengths: number[] = []
let totalLength = 0
for (let i = 1; i < PATH.length; i++) {
  const dx = PATH[i]![0] - PATH[i - 1]![0]
  const dy = PATH[i]![1] - PATH[i - 1]![1]
  const len = Math.hypot(dx, dy)
  segLengths.push(len)
  totalLength += len
}

/** Position along the route, t in 0..1. */
function pointAt(t: number): [number, number] {
  let d = Math.max(0, Math.min(1, t)) * totalLength
  for (let i = 0; i < segLengths.length; i++) {
    if (d <= segLengths[i]!) {
      const f = d / segLengths[i]!
      return [
        PATH[i]![0] + (PATH[i + 1]![0] - PATH[i]![0]) * f,
        PATH[i]![1] + (PATH[i + 1]![1] - PATH[i]![1]) * f,
      ]
    }
    d -= segLengths[i]!
  }
  return PATH[PATH.length - 1] as [number, number]
}

export default function TdSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const enemies: Enemy[] = []
    const shots: Shot[] = []
    const bursts: Burst[] = []
    const cooldowns = TOWERS.map(() => Math.random())
    let spawnTimer = 0
    let leaked = 0
    let killed = 0
    let raf = 0
    let last = 0
    let running = false

    function resize() {
      const rect = wrap!.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas!.width = Math.round(rect.width * dpr)
      canvas!.height = Math.round((rect.width * 320) / 520) * dpr
      canvas!.style.height = `${Math.round((rect.width * 320) / 520)}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function scale() {
      const rect = wrap!.getBoundingClientRect()
      return rect.width / 520
    }

    function spawn() {
      const hp = 40 + Math.random() * 70
      enemies.push({
        t: 0,
        speed: 0.055 + Math.random() * 0.05,
        hp,
        maxHp: hp,
        size: 3.2 + hp / 45,
        dead: 0,
      })
    }

    function step(dt: number) {
      spawnTimer -= dt
      if (spawnTimer <= 0 && enemies.length < 14) {
        spawn()
        spawnTimer = 0.55 + Math.random() * 0.5
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i]!
        if (e.dead > 0) {
          e.dead -= dt
          if (e.dead <= 0) enemies.splice(i, 1)
          continue
        }
        e.t += e.speed * dt * 0.35
        if (e.t >= 1) {
          leaked++
          enemies.splice(i, 1)
        }
      }

      TOWERS.forEach((tw, ti) => {
        cooldowns[ti]! -= dt
        if (cooldowns[ti]! > 0) return
        let best: Enemy | null = null
        let bestT = -1
        for (const e of enemies) {
          if (e.dead > 0) continue
          const [ex, ey] = pointAt(e.t)
          if (Math.hypot(ex - tw.x, ey - tw.y) <= tw.range && e.t > bestT) {
            best = e
            bestT = e.t
          }
        }
        if (best) {
          const [ex, ey] = pointAt(best.t)
          shots.push({ x: tw.x, y: tw.y, tx: ex, ty: ey, life: 1, target: best })
          cooldowns[ti] = 1 / tw.rate
        }
      })

      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i]!
        s.life -= dt * 5.5
        const [ex, ey] = pointAt(s.target.t)
        s.tx = ex
        s.ty = ey
        if (s.life <= 0) {
          if (s.target.dead <= 0) {
            s.target.hp -= 26
            if (s.target.hp <= 0) {
              s.target.dead = 0.32
              killed++
              bursts.push({ x: ex, y: ey, life: 1 })
            }
          }
          shots.splice(i, 1)
        }
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        bursts[i]!.life -= dt * 2.6
        if (bursts[i]!.life <= 0) bursts.splice(i, 1)
      }
    }

    function draw() {
      const k = scale()
      const W = 520 * k
      const H = 320 * k
      ctx!.clearRect(0, 0, W, H)

      // survey grid
      ctx!.strokeStyle = 'rgba(255,255,255,0.045)'
      ctx!.lineWidth = 1
      for (let x = 0; x <= 520; x += 26) {
        ctx!.beginPath(); ctx!.moveTo(x * k, 0); ctx!.lineTo(x * k, H); ctx!.stroke()
      }
      for (let y = 0; y <= 320; y += 26) {
        ctx!.beginPath(); ctx!.moveTo(0, y * k); ctx!.lineTo(W, y * k); ctx!.stroke()
      }

      // path bed
      ctx!.lineJoin = 'round'
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = 'rgba(255,255,255,0.09)'
      ctx!.lineWidth = 24 * k
      ctx!.beginPath()
      PATH.forEach((p, i) => (i ? ctx!.lineTo(p[0] * k, p[1] * k) : ctx!.moveTo(p[0] * k, p[1] * k)))
      ctx!.stroke()

      // tower ranges + bodies
      TOWERS.forEach((tw) => {
        ctx!.strokeStyle = 'rgba(61,255,181,0.16)'
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.arc(tw.x * k, tw.y * k, tw.range * k, 0, Math.PI * 2)
        ctx!.stroke()

        ctx!.fillStyle = ACCENT
        ctx!.beginPath()
        ctx!.arc(tw.x * k, tw.y * k, 5 * k, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.strokeStyle = 'rgba(61,255,181,0.5)'
        ctx!.beginPath()
        ctx!.arc(tw.x * k, tw.y * k, 9 * k, 0, Math.PI * 2)
        ctx!.stroke()
      })

      // gate
      ctx!.fillStyle = GATE
      ctx!.fillRect(414 * k, 296 * k, 28 * k, 5 * k)

      // enemies
      enemies.forEach((e) => {
        const [x, y] = pointAt(e.t)
        if (e.dead > 0) {
          ctx!.globalAlpha = Math.max(0, e.dead / 0.32)
        }
        ctx!.fillStyle = ENEMY
        ctx!.beginPath()
        ctx!.arc(x * k, y * k, e.size * k, 0, Math.PI * 2)
        ctx!.fill()

        // health sliver
        if (e.dead <= 0 && e.hp < e.maxHp) {
          const w = 11 * k
          ctx!.fillStyle = 'rgba(0,0,0,0.55)'
          ctx!.fillRect(x * k - w / 2, y * k - (e.size + 5) * k, w, 2 * k)
          ctx!.fillStyle = ACCENT
          ctx!.fillRect(x * k - w / 2, y * k - (e.size + 5) * k, w * (e.hp / e.maxHp), 2 * k)
        }
        ctx!.globalAlpha = 1
      })

      // tracers
      shots.forEach((s) => {
        const p = 1 - s.life
        const x = s.x + (s.tx - s.x) * p
        const y = s.y + (s.ty - s.y) * p
        ctx!.strokeStyle = 'rgba(61,255,181,0.75)'
        ctx!.lineWidth = 1.5 * k
        ctx!.beginPath()
        ctx!.moveTo(x * k, y * k)
        ctx!.lineTo(
          (x - (s.tx - s.x) * 0.06) * k,
          (y - (s.ty - s.y) * 0.06) * k,
        )
        ctx!.stroke()
      })

      // kill bursts
      bursts.forEach((b) => {
        ctx!.globalAlpha = Math.max(0, b.life)
        ctx!.strokeStyle = ACCENT
        ctx!.lineWidth = 1.5 * k
        ctx!.beginPath()
        ctx!.arc(b.x * k, b.y * k, (1 - b.life) * 16 * k + 3 * k, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.globalAlpha = 1
      })

      // readout
      ctx!.font = `${Math.max(9, 10 * k)}px Oswald, sans-serif`
      ctx!.fillStyle = 'rgba(242,235,224,0.55)'
      ctx!.fillText(`KILLS ${killed}`, 14 * k, 22 * k)
      ctx!.fillStyle = leaked ? 'rgba(255,107,61,0.85)' : 'rgba(242,235,224,0.35)'
      ctx!.fillText(`LEAKED ${leaked}`, 14 * k, 36 * k)
    }

    function frame(t: number) {
      if (!last) last = t
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      step(dt)
      draw()
      if (running) raf = requestAnimationFrame(frame)
    }

    resize()

    if (reduced) {
      // One populated still frame, no motion.
      for (let i = 0; i < 7; i++) {
        spawn()
        enemies[enemies.length - 1]!.t = 0.1 + i * 0.11
      }
      draw()
      const onResize = () => {
        resize()
        draw()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false
        if (visible && !running) {
          running = true
          last = 0
          raf = requestAnimationFrame(frame)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.15 },
    )
    io.observe(wrap)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <figure className="diagram">
      <div ref={wrapRef} className="td-sim">
        <canvas ref={canvasRef} className="td-sim__canvas" aria-hidden />
      </div>
      <figcaption className="diagram__caption">
        A defense run in miniature, playing live. Four towers, one path, and a wave that
        does not stop coming. Ranges are drawn the way the game draws them while you place.
      </figcaption>
    </figure>
  )
}
