import { asset } from '@/lib/assets'

/**
 * The four major modes, described from the actual build.
 * Numbers here mirror the game's config classes — keep them in sync when the
 * balancing changes (TdConfig, ArenaService, TeamArenaService, WorldMapZones,
 * CampaignMapUI.BuildDefaultChapters).
 */

export type ModeKey = 'tower-defense' | 'arena' | 'world-map' | 'campaign'

export type ModeSpec = { label: string; value: string }

export type Mode = {
  key: ModeKey
  to: string
  /** Short label for the mode switcher. */
  short: string
  name: string
  kicker: string
  tagline: string
  blurb: string
  /** Hero image + focal point. */
  img: string
  pos: string
  /** Accent colour driving glows, rules and diagram strokes on that page. */
  accent: string
  accentSoft: string
  /** Headline numbers under the hero. */
  specs: ModeSpec[]
  /** Where the mode is entered inside the game. */
  entry: string
  /** Unlock condition, plain language. */
  unlock: string
}

export const MODES: Mode[] = [
  {
    key: 'tower-defense',
    to: '/modes/tower-defense',
    short: 'Defense',
    name: 'Primeval Defense',
    kicker: 'Mode 01 · Real-time tower defense',
    tagline: 'Hold the line, or lose the herd',
    blurb:
      'A proper real-time defense mode with its own 3D arena. Wild packs come down one path and you decide what stands in their way. There are twelve stages to work through, plus a daily map that everyone in the world plays on the same day, under the same rules.',
    img: asset('modes/mode-defense.jpg'),
    pos: 'center center',
    accent: '#3dffb5',
    accentSoft: 'rgba(61,255,181,0.16)',
    specs: [
      { label: 'Stages', value: '12 + daily' },
      { label: 'Tower types', value: '5 × 3 tiers' },
      { label: 'Start lives', value: '20' },
      { label: 'Battle speed', value: '1× / 2× / 3×' },
    ],
    entry: 'The outer fence of your city, at the defense banner beside the palisade.',
    unlock: 'Open from the start. The normal stages are free and you can replay them as often as you like.',
  },
  {
    key: 'arena',
    to: '/modes/arena',
    short: 'Arena',
    name: 'The Arena',
    kicker: 'Mode 02 · Two competitive ladders',
    tagline: 'Two ladders, one reputation',
    blurb:
      'Hero versus hero against real players, on your own schedule. The Tactical Arena is one squad of three against somebody else’s defense. The Team Arena is bigger: nine heroes split into three teams, played as a best of three. Both reset every Monday and each keeps its own rating.',
    img: asset('modes/mode-arena.jpg'),
    pos: 'center center',
    accent: '#ff4d1a',
    accentSoft: 'rgba(255,77,26,0.18)',
    specs: [
      { label: 'Ladders', value: '1v1 · 3×3' },
      { label: 'Starting rating', value: '1000' },
      { label: 'Season', value: 'Weekly · Monday' },
      { label: 'Team Arena', value: '9 heroes, Bo3' },
    ],
    entry: 'The Arena building in your city.',
    unlock: 'Tactical Arena at Town Hall 12. Team Arena needs Town Hall 14 and nine unlocked heroes.',
  },
  {
    key: 'world-map',
    to: '/modes/world-map',
    short: 'World',
    name: 'The World Map',
    kicker: 'Mode 03 · Shared persistent world',
    tagline: 'Everyone out there is real',
    blurb:
      'One shared world, 8000 by 8000, where every base you can see belongs to a player. Five rings run from the quiet edge to the dangerous middle, and the rally boss sits right in the centre. You get there by sending marches: to farm, to hunt, to scout, to raid, to reinforce a friend, or to hold a piece of ground nobody has claimed.',
    img: asset('modes/mode-world.jpg'),
    pos: 'center 45%',
    accent: '#38e8ff',
    accentSoft: 'rgba(56,232,255,0.16)',
    specs: [
      { label: 'World', value: '8000 × 8000' },
      { label: 'Danger zones', value: '5 rings' },
      { label: 'March slots', value: '3 + flights' },
      { label: 'March capacity', value: 'up to 100k' },
    ],
    entry: 'The world map button on the city HUD.',
    unlock: 'Your base gets placed for you, out in the safe ring, the first time you open the map.',
  },
  {
    key: 'campaign',
    to: '/modes/campaign',
    short: 'Campaign',
    name: 'The Campaign',
    kicker: 'Mode 04 · Story PvE',
    tagline: 'Nine regions, seventy-eight stages',
    blurb:
      'The solo road through the prehistoric world. Nine regions, each with its own terrain and its own enemies, each ending on a boss. Four difficulties sit on the same map, and the stars start over on every one of them, so clearing it once is really only the first pass.',
    img: asset('hero-dino-volcano.jpg'),
    pos: 'center center',
    accent: '#f0c14d',
    accentSoft: 'rgba(240,193,77,0.16)',
    specs: [
      { label: 'Regions', value: '9' },
      { label: 'Stages', value: '78' },
      { label: 'Difficulties', value: '4' },
      { label: 'Bosses', value: 'One per region' },
    ],
    entry: 'The campaign map from the city.',
    unlock: 'Open in your first hour. Every stage needs the one before it.',
  },
]

