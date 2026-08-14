import { Link } from 'react-router'
import DinoMark from '@/components/DinoMark'
import { COMMUNITY } from '@/config/community'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Story', to: '/story' },
  { label: 'Features', to: '/features' },
  { label: 'Play', to: '/play' },
  { label: 'Bestiary', to: '/bestiary' },
  { label: 'Progress', to: '/progress' },
  { label: 'Download', to: '/download' },
]

function openSupport() {
  window.dispatchEvent(new Event('dd-open-support'))
  if (window.location.hash !== '#support') {
    window.location.hash = 'support'
  }
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[var(--gold)]/10">
      <div className="hud-line opacity-40" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255,77,26,0.04) 100%)',
        }}
      />

      <div className="container-dd relative py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 flex items-start gap-3">
          <span className="text-[var(--gold)] mt-0.5">
            <DinoMark className="w-8 h-8" />
          </span>
          <div>
            <p className="font-display tracking-[0.16em] text-[var(--bone)] text-lg">
              DINO WARFRONT
            </p>
            <p className="font-body text-sm text-[var(--bone-dim)] mt-2 leading-relaxed max-w-xs">
              Prehistoric strategy survival. Build your base, recruit heroes,
              tame apex predators — and claim the wild.
            </p>
            <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-[var(--gold)]/70 mt-4">
              Tame · Hunt · Conquer
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-4">
            Navigate
          </p>
          <div className="flex flex-col gap-2.5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-ui text-[11px] uppercase tracking-[0.16em] text-[var(--bone-dim)] no-underline hover:text-[var(--gold)] transition-colors w-fit"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-4">
            Community
          </p>
          <div className="flex flex-col gap-2.5 items-start">
            <button
              type="button"
              onClick={openSupport}
              className="font-ui text-[11px] uppercase tracking-[0.16em] text-[var(--bone-dim)] bg-transparent border-none cursor-pointer p-0 hover:text-[var(--gold)] transition-colors"
            >
              Support chat
            </button>

            {COMMUNITY.discordUrl ? (
              <a
                href={COMMUNITY.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="font-ui text-[11px] uppercase tracking-[0.16em] text-[var(--bone-dim)] no-underline hover:text-[var(--gold)]"
              >
                Discord
              </a>
            ) : (
              <span className="font-ui text-[11px] uppercase tracking-[0.16em] text-white/30">
                Discord · coming soon
              </span>
            )}

            {COMMUNITY.forumUrl ? (
              <a
                href={COMMUNITY.forumUrl}
                target="_blank"
                rel="noreferrer"
                className="font-ui text-[11px] uppercase tracking-[0.16em] text-[var(--bone-dim)] no-underline hover:text-[var(--gold)]"
              >
                Forum
              </a>
            ) : (
              <span className="font-ui text-[11px] uppercase tracking-[0.16em] text-white/30">
                Forum · coming soon
              </span>
            )}

            <Link
              to="/download"
              className="btn-primary !py-2.5 !px-5 !text-[0.68rem] no-underline mt-4"
            >
              Get APK
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-4 text-center font-body text-[11px] text-white/25 tracking-wide">
        © {new Date().getFullYear()} Dino Warfront · Friend beta
      </div>
    </footer>
  )
}
