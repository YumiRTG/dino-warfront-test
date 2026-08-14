/**
 * Android APK download settings for friend testing.
 *
 * HOW TO UPDATE:
 * 1) Host a new APK (OneDrive / Drive / Gofile / Dropbox)
 * 2) Paste the share/download URL into `apkUrl`
 * 3) Set `available` to true, update version/size, commit & push
 *
 * Current host: Gofile (re-uploaded 2026-07-20 with account token)
 *   page: https://gofile.io/d/FtXQwf
 *   file: DinoDominion.apk · 2751982002 bytes · md5 43fc8794b880df065d19a18218aa2eeb
 *   token (manage): 4mOytDztkMSZTIWdhlqVpIdfJTnpwGlg
 *
 * Prefer OneDrive if Gofile says "not available" (free tier is flaky for ~2.6 GB).
 * Local: Desktop\Survival Game\DinoDominion\Dino Dominion.apk
 * OneDrive copy: OneDrive\DinoDominion\DinoDominion.apk
 */
export const APK_DOWNLOAD = {
  /** Set to true when friends should be able to download */
  available: true,

  /**
   * Download page for the APK.
   * Fresh Gofile upload (previous guest link expired).
   */
  apkUrl: 'https://gofile.io/d/FtXQwf',

  fileName: 'DinoDominion.apk',
  version: '0.1.2-beta',
  sizeLabel: '~2.6 GB',
  platform: 'Android',
  minAndroid: 'Android 8.0+',
  /** Shown under the button so friends know where the file is hosted */
  hostLabel: 'Gofile',
  notes:
    'Private friend beta. Opens Gofile — tap Download for DinoDominion.apk (~2.6 GB). If Gofile says the file is unavailable, tell us and we switch host. Wi‑Fi recommended. On Android, allow install from this browser when prompted.',
} as const
