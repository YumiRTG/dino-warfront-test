import { avatarUrl, getRankRows } from '@/lib/live'

/**
 * Live leaderboard over the same `players` documents the Unity client writes
 * (SaveSystem.MirrorToCloud + RankingService.AppendCloudFields).
 *
 * Rows arrive inside the shared /api/live snapshot, which the CDN holds for
 * twenty minutes, so switching category or refreshing costs no database reads.
 */

export type RankCategory = {
  id: string
  label: string
  /** Field on players/{uid} to sort by. */
  field: string
  /** Optional second field shown next to the value. */
  detailField?: string
  /** Short unit shown under the number on the champion card. */
  unit: string
  blurb: string
}

export const RANK_CATEGORIES: RankCategory[] = [
  {
    id: 'power',
    label: 'Power',
    field: 'totalScore',
    unit: 'Total power',
    blurb: 'Everything counted at once: buildings, research, troops and heroes.',
  },
  {
    id: 'hero',
    label: 'Strongest hero',
    field: 'heroPowerBest',
    detailField: 'heroBestName',
    unit: 'Hero power',
    blurb: 'The single best hero on the account, not the whole roster.',
  },
  {
    id: 'townhall',
    label: 'Town Hall',
    field: 'townHallLevel',
    unit: 'Town Hall level',
    blurb: 'How far the city itself has been pushed.',
  },
  {
    id: 'kills',
    label: 'Troop kills',
    field: 'troopKills',
    unit: 'Enemy troops killed',
    blurb: 'Lifetime kills across the campaign, the arena and the world map.',
  },
]

export type RankEntry = {
  /** Opaque profile token, not the Account ID. */
  token: string
  name: string
  value: number
  detail?: string
  /** Player's chosen profile icon, already resolved to a web path. */
  avatar: string
}

export async function getTopPlayers(cat: RankCategory, count = 10): Promise<RankEntry[]> {
  const rows = await getRankRows(cat.id)
  return rows.slice(0, count).map((r) => ({
    token: r.token,
    name: r.name,
    value: r.value,
    detail: r.detail,
    avatar: avatarUrl(r.avatar, r.token),
  }))
}

export function formatRankValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`
  if (v >= 10_000) return `${Math.round(v / 1000)}K`
  return v.toLocaleString('en-US')
}
