import { Link } from 'react-router'
import { DEV_SCREENSHOTS, FUTURE_UPDATES, PROGRESS_LOG, type DevShot } from '@/config/devlog'
import { usePageMotion } from '@/hooks/useMotion'
import { asset } from '@/lib/assets'

const TAG_STYLE: Record<string, { label: string; color: string }> = {
  shipped: { label: 'Shipped', color: '#3dffb5' },
  wip: { label: 'In progress', color: '#f5c15d' },
  milestone: { label: 'Milestone', color: '#ff7a3d' },
}

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  planned: { label: 'Planned', color: '#a8a09a' },
  'in-progress': { label: 'Building', color: '#f5c15d' },
  soon: { label: 'Soon', color: '#3dffb5' },
}

/** Still capture. Landscape tile, wide slot when featured. */
function Shot({ shot }: { shot: DevShot }) {
  return (
    <figure className={`shot ${shot.featured ? 'shot--wide' : ''}`} data-reveal-item>
      <div className="shot__media">
        <img
          src={shot.src}
          alt={shot.caption}
          className="shot__img"
          style={{ objectPosition: shot.pos ?? 'center center' }}
          loading="lazy"
        />
        <div className="shot__scrim" />
        <figcaption className="shot__cap">
          {shot.date && <span className="shot__date">{shot.date}</span>}
          <span className="shot__title">{shot.caption}</span>
          <span className="shot__note">{shot.note}</span>
        </figcaption>
      </div>
    </figure>
  )
}

/**
 * The clips are phone captures, 382x850. Cropping them into a landscape tile
 * throws away most of the frame, so they get a portrait frame instead.
 */
function Clip({ shot }: { shot: DevShot }) {
  return (
    <figure className="clip" data-reveal-item>
      <div className="clip__frame">
        <video
          src={shot.src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="clip__video"
        />
        <span className="shot__live">Cinematic</span>
      </div>
      <figcaption className="clip__cap">
        <span className="shot__title">{shot.caption}</span>
        <span className="shot__note">{shot.note}</span>
      </figcaption>
    </figure>
  )
}

export default function DevlogPage() {
  const motionRef = usePageMotion()

  const shipped = PROGRESS_LOG.filter((e) => e.tag === 'shipped').length
  const building = PROGRESS_LOG.filter((e) => e.tag === 'wip').length

  return (
    <div ref={motionRef} className="devlog">
      {/* Cinematic header */}
      <header className="devlog-hero" data-reveal="scale">
        <img src={asset('banner-bg.png')} alt="" className="devlog-hero__img" />
        <div className="devlog-hero__scrim" />
        <div className="container-dd relative z-10">
          <p className="live-badge">
            <span className="live-badge__dot" />
            Friend beta
          </p>
          <h1 className="display-lg text-white mt-4">
            Progress
            <br />
            <span className="text-gradient-magma">log</span>
          </h1>
          <p className="body-lg mt-5 max-w-xl">
            What has actually landed, what is being built, and what is still only a plan.
            No marketing dates and no promises we have not kept yet.
          </p>

          <div className="devlog-hero__stats">
            <div>
              <span>{shipped}</span>
              <small>Shipped</small>
            </div>
            <div>
              <span>{building}</span>
              <small>Building</small>
            </div>
            <div>
              <span>{FUTURE_UPDATES.length}</span>
              <small>On the roadmap</small>
            </div>
            <div>
              <span>4</span>
              <small>Modes live</small>
            </div>
          </div>
        </div>
      </header>

      <div className="container-dd pb-24">
        {/* Gallery */}
        <section className="mt-14 md:mt-20">
          <div className="flex items-end justify-between gap-4 mb-7" data-reveal="up">
            <div className="max-w-xl">
              <div className="sec-ornament mb-4 max-w-[220px]">
                <span>From the build</span>
              </div>
              <h2 className="display-md text-white">
                The game <span className="text-gradient-gold">as it stands</span>
              </h2>
              <p className="body-lg mt-4">
                Cinematics and art from the world of Dino Warfront, alongside stills of
                the build. All of it gets replaced as the game moves.
              </p>
            </div>
          </div>

          <div className="clip-row" data-reveal-stagger>
            {DEV_SCREENSHOTS.filter((s) => s.video).map((s) => (
              <Clip key={s.src} shot={s} />
            ))}
          </div>

          <div className="shot-grid mt-4" data-reveal-stagger>
            {DEV_SCREENSHOTS.filter((s) => !s.video).map((s) => (
              <Shot key={s.src} shot={s} />
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-16 md:mt-24">
          <div className="max-w-xl mb-8" data-reveal="up">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>Changelog</span>
            </div>
            <h2 className="display-md text-white">
              What has <span className="text-gradient-magma">landed</span>
            </h2>
          </div>

          <ol className="timeline" data-reveal-stagger>
            {PROGRESS_LOG.map((entry) => {
              const tag = entry.tag ? TAG_STYLE[entry.tag] : null
              const color = tag?.color ?? 'var(--gold)'
              return (
                <li
                  key={entry.id}
                  className="timeline__row"
                  data-reveal-item
                  style={{ ['--dot' as string]: color }}
                >
                  <div className="timeline__when">
                    <span className="timeline__date">{entry.date}</span>
                    {tag && (
                      <span className="timeline__tag" style={{ color }}>
                        {tag.label}
                      </span>
                    )}
                  </div>
                  <div className="timeline__mark" aria-hidden>
                    <span />
                  </div>
                  <div className="timeline__body">
                    <h3 className="timeline__title">{entry.title}</h3>
                    <p className="timeline__text">{entry.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Roadmap */}
        <section className="mt-16 md:mt-24">
          <div className="max-w-xl mb-8" data-reveal="up">
            <div className="sec-ornament mb-4 max-w-[220px]">
              <span>Ahead</span>
            </div>
            <h2 className="display-md text-white">
              Still <span className="text-gradient-gold">to come</span>
            </h2>
            <p className="body-lg mt-4">
              Planned means not built yet. It stays on this list until it is.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-reveal-stagger>
            {FUTURE_UPDATES.map((u) => {
              const st = STATUS_STYLE[u.status]!
              return (
                <article
                  key={u.id}
                  className="road-card"
                  data-reveal-item
                  style={{ ['--road' as string]: st.color }}
                >
                  <span className="road-card__status">{st.label}</span>
                  <h3 className="road-card__title">{u.title}</h3>
                  <p className="road-card__text">{u.body}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16" data-reveal="up">
          <div className="mode-cta" style={{ ['--mode-accent-soft' as string]: 'rgba(255,77,26,0.16)' }}>
            <div
              className="mode-cta__glow"
              style={{ background: 'radial-gradient(circle, rgba(255,77,26,0.4), transparent 70%)' }}
            />
            <div className="relative z-10 max-w-2xl">
              <p className="eyebrow">Friend beta</p>
              <h2 className="display-md text-white mt-3">Play the current build</h2>
              <p className="body-lg mt-4">
                Download the APK, log in with your Account ID, and tell us what breaks.
                That feedback is what steers the next entries on this page.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/download" className="btn-primary no-underline">
                  Download APK
                </Link>
                <Link to="/modes" className="btn-secondary no-underline">
                  See the four modes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
