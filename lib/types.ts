export type Priority = 'must' | 'should' | 'nice'
export type EnergyCost = 'high' | 'medium' | 'low'

export const ENERGY_VALUES: Record<EnergyCost, number> = {
  high: 30,
  medium: 15,
  low: 5,
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  must: 'Must Do',
  should: 'Should Do',
  nice: 'Nice to Do',
}

export const PRIORITY_ORDER: Priority[] = ['nice', 'should', 'must']

export interface Task {
  id: string
  name: string
  priority: Priority
  energyCost: EnergyCost
  done: boolean
  createdAt: number
  deferred?: boolean // true if this task was carried over from a previous week
}

export interface WeekState {
  budget: number
  tasks: Task[]
  checkinDone: boolean
  checkinAdjustment: number
  weekStart: string // ISO date string of Monday
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export function getMeterStatus(used: number, budget: number): 'green' | 'yellow' | 'red' {
  const pct = budget > 0 ? (used / budget) * 100 : 0
  if (pct <= 60) return 'green'
  if (pct <= 85) return 'yellow'
  return 'red'
}

export function isCheckinDay(): boolean {
  const day = new Date().getDay()
  return day === 3 || day === 4 // Wednesday or Thursday
}
