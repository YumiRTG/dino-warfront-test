import { asset } from '@/lib/assets'
import { APK_DOWNLOAD } from '@/config/download'
import { useAuth } from '@/hooks/useAuth'

export default function ApkDownload() {
  const isReady = APK_DOWNLOAD.available && Boolean(APK_DOWNLOAD.apkUrl)
  const { session } = useAuth()

  return (
    <section id="apk" className="max-w-[920px] mx-auto">
      <div className="text-center mb-10">
        <p className="eyebrow justify-center">Friend beta</p>
        <h1 className="display-lg text-white mt-4">
          Down<span className="text-gradient-magma">load</span>
        </h1>
        <p className="body-lg mt-4 max-w-lg mx-auto">
          Install the Android beta directly — share the link with friends.
        </p>
      </div>

      <div className="dd-panel overflow-hidden">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 'min(42vw, 280px)', minHeight: 200 }}
        >
          <img
            src={asset('campaign-1.png')}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(7,6,10,0.2) 0%, rgba(7,6,10,0.55) 50%, rgba(7,6,10,0.95) 100%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex items-end gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 border-[var(--gold)]/40 shrink-0 shadow-xl bg-[#0a0810]"
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              <img
                src={asset('dino-tyranno.png')}
                alt="Dino Warfront"
                className="w-full h-full"
                style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
            <div className="min-w-0 pb-0.5">
              <p className="font-display text-2xl md:text-3xl text-white tracking-wide">
                DINO WARFRONT
              </p>
              <p className="font-ui text-[11px] tracking-[0.18em] uppercase text-[var(--gold)] mt-1">
                Android APK · Beta
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Platform', value: APK_DOWNLOAD.platform },
              { label: 'Version', value: APK_DOWNLOAD.version },
              { label: 'Size', value: APK_DOWNLOAD.sizeLabel },
              { label: 'Requires', value: APK_DOWNLOAD.minAndroid },
            ].map((item) => (
              <div key={item.label} className="stat-chip text-center !pl-3">
                <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]">
                  {item.label}
                </p>
                <p className="font-ui text-sm text-white mt-1.5 tracking-wide">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-[var(--bone-dim)] leading-relaxed mb-6">
            {APK_DOWNLOAD.notes}
          </p>

          {session && (
            <div className="mb-5 rounded-lg border border-[var(--gold)]/25 bg-[var(--gold)]/10 px-4 py-3">
              <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]">
                Logged in as
              </p>
              <p className="font-ui text-white text-sm mt-1">{session.displayName}</p>
            </div>
          )}

          {isReady ? (
            <>
              <a
                href={APK_DOWNLOAD.apkUrl}
                download={APK_DOWNLOAD.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full no-underline"
              >
                Download APK
              </a>
              <p className="mt-3 text-center font-ui text-[10px] tracking-[0.16em] uppercase text-[var(--bone-dim)]">
                Host · {APK_DOWNLOAD.hostLabel} · not Google Drive
              </p>
            </>
          ) : (
            <button type="button" disabled className="btn-primary w-full">
              APK coming soon
            </button>
          )}

          <ol className="mt-8 space-y-2 font-body text-sm text-[var(--bone-dim)] list-decimal list-inside leading-relaxed">
            <li>Open this page on your Android phone.</li>
            <li>Tap Download APK — you land on Gofile (not Drive).</li>
            <li>Tap Download again on Gofile and wait for the file.</li>
            <li>Allow install from this source if asked.</li>
            <li>Launch Dino Warfront and play.</li>
          </ol>
        </div>
      </div>
    </section>
  )
}
