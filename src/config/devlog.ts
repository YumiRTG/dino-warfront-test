import { asset } from '@/lib/assets'

/**
 * DEV PROGRESS HUB — edit this file to update the website log.
 *
 * Media:
 * 1) Drop images or clips into  public/dev/
 * 2) Reference them as  asset('dev/base-v2.png')
 * 3) Commit and push; Vercel redeploys on its own.
 */

export type DevShot = {
  src: string
  /** Set for .mp4 so the gallery renders a looping clip instead of an image. */
  video?: boolean
  caption: string
  note: string
  date?: string
  /** Give one item the wide slot at the top of the grid. */
  featured?: boolean
  /** object-position for the crop. */
  pos?: string
}

export type ProgressEntry = {
  id: string
  date: string
  title: string
  body: string
  tag?: 'shipped' | 'wip' | 'milestone'
}

export type FutureUpdate = {
  id: string
  title: string
  body: string
  status: 'planned' | 'in-progress' | 'soon'
}

/** Captures from the current build. Newest and best first. */
export const DEV_SCREENSHOTS: DevShot[] = [
  {
    src: asset('gameplay-heroes.mp4'),
    video: true,
    caption: 'The tribe',
    note: 'Cinematic from the world the campaign is set in.',
    date: 'Cinematic',
  },
  {
    src: asset('gameplay-troops.mp4'),
    video: true,
    caption: 'The war band',
    note: 'Cinematic. Infantry, shooters and riders are the three branches you actually field.',
    date: 'Cinematic',
  },
  {
    src: asset('env-base.png'),
    caption: 'The city',
    note: 'Your base, where production, research and training all live.',
    date: 'Current build',
    pos: 'center 45%',
    featured: true,
  },
  {
    src: asset('campaign-map.png'),
    caption: 'World map',
    note: 'Eight thousand units across, five danger rings, every base a real player.',
    date: 'Current build',
    pos: 'center 40%',
  },
  {
    src: asset('ui-hero-screen.png'),
    caption: 'Battle arena',
    note: 'Where campaign fights play out, under a volcano that is not decorative.',
    date: 'Current build',
    pos: 'center 45%',
  },
  {
    // Not spotlight-nyra.jpg: that file has "Nyra Vale" printed on it but shows
    // a different character entirely. hero-nyra.png is the real one.
    src: asset('hero-nyra.png'),
    caption: 'Nyra Vale',
    note: 'The tribe leader, and the hero the campaign is written around.',
    date: 'Current build',
    pos: 'center 18%',
  },
  {
    src: asset('env-base-2.png'),
    caption: 'City at dusk',
    note: 'Lighting pass on the base scene.',
    date: 'Current build',
    pos: 'center 50%',
  },
]

/** Progression log, newest first. */
export const PROGRESS_LOG: ProgressEntry[] = [
  {
    id: 'web-live-data',
    date: 'August 2026',
    title: 'The website went live',
    body: 'The site now reads the running server directly. Standings, alliance power and the arena ladders all come from the same documents the game writes, so what you see on the page is what is happening in the world right now.',
    tag: 'shipped',
  },
  {
    id: 'web-profiles',
    date: 'August 2026',
    title: 'Public commander and alliance pages',
    body: 'Every commander has a shareable profile: total power split across heroes, research and buildings, the army broken down by branch and tier, research completion and the city itself. Alliances get a page with their crest, standing and full roster.',
    tag: 'shipped',
  },
  {
    id: 'web-modes',
    date: 'August 2026',
    title: 'All four modes documented',
    body: 'Primeval Defense, both arena ladders, the world map and the campaign each got a page built from the real numbers in the build, including a live miniature of a defense run.',
    tag: 'shipped',
  },
  {
    id: 'mode-td',
    date: 'July 2026',
    title: 'Primeval Defense',
    body: 'A full real-time defense mode in its own 3D arena. Twelve stages, five towers at three tiers each, three difficulties, hero slots, a defense shop and a daily map that every player in the world runs on the same terms.',
    tag: 'shipped',
  },
  {
    id: 'mode-team-arena',
    date: 'July 2026',
    title: 'Team Arena 3x3',
    body: 'A second competitive ladder on top of the tactical arena. Nine heroes across three teams, played best of three, with its own rating and weekly season.',
    tag: 'shipped',
  },
  {
    id: 'mode-worldmap',
    date: 'June 2026',
    title: 'Shared world map',
    body: 'One persistent world where every base belongs to a player. Marches, gathering, scouting, garrisons, alliance territory and the rally boss at the centre.',
    tag: 'shipped',
  },
  {
    id: 'alliances',
    date: 'June 2026',
    title: 'Alliances, territory and quests',
    body: 'Alliance levels, shared research, a resource pool, daily quests and a tile-based territory system claimed outward from an alliance centre.',
    tag: 'shipped',
  },
  {
    id: 'perf',
    date: 'July 2026',
    title: 'Performance and memory pass',
    body: 'Android crashes traced to oversized model textures. Textures resized, a cache cap added, shader stripping fixed and the loading path reworked. The build runs on far more phones now.',
    tag: 'shipped',
  },
  {
    id: 'loc',
    date: 'June 2026',
    title: 'Four languages',
    body: 'German, English, French and Spanish across roughly 1,500 strings, switchable from settings.',
    tag: 'shipped',
  },
  {
    id: 'apk-beta',
    date: 'May 2026',
    title: 'Android friend beta',
    body: 'Private beta APK for friends. Install from the Download page; Wi-Fi recommended.',
    tag: 'shipped',
  },
  {
    id: 'core-loop',
    date: 'Ongoing',
    title: 'Balance and polish',
    body: 'Campaign difficulty, troop roles, hero kits and the economy keep moving with beta feedback.',
    tag: 'wip',
  },
  {
    id: 'vision',
    date: 'The start',
    title: 'Dino Warfront begins',
    body: 'Prehistoric strategy survival: raise a tribe under Nyra Vale, command apex predators, and take the map.',
    tag: 'milestone',
  },
]

/** Roadmap. Honest status only. */
export const FUTURE_UPDATES: FutureUpdate[] = [
  {
    id: 'nyra-story-quests',
    title: 'Nyra Vale story quests',
    body: 'Dedicated story quests for Nyra: her path, her choices, her command as the campaign deepens.',
    status: 'planned',
  },
  {
    id: 'world-bases',
    title: 'Player bases on the web map',
    body: 'Once bases sync to the shared world, the site can plot the real map with every base on it.',
    status: 'planned',
  },
  {
    id: 'gift-codes',
    title: 'Gift code redemption',
    body: 'Enter your Account ID and a code on the website, claim the reward in game.',
    status: 'planned',
  },
  {
    id: 'season-history',
    title: 'Season hall of fame',
    body: 'Arena seasons reset every Monday and that history disappears. Capturing each season keeps a permanent record.',
    status: 'planned',
  },
  {
    id: 'discord-forum',
    title: 'Discord and forum',
    body: 'Community channels for bug reports, squad talk and update announcements.',
    status: 'soon',
  },
  {
    id: 'apk-drops',
    title: 'Regular APK drops',
    body: 'New beta builds when major systems land, with version notes on this page.',
    status: 'in-progress',
  },
]