export const MODE_BY_KEY: Record<ModeKey, Mode> = MODES.reduce(
  (acc, m) => ({ ...acc, [m.key]: m }),
  {} as Record<ModeKey, Mode>,
)

// ─── Tower defense ──────────────────────────────────────────────────────────

export const TD_TOWERS = [
  {
    name: 'Dilophosaurus',
    role: 'Damage over time',
    text: 'Spits venom, and every hit leaves a poison stack that keeps ticking after the target walks away. Cheap to put down, and very good against the slow, heavy stuff.',
    stat: '120 gold · 12.5 range',
    img: asset('dino-dilo.png'),
  },
  {
    name: 'Fire Dragon',
    role: 'Ground denial',
    text: 'One breath roughly every three seconds, and the flames stay on the ground afterwards. Put it on a bend so the whole wave has to walk through the fire.',
    stat: '200 gold · burning field',
    img: asset('dino-dragon.png'),
  },
  {
    name: 'Sky Nest',
    role: 'Global reach',
    text: 'A Pteranodon takes off, circles whatever is furthest along the path and drops bombs on it. It reaches anywhere on the map, but it does not hit nearly as hard as the ground towers.',
    stat: '280 gold · map-wide',
    img: asset('dino-ptera.png'),
  },
  {
    name: 'Radar Station',
    role: 'Single-target burst',
    text: 'An archer on the platform. No splash and no gimmick, just the hardest single shot in the mode and enough range to cover two stretches of path.',
    stat: '165 gold · 136 dmg at tier 3',
    img: asset('icon-shooter.png'),
  },
  {
    name: 'Ice Fortress',
    role: 'Control',
    text: 'It never shoots. It pulses cold across its whole radius, slows everything by up to 78% and sometimes freezes outright. Upgrading shortens the gap between pulses, which is when it finally stops leaking runners.',
    stat: '175 gold · 42% freeze at tier 3',
    img: asset('realm-ice.png'),
  },
]

export const TD_ENEMIES = [
  { name: 'Compso', role: 'Runner', text: 'Fast, fragile, and never alone. Slow single-target towers hate them.' },
  { name: 'Sinosaurus', role: 'Sprinter', text: 'More than twice normal speed with barely any health. One hit is enough, if you can land it.' },
  { name: 'Raptor', role: 'Standard', text: 'The baseline everything else is measured against.' },
  { name: 'Wolf pack', role: 'Swarm', text: 'Quick and constant. If your layout has no splash damage anywhere, this is where it shows.' },
  { name: 'Alligator', role: 'Armored', text: 'Slow and thick, and it takes two lives with it if it gets past you.' },
  { name: 'Krag', role: 'Brute', text: 'Nearly triple health at two thirds speed. Pays out well when it finally goes down.' },
  { name: 'Stegosaurus', role: 'Bulwark', text: 'The wall. 4.6× health, half speed, three lives if it leaks. Burst damage alone will not do it.' },
  { name: 'Tyrant', role: 'Boss', text: 'Sixteen times a raptor’s health and five lives if it reaches the gate. Usually the last thing you see on a stage.' },
]

export const TD_LOOP = [
  {
    step: '01',
    title: 'Pick a map and a difficulty',
    text: 'Twelve stages, three difficulties. Easy gives you eight extra lives and a quarter more starting gold. Hard takes six lives off you and gives enemies 55% more health, but it pays 170% of the marks.',
  },
  {
    step: '02',
    title: 'Buy ground before wave one',
    text: 'You start with 260 gold and twelve seconds of prep. The path is already drawn, so where you build matters more than what you build.',
  },
  {
    step: '03',
    title: 'Slot your heroes',
    text: 'Three hero slots add damage based on hero power, with a bit extra when the hero suits the tower type. Legendary heroes sitting on the bench still count for something, up to a cap.',
  },
  {
    step: '04',
    title: 'Fight, upgrade, sell',
    text: 'Kills and cleared waves pay gold. Every tower goes up three tiers, and selling gives back 60% of what you spent, so a bad opening is fixable. A bad mid-game usually is not.',
  },
  {
    step: '05',
    title: 'Bank the stars',
    text: 'Three stars means you did not lose a single life. Two means you kept 60% of them. The marks go into the defense shop and the manager skill tree.',
  },
]

