import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { MODES, type Mode, type ModeSpec } from '@/config/modes'

/**
 * Shared shell for the four mode pages.
 * Every page sets `--mode-accent` once; the rules, glows, brackets and diagram
 * strokes below all read from it, so a mode keeps one colour identity.
 */

export function ModeSwitcher({ active }: { active: string }) {
  return (
    <div className="mode-switcher" role="navigation" aria-label="Game modes">
      <div className="container-dd flex items-center gap-2 overflow-x-auto py-2.5">
        <span className="hidden md:inline font-ui text-[9px] tracking-[0.3em] uppercase text-[var(--bone-dim)] pr-2 shrink-0">
          Modes
        </span>
        {MODES.map((m) => (
          <NavLink
            key={m.key}
            to={m.to}
            className="mode-switcher__item no-underline shrink-0"
            data-active={m.key === active ? 'true' : undefined}
            style={{ ['--pill' as string]: m.accent }}
          >
            {m.short}
          </NavLink>
        ))}
        <span className="flex-1" />
        <Link
          to="/modes"
          className="mode-switcher__item mode-switcher__item--ghost no-underline shrink-0"
        >
          All four
        </Link>
      </div>
    </div>
  )
}

export function ModeHero({ mode, children }: { mode: Mode; children?: ReactNode }) {
  return (
    <header className="mode-hero" data-reveal="scale">
      <div className="mode-hero__media">
        <img
          src={mode.img}
          alt=""
          className="mode-hero__img"
          style={{ objectPosition: mode.pos }}
        />
        <div className="mode-hero__scrim" />
        <div
          className="mode-hero__wash"
          style={{
            background: `radial-gradient(ellipse 70% 90% at 15% 100%, ${mode.accentSoft}, transparent 60%)`,
          }}
        />
      </div>
      <div className="mode-hero__rule" aria-hidden />

      <div className="mode-hero__body container-dd">
        <p className="eyebrow">{mode.kicker}</p>
        <h1 className="display-lg text-white mt-3">{mode.name}</h1>
        <p className="mode-hero__tagline">{mode.tagline}</p>
        <p className="body-lg mt-5 max-w-2xl">{mode.blurb}</p>
        {children}
      </div>
    </header>
  )
}

export function SpecRail({ specs }: { specs: ModeSpec[] }) {
  return (
    <div className="spec-rail" data-reveal-stagger>
      {specs.map((s) => (
        <div key={s.label} className="spec-rail__cell" data-reveal-item>
          <p className="spec-rail__value">{s.value}</p>
          <p className="spec-rail__label">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export function SectionHead({
  ornament,
  title,
  accentWord,
  text,
  right,
}: {
  ornament: string
  title: string
  accentWord?: string
  text?: string
  right?: ReactNode
}) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 md:mb-10"
      data-reveal="up"
    >
      <div className="max-w-2xl">
        <div className="sec-ornament mb-4 max-w-[220px]">
          <span>{ornament}</span>
        </div>
        <h2 className="display-md text-white">
          {title}{' '}
          {accentWord && <span className="text-mode-accent">{accentWord}</span>}
        </h2>
        {text && <p className="body-lg mt-4">{text}</p>}
      </div>
      {right}
    </div>
  )
}

/** Numbered loop steps — the shape every mode page uses for "how it plays". */
export function LoopSteps({
  steps,
}: {
  steps: { step: string; title: string; text: string }[]
}) {
  return (
    <ol className="loop-steps" data-reveal-stagger>
      {steps.map((s) => (
        <li key={s.step} className="loop-steps__item" data-reveal-item>
          <span className="loop-steps__num">{s.step}</span>
          <h3 className="font-display text-lg text-white uppercase tracking-wide mt-3">
            {s.title}
          </h3>
          <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
            {s.text}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function FactGrid({
  items,
  cols = 3,
}: {
  items: { title: string; text: string }[]
  cols?: 2 | 3
}) {
  return (
    <div
      className={`grid gap-4 ${cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
      data-reveal-stagger
    >
      {items.map((it) => (
        <div key={it.title} className="fact-card" data-reveal-item>
          <p className="font-display text-lg text-mode-accent uppercase tracking-wide">
            {it.title}
          </p>
          <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed">
            {it.text}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ModeFooterCta({
  mode,
  line,
}: {
  mode: Mode
  line: string
}) {
  const next = MODES[(MODES.findIndex((m) => m.key === mode.key) + 1) % MODES.length]
  return (
    <section className="mt-16 md:mt-20" data-reveal="up">
      <div className="mode-cta">
        <div
          className="mode-cta__glow"
          style={{ background: `radial-gradient(circle, ${mode.accentSoft}, transparent 70%)` }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="sec-ornament mb-4 max-w-[240px]">
            <span>{mode.short}</span>
          </div>
          <h2 className="display-md text-white">{line}</h2>
          <dl className="mode-cta__meta">
            <div>
              <dt>Where</dt>
              <dd>{mode.entry}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>{mode.unlock}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link to="/download" className="btn-primary no-underline">
              Download the beta
            </Link>
            <Link to={next.to} className="btn-secondary no-underline">
              Next mode · {next.short}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
