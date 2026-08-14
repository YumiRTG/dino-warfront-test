/**
 * 7-day daily login cycle — itemType matches InventoryManager.ItemType
 */
export type DailyLoginReward = {
  day: number
  itemType: number
  amount: number
  label: string
  sublabel: string
}

export const DAILY_LOGIN_REWARDS: DailyLoginReward[] = [
  { day: 1, itemType: 15, amount: 3, label: '5 MIN ×3', sublabel: 'General speed up' },
  { day: 2, itemType: 0, amount: 2, label: '15 MIN ×2', sublabel: 'General speed up' },
  { day: 3, itemType: 28, amount: 2, label: 'BUILD 15M ×2', sublabel: 'Building speed up' },
  { day: 4, itemType: 16, amount: 1, label: '1 HOUR ×1', sublabel: 'General speed up' },
  { day: 5, itemType: 23, amount: 2, label: 'RESEARCH 15M ×2', sublabel: 'Research speed up' },
  { day: 6, itemType: 1, amount: 1, label: '3 HOURS ×1', sublabel: 'General speed up' },
  { day: 7, itemType: 2, amount: 1, label: '8 HOURS ×1', sublabel: 'General speed up' },
]

/** UTC calendar day key YYYY-MM-DD */
export function utcDateKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function previousUtcDateKey(d = new Date()): string {
  const prev = new Date(d.getTime() - 24 * 60 * 60 * 1000)
  return utcDateKey(prev)
}

export function rewardForStreakDay(streakDay: number): DailyLoginReward {
  const idx = ((Math.max(1, streakDay) - 1) % DAILY_LOGIN_REWARDS.length)
  return DAILY_LOGIN_REWARDS[idx]!
}

/** ms until next UTC midnight */
export function msUntilNextUtcMidnight(now = Date.now()): number {
  const d = new Date(now)
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
  return Math.max(0, next - now)
}