// ─── Arena ──────────────────────────────────────────────────────────────────

export const ARENA_MODES = [
  {
    id: 'tactical',
    name: 'Tactical Arena',
    format: '1 v 1 · three heroes',
    text: 'You pick three heroes for defense and the game stores that line-up. Other players attack it while you are offline, and you go after theirs. When you win, the points come straight out of the defender. When you lose, nothing happens to your rating.',
    points: [
      'Three heroes on defense, three on attack',
      'Rating starts at 1000 and moves between players',
      'Losing an attack does not cost you points',
      'Every defense you lose shows up as mail, with who did it',
      'A daily reward based on where you sit',
    ],
    unlock: 'Arena building · Town Hall 12',
    tickets: '5 free attacks a day, more for amber',
    img: asset('hero-nyra.png'),
  },
  {
    id: 'team',
    name: 'Team Arena 3×3',
    format: 'Best of three · nine heroes',
    text: 'Three teams of three, and no hero can appear twice. An attack plays up to three rounds: your first team against theirs, then the second, then the third. Every round starts at full health and two wins take the match, so at 2:0 the third never happens.',
    points: [
      'Nine different heroes across three teams',
      'Each round starts fresh at full health',
      'First to two round wins takes the match',
      'Its own ladder, its own rating and rewards',
      'Same weekly reset as the Tactical Arena',
    ],
    unlock: 'Nine heroes unlocked · Town Hall 14',
    tickets: '3 matches a day at release, more for amber',
    img: asset('hero-carina.png'),
  },
]

export const ARENA_SEASON = [
  {
    title: 'Weekly seasons',
    text: 'A season runs Monday to Monday. When it turns over your placement reward arrives by mail and everyone drops back to 1000, so nobody coasts on last week.',
  },
  {
    title: 'You never wait for anyone',
    text: 'Your opponent does not have to be online. Their defense is stored, your attack is fought against it live, and both ladders are built so being away does not punish you.',
  },
  {
    title: 'Defense reports back',
    text: 'Every hit on your base is logged. Next time you open the Arena it turns into mail: who attacked, what they brought, what it cost you.',
  },
  {
    title: 'Attempts, not grinding',
    text: 'You get a set number of attacks a day. It keeps the ladder about who plays well rather than who has the most spare hours. Extra runs cost amber and are capped.',
  },
]

// ─── World map ──────────────────────────────────────────────────────────────

export const WM_ZONES = [
  { zone: 'Zone 1', name: 'The outer wilds', text: 'Where your base lands. Small monsters, safe farms, plenty of room.' },
  { zone: 'Zone 2', name: 'The contested belt', text: 'Better nodes, and the first players who will actually come and take them.' },
  { zone: 'Zone 3', name: 'The middle ring', text: 'Alliance ground starts to matter here. You are not holding anything alone.' },
  { zone: 'Zone 4', name: 'The inner ring', text: 'High-level monsters and high-level loot, with marches long enough that people see you coming.' },
  { zone: 'Zone 5', name: 'The centre', text: 'The rally boss. A Spinosaurus no single player is taking down, back on its feet ten minutes after it drops.' },
]

export const WM_MARCHES = [
  { name: 'Attack monster', cost: '10 stamina', text: 'Hunt the wild creatures. They get stronger the closer to the middle they stand.' },
  { name: 'Gather', cost: 'Free', text: 'Park troops on a node until it is stripped. Inside your own alliance ground a fifth of it goes to the shared pool.' },
  { name: 'Rally boss', cost: '15 stamina', text: 'A joint march on the centre boss. Alliance members join before it launches.' },
  { name: 'Attack player', cost: 'March slot', text: 'Hit a rival base. Their defense power decides how it goes, and the loot is real.' },
  { name: 'Scout', cost: 'Free flight', text: 'A Pterodactyl flies over, uncovers the base and mails you the report. Does not use a march slot.' },
  { name: 'Rescue mission', cost: 'Free flight', text: 'Radar missions flown by air. Extra marches that bring troops home instead of into a fight.' },
  { name: 'Reinforce ally', cost: 'One-way', text: 'Garrison a friend. If your garrison is stronger than their home defense, yours is what the attacker runs into.' },
  { name: 'Assist construction', cost: 'Round trip', text: 'Send troops to an alliance building site. The more you send, the faster it finishes.' },
  { name: 'Occupy tile', cost: 'Indefinite', text: 'Plant an outpost and sit on the ground until you call the troops back.' },
  { name: 'Attack outpost', cost: 'March slot', text: 'Break someone else’s outpost. No shield covers it and there is nothing stored there to loot, so this one is only about the ground.' },
]

