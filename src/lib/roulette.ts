/**
 * Roulette prizes — itemType matches Unity InventoryManager.ItemType
 * Speed ups first (as requested).
 */
export type RoulettePrize = {
  id: string
  /** InventoryManager.ItemType index in the game */
  itemType: number
  amount: number
  label: string
  sublabel: string
  /** Relative weight for random selection */
  weight: number
  color: string
}

export const ROULETTE_PRIZES: RoulettePrize[] = [
  {
    id: 'gen-5m',
    itemType: 15,
    amount: 2,
    label: '5 MIN',
    sublabel: 'Speed Up ×2',
    weight: 22,
    color: '#3d6b4f',
  },
  {
    id: 'gen-15m',
    itemType: 0,
    amount: 1,
    label: '15 MIN',
    sublabel: 'Speed Up ×1',
    weight: 20,
    color: '#0a1610',
  },
  {
    id: 'gen-1h',
    itemType: 16,
    amount: 1,
    label: '1 HOUR',
    sublabel: 'Speed Up ×1',
    weight: 16,
    color: '#e85d04',
  },
  {
    id: 'gen-3h',
    itemType: 1,
    amount: 1,
    label: '3 HOURS',
    sublabel: 'Speed Up ×1',
    weight: 12,
    color: '#e9b44c',
  },
  {
    id: 'train-15m',
    itemType: 18,
    amount: 2,
    label: 'TRAIN 15M',
    sublabel: 'Speed Up ×2',
    weight: 10,
    color: '#1a3024',
  },
  {
    id: 'research-15m',
    itemType: 23,
    amount: 2,
    label: 'RESEARCH 15M',
    sublabel: 'Speed Up ×2',
    weight: 10,
    color: '#9b3a02',
  },
  {
    id: 'build-15m',
    itemType: 28,
    amount: 2,
    label: 'BUILD 15M',
    sublabel: 'Speed Up ×2',
    weight: 8,
    color: '#2f5d3a',
  },
  {
    id: 'gen-8h',
    itemType: 2,
    amount: 1,
    label: '8 HOURS',
    sublabel: 'Speed Up ×1',
    weight: 2,
    color: '#f0e6d0',
  },
]

export const SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 1 free spin per day

export function pickWeightedPrize(prizes: RoulettePrize[] = ROULETTE_PRIZES): RoulettePrize {
  const total = prizes.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const p of prizes) {
    r -= p.weight
    if (r <= 0) return p
  }
  return prizes[prizes.length - 1]!
}

export function prizeIndex(prize: RoulettePrize, prizes: RoulettePrize[] = ROULETTE_PRIZES): number {
  return prizes.findIndex((p) => p.id === prize.id)
}
