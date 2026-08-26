export interface MysterySet {
  label: string
  color: 'gold' | 'red'
  days: number[]
}

export const MYSTERY_SETS: MysterySet[] = [
  { label: 'Mystères Joyeux', color: 'gold', days: [1, 6] },
  { label: 'Mystères Lumineux', color: 'gold', days: [4] },
  { label: 'Mystères Douloureux', color: 'red', days: [2, 5] },
  { label: 'Mystères Glorieux', color: 'gold', days: [3, 0] },
]

export function getTodayMysterySet(date: Date): MysterySet {
  const day = date.getDay()
  return MYSTERY_SETS.find((s) => s.days.includes(day)) ?? MYSTERY_SETS[0]
}