export const WM_SYSTEMS = [
  {
    title: 'March capacity',
    text: 'Ten thousand troops to start, two thousand more per alliance centre level and seven thousand per capacity research. At the top end that is a hundred thousand in one march.',
  },
  {
    title: 'Three slots',
    text: 'Three ground marches at a time. Scouts and rescue flights sit outside that limit, which is why information is cheap on this map and force never is.',
  },
  {
    title: 'Stamina',
    text: 'Ten for a monster, fifteen for a rally, nothing at all for gathering. You get a point back every three minutes.',
  },
  {
    title: 'Radar',
    text: 'Goes up to level 15, runs eight missions at once and stores sixteen. It keeps earning while you are doing something else.',
  },
  {
    title: 'Shields',
    text: 'Eight hours or seventy-two, paid in amber. A shield covers your base. It does not cover an outpost you left standing in the open.',
  },
  {
    title: 'Alliance territory',
    text: 'Tiles claimed outward from an alliance centre and extended with flags, paid from the shared pool. Research pushes the cap from twenty tiles up to a hundred.',
  },
]

// ─── Campaign ───────────────────────────────────────────────────────────────

export const CAMPAIGN_REGIONS = [
  { name: 'Beginner Steppe', stages: 6, img: asset('campaign-1.png'), text: 'Open ground and forgiving fights. This is where you find out what a formation actually does.' },
  { name: 'Grazer Lands', stages: 8, img: asset('realm-herbivore.png'), text: 'Herds that hit back, and the first stages that punish a squad built only for damage.' },
  { name: 'Volcano Crater', stages: 8, img: asset('campaign-volcano.png'), text: 'Fire, ash, and enemies that trade with you evenly. Bring healing.' },
  { name: 'Dino Base Camp', stages: 8, img: asset('realm-base.png'), text: 'The first enemies that fight like an army instead of a pack.' },
  { name: 'Poison Swamp', stages: 8, img: asset('realm-poison.png'), text: 'Damage over time everywhere. These fights are won on staying power, not on the opening round.' },
  { name: "Warrior's Path", stages: 8, img: asset('realm-soldier.png'), text: 'Elite fighters in tight formation. If your roster is under-levelled, this is the wall.' },
  { name: 'Ice Fortress', stages: 10, img: asset('campaign-ice.png'), text: 'Ten stages of hard defense. Equipment stops being optional around here.' },
  { name: 'Mage Highlands', stages: 10, img: asset('realm-mage.png'), text: 'Skill-heavy enemies that can break a slow squad before it gets going.' },
  { name: 'Primeval Coast', stages: 12, img: asset('campaign-water.png'), text: 'Twelve stages and the final boss. Everything the campaign taught you, all at once.' },
]

export const CAMPAIGN_DIFFICULTIES = [
  { name: 'Easy', text: 'A safety net. Enemies sit at about a third of their normal values, for accounts that have not put much into heroes yet.' },
  { name: 'Normal', text: 'Built around the roster you should have when you get there.' },
  { name: 'Hard', text: 'Built for finished heroes: max level, full stars, upgraded gear. You can win it, but it will not feel comfortable.' },
  { name: 'Extreme', text: 'The edge of what is possible. You need a complete roster and clean skill timing, and your heroes will not survive many hits.' },
]

export const CAMPAIGN_LOOP = [
  { step: '01', title: 'Choose the stage', text: 'Regions open in order and every stage needs the one before it. The last stage of a region is always a boss.' },
  { step: '02', title: 'Build the squad', text: 'Heroes, dinosaurs and troops. Roles carry the fight: tanks soak the opening, strikers finish it, support keeps the line up.' },
  { step: '03', title: 'Fight', text: 'Turn-based hero combat with skills and ultimates, at a battle speed you set. Stamina decides how much you play in a day, not the map.' },
  { step: '04', title: 'Collect stars', text: 'Three stars a stage, tracked separately on every difficulty. Finishing Normal leaves the whole map open again on Hard.' },
  { step: '05', title: 'Sweep and idle', text: 'Cleared stages can be swept instead of replayed, and your progress keeps paying out while the app is shut.' },
]
