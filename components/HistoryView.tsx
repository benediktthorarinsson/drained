'use client'

import { useEffect, useState } from 'react'
import { Task, ENERGY_VALUES, getMeterStatus } from '@/lib/types'

type EnergyRating = 'exhausted' | 'drained' | 'okay' | 'good' | 'energised'
type CapacityMatch = 'too-much' | 'about-right' | 'more-in-me'

interface WeekHistory {
  weekStart: string
  budget: number
  tasks: Task[]
  savedAt: number
}

interface ReflectionData {
  energy: EnergyRating
  capacityMatch: CapacityMatch
  takeaway: string
}

interface HistoryEntry {
  history: WeekHistory
  reflection: ReflectionData | null
}

const ENERGY_LABELS: Record<EnergyRating, { emoji: string; label: string }> = {
  exhausted: { emoji: '😴', label: 'Exhausted' },
  drained:   { emoji: '😓', label: 'Drained'   },
  okay:      { emoji: '😐', label: 'Okay'       },
  good:      { emoji: '😊', label: 'Good'       },
  energised: { emoji: '⚡', label: 'Energised'  },
}

const CAPACITY_LABELS: Record<CapacityMatch, string> = {
  'too-much':    'I took on too much',
  'about-right': 'About right',
  'more-in-me':  'I had more in me',
}

function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

function MiniCapacityBar({ used, budget }: { used: number; budget: number }) {
  const pct = budget > 0 ? Math.min((used / budget) * 100, 100) : 0
  const status = getMeterStatus(used, budget)
  const barColor =
    status === 'green'  ? 'bg-sage-400'  :
    status === 'yellow' ? 'bg-amber-400' :
    'bg-rose-400'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-meter ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 tabular-nums shrink-0">{used} / {budget} pts</span>
    </div>
  )
}

interface Props {
  onBack: () => void
}

export default function HistoryView({ onBack }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const result: HistoryEntry[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key?.startsWith('drained-history-')) continue
        const raw = localStorage.getItem(key)
        if (!raw) continue
        const history: WeekHistory = JSON.parse(raw)
        const reflectionRaw = localStorage.getItem(`reflection_${history.weekStart}`)
        const reflection: ReflectionData | null = reflectionRaw ? JSON.parse(reflectionRaw) : null
        result.push({ history, reflection })
      }
    } catch {}
    result.sort((a, b) => b.history.weekStart.localeCompare(a.history.weekStart))
    setEntries(result)
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Past weeks</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                A quiet record of how you&apos;ve been spending energy.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-300 hover:text-gray-500 transition"
            >
              ← Back
            </button>
          </div>
        </header>

        {/* Content */}
        {!loaded ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-sage-300 border-t-sage-500 animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 space-y-2">
            <p className="text-gray-400 text-sm leading-relaxed">
              Your completed weeks will appear here.
            </p>
            <p className="text-gray-300 text-sm">
              Reset your first week to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(({ history, reflection }) => {
              const doneTasks = history.tasks.filter(t => t.done)
              const totalTasks = history.tasks.length
              const pointsPlanned = history.tasks.reduce(
                (sum, t) => sum + ENERGY_VALUES[t.energyCost], 0
              )

              return (
                <div
                  key={history.weekStart}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4"
                >
                  {/* Week label */}
                  <h3 className="text-sm font-semibold text-gray-700">
                    {getWeekLabel(history.weekStart)}
                  </h3>

                  {/* Capacity bar */}
                  <MiniCapacityBar used={pointsPlanned} budget={history.budget} />

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span>{doneTasks.length}/{totalTasks} tasks done</span>
                    {reflection ? (
                      <>
                        <span className="text-gray-200" aria-hidden>·</span>
                        <span>
                          {ENERGY_LABELS[reflection.energy].emoji}{' '}
                          {ENERGY_LABELS[reflection.energy].label}
                        </span>
                        <span className="text-gray-200" aria-hidden>·</span>
                        <span>{CAPACITY_LABELS[reflection.capacityMatch]}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-200" aria-hidden>·</span>
                        <span className="text-gray-300 italic">No reflection recorded</span>
                      </>
                    )}
                  </div>

                  {/* Takeaway note */}
                  {reflection?.takeaway && (
                    <p className="text-xs text-gray-400 italic border-l-2 border-gray-100 pl-3 leading-relaxed">
                      &ldquo;{reflection.takeaway}&rdquo;
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
