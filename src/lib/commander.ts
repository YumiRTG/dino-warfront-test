import { asset } from '@/lib/assets'
import { clearSnapshotCache } from '@/lib/live'

/**
 * Public commander and alliance profiles.
 *
 * These no longer touch Firestore from the browser. The Account ID is the
 * website's login credential (login is passwordless by design), so it must
 * never appear in a URL or in anything the browser receives. Profile links
 * carry an opaque token; the server decrypts it, reads Firestore, and returns
 * a profile with no Account ID in it. See api/_token.js.
 */

function num(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  return 0
}

function avatarPath(index: unknown): string {
  const n = num(index)
  return asset(`avatars/avatar${n >= 1 && n <= 10 ? Math.trunc(n) : 1}.jpg`)
}

const BRANCH_ICON: Record<string, string> = {
  inf: 'icon-infantry.png',
  sht: 'icon-shooter.png',
  rid: 'icon-rider.png',
}

export type TroopBranch = {
  key: 'inf' | 'sht' | 'rid'
  label: string
  total: number
  tiers: number[]
  icon: string
}

export type CityBuilding = { name: string; level: number; count: number }

export type CommanderAlliance = { id: string; name: string; tag: string; color: string }

export type Commander = {
  name: string
  avatar: string
  totalScore: number
  townHallLevel: number
  heroPowerBest: number
  heroBestName: string
  heroPowerTotal: number
  researchPower: number
  buildingPower: number
  troopKills: number
  /** Pre-formatted server-side; components must stay pure. */
  seenLabel: string | null
  alliance: CommanderAlliance | null
  troops: TroopBranch[]
  research: { levels: number[]; done: number; max: number }
  city: { buildings: CityBuilding[]; total: number }
}

export async function getCommander(token: string): Promise<Commander | null> {
  const res = await fetch(`/api/commander?token=${encodeURIComponent(token)}`)
  if (!res.ok) {
    // Most likely a token minted before the server secret was rotated. Drop the
    // cached snapshot so the next page load gets links that actually work.
    if (res.status === 404) clearSnapshotCache()
    return null
  }
  const d = (await res.json()) as Record<string, unknown>
  if (!d || d.error) return null

  return {
    name: String(d.name ?? 'Unnamed commander'),
    avatar: avatarPath(d.avatar),
    totalScore: num(d.totalScore),
    townHallLevel: num(d.townHallLevel),
    heroPowerBest: num(d.heroPowerBest),
    heroBestName: String(d.heroBestName ?? ''),
    heroPowerTotal: num(d.heroPowerTotal),
    researchPower: num(d.researchPower),
    buildingPower: num(d.buildingPower),
    troopKills: num(d.troopKills),
    seenLabel: (d.seenLabel as string | null) ?? null,
    alliance: (d.alliance as CommanderAlliance | null) ?? null,
    troops: ((d.troops as TroopBranch[]) ?? []).map((b) => ({
      ...b,
      icon: asset(BRANCH_ICON[b.key] ?? 'icon-infantry.png'),
    })),
    research: (d.research as Commander['research']) ?? { levels: [], done: 0, max: 0 },
    city: (d.city as Commander['city']) ?? { buildings: [], total: 0 },
  }
}

// ─── Alliance ───────────────────────────────────────────────────────────────

export type AllianceMember = {
  /** Opaque profile token, not the Account ID. */
  token: string
  name: string
  avatar: string
  role: string
  power: number
  techContributed: number
}

export type Alliance = {
  id: string
  name: string
  tag: string
  color: string
  level: number
  exp: number
  power: number
  memberCount: number
  description: string
  members: AllianceMember[]
}

export async function getAlliance(id: string): Promise<Alliance | null> {
  const res = await fetch(`/api/alliance?id=${encodeURIComponent(id)}`)
  if (!res.ok) return null
  const d = (await res.json()) as Record<string, unknown>
  if (!d || d.error) return null

  return {
    id: String(d.id ?? id),
    name: String(d.name ?? 'Unnamed alliance'),
    tag: String(d.tag ?? '???'),
    color: String(d.color ?? '#f0c14d'),
    level: num(d.level) || 1,
    exp: num(d.exp),
    power: num(d.power),
    memberCount: num(d.memberCount),
    description: String(d.description ?? ''),
    members: ((d.members as Record<string, unknown>[]) ?? []).map((m) => ({
      token: String(m.token ?? ''),
      name: String(m.name ?? 'Commander'),
      avatar: avatarPath(m.avatar),
      role: String(m.role ?? 'Member'),
      power: num(m.power),
      techContributed: num(m.techContributed),
    })),
  }
}
