import { asset } from '@/lib/assets'

/**
 * Public live game data.
 *
 * Production uses /api/live behind Vercel's edge cache. The GitHub Pages test
 * build has no serverless runtime, so its deploy workflow fetches that already
 * cached endpoint once and publishes the result as a static JSON snapshot. This
 * keeps the test site functional without making every tester a Firestore reader.
 */

const SNAPSHOT_URL = import.meta.env.VITE_LIVE_SNAPSHOT_URL || '/api/live'
const CACHE_KEY = 'dd_live_snapshot_v3'
const CACHE_MS = 20 * 60 * 1000

type RawHero = { id: string; name: string; power: number }
type RawFighter = {
  token: string
  name: string
  points: number
  wins: number
  losses: number
  defensePower: number
  isBot: boolean
  avatar: number
  heroes: RawHero[]
  teamPower: number[]
}
type RawRank = { token: string; name: string; value: number; detail?: string; avatar: number }

type Snapshot = {
  generatedAt: number
  error?: string
  pulse: {
    commanders: number
    alliances: number
    troopKills: number
    topPower: number
    lastSeenMinutes: number | null
  }
  ranks: Record<string, RawRank[]>
  arena: RawFighter[]
  teamArena: RawFighter[]
  alliances: {
    id: string
    name: string
    tag: string
    power: number
    members: number
    level: number
    exp: number
    color: string
  }[]
}

let inflight: Promise<Snapshot> | null = null

function readCache(): Snapshot | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; data: Snapshot }
    if (Date.now() - parsed.at > CACHE_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

export function clearSnapshotCache(): void {
  inflight = null
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch {
    // Nothing to clear.
  }
}

/** One request per tab/cache window; production CDN or static test JSON does the rest. */
export function getSnapshot(): Promise<Snapshot> {
  if (inflight) return inflight

  const cached = readCache()
  if (cached) {
    inflight = Promise.resolve(cached)
    return inflight
  }

  inflight = fetch(SNAPSHOT_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`live snapshot ${r.status}`)
      return r.json() as Promise<Snapshot>
    })
    .then((data) => {
      if (data.error) throw new Error(data.error)
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
      } catch {
        // Private mode or a full quota; the in-memory cache still holds.
      }
      return data
    })
    .catch((err) => {
      inflight = null
      throw err
    })

  return inflight
}

// ─── Season clock ───────────────────────────────────────────────────────────

const SEASON_EPOCH = Date.UTC(2026, 0, 5, 0, 0, 0)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function currentSeason(now = Date.now()): number {
  return Math.max(0, Math.floor((now - SEASON_EPOCH) / WEEK_MS))
}

export function seasonEndsAt(now = Date.now()): number {
  return SEASON_EPOCH + (currentSeason(now) + 1) * WEEK_MS
}

export function seasonRemaining(now = Date.now()) {
  const ms = Math.max(0, seasonEndsAt(now) - now)
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const HERO_ART: Record<string, string> = {
  tyranno: 'dino-tyranno.png',
  raptor: 'dino-raptor.png',
  dragon: 'dino-dragon.png',
  dilo: 'dino-dilo.png',
  mammoth: 'dino-mammoth.png',
  stegosaurus: 'dino-stego.png',
  smilodon: 'dino-smilodon.png',
  triceratops: 'dino-triceratops.png',
  pterodactyl: 'dino-ptera.png',
  allosaurus: 'dino-allo.png',
  paralophosaurus: 'dino-para.png',
  nyra_vale: 'hero-nyra.png',
  carina_vale: 'hero-carina.png',
  alissa_mey: 'hero-alyssa.png',
  elara_veyn: 'hero-elara.png',
  kailina: 'hero-kailina.png',
  ronan: 'hero-ronan.png',
}

export function heroArt(heroId: string | undefined): string {
  const key = (heroId || '').toLowerCase()
  return asset(HERO_ART[key] ?? 'hero-warrior.png')
}

function avatarPath(iconId: unknown, fallbackSeed: string): string {
  const raw = typeof iconId === 'string' ? iconId.replace(/\D+/g, '') : String(iconId ?? '')
  const n = Number(raw)
  if (Number.isFinite(n) && n >= 1 && n <= 10) return asset(`avatars/avatar${n}.jpg`)
  let hash = 0
  for (let i = 0; i < fallbackSeed.length; i++) hash = (hash * 31 + fallbackSeed.charCodeAt(i)) >>> 0
  return asset(`avatars/avatar${(hash % 10) + 1}.jpg`)
}

export type ServerPulse = {
  commanders: number
  alliances: number
  troopKills: number
  topPower: number
  season: number
  lastSeenMinutes: number | null
}

export async function getServerPulse(): Promise<ServerPulse> {
  const s = await getSnapshot()
  return { ...s.pulse, season: currentSeason() }
}

export type ArenaHero = { id: string; name: string; power: number; art: string }

export type ArenaFighter = {
  token: string
  name: string
  points: number
  wins: number
  losses: number
  defensePower: number
  isBot: boolean
  avatar: string
  heroes: ArenaHero[]
  teamPower: number[]
}

function toFighter(f: RawFighter): ArenaFighter {
  return {
    ...f,
    avatar: avatarPath(f.avatar, f.token),
    heroes: f.heroes.map((h) => ({ ...h, art: heroArt(h.id) })),
  }
}

export async function getArenaLadder(count = 5): Promise<ArenaFighter[]> {
  const s = await getSnapshot()
  return s.arena.slice(0, count).map(toFighter)
}

export async function getTeamArenaLadder(count = 5): Promise<ArenaFighter[]> {
  const s = await getSnapshot()
  return s.teamArena.slice(0, count).map(toFighter)
}

export type AllianceEntry = {
  id: string
  name: string
  tag: string
  power: number
  members: number
  level: number
  exp: number
  color: string
}

export async function getTopAlliances(count = 6): Promise<AllianceEntry[]> {
  const s = await getSnapshot()
  return s.alliances.slice(0, count)
}

export async function getRankRows(categoryId: string): Promise<RawRank[]> {
  const s = await getSnapshot()
  return s.ranks[categoryId] ?? []
}

export function avatarUrl(iconIndex: number, seed: string): string {
  return avatarPath(iconIndex, seed)
}

export function compact(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`
  if (v >= 10_000) return `${Math.round(v / 1000)}K`
  return v.toLocaleString('en-US')
}
