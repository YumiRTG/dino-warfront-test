import { useEffect, useRef, useState } from 'react'

function tone(ctx: AudioContext, frequency: number, duration: number, gainValue: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration + 0.02)
}

export default function HomeSoundToggle() {
  const [enabled, setEnabled] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('dw-home-sfx') === 'on')
  const contextRef = useRef<AudioContext | null>(null)
  const lastHoverRef = useRef(0)

  const getContext = () => {
    if (!contextRef.current) contextRef.current = new AudioContext()
    if (contextRef.current.state === 'suspended') void contextRef.current.resume()
    return contextRef.current
  }

  useEffect(() => {
    window.localStorage.setItem('dw-home-sfx', enabled ? 'on' : 'off')
    if (!enabled) return

    const onPointer = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('a, button')) return
      const now = performance.now()
      if (now - lastHoverRef.current < 90) return
      lastHoverRef.current = now
      tone(getContext(), 540, 0.045, 0.016)
    }

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('a, button')) return
      tone(getContext(), 760, 0.075, 0.025)
    }

    document.addEventListener('pointerover', onPointer, true)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('pointerover', onPointer, true)
      document.removeEventListener('click', onClick, true)
    }
  }, [enabled])

  return (
    <button
      type="button"
      className="home-sfx-toggle"
      data-enabled={enabled ? 'true' : undefined}
      aria-pressed={enabled}
      onClick={() => {
        if (!enabled) tone(getContext(), 680, 0.09, 0.025)
        setEnabled((value) => !value)
      }}
    >
      <span aria-hidden>{enabled ? '◉' : '○'}</span>
      SFX {enabled ? 'ON' : 'OFF'}
    </button>
  )
}
