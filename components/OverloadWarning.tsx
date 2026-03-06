'use client'

import { Task, ENERGY_VALUES, PRIORITY_ORDER } from '@/lib/types'

interface Props {
  tasks: Task[]
  budget: number
  onDefer: (id: string) => void
}

export default function OverloadWarning({ tasks, budget, onDefer }: Props) {
  const activeTasks = tasks.filter(t => !t.done)
  const used = activeTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)
  const pct = budget > 0 ? (used / budget) * 100 : 0
  const isOver = used > budget

  if (pct <= 85) return null

  // Smart suggestion: lowest priority first (nice → should → must), highest energy as tiebreaker
  const suggestion = activeTasks.length > 0
    ? [...activeTasks].sort((a, b) => {
        const pa = PRIORITY_ORDER.indexOf(a.priority) // nice=0, should=1, must=2
        const pb = PRIORITY_ORDER.indexOf(b.priority)
        if (pa !== pb) return pa - pb // lowest priority index first (nice before should)
        return ENERGY_VALUES[b.energyCost] - ENERGY_VALUES[a.energyCost]
      })[0]
    : null

  const message = isOver
    ? "Your week is looking pretty packed. It might be worth letting something go."
    : "You're cutting it close. Consider moving a Nice to Do task to next week."

  const s = isOver
    ? { wrap: 'bg-rose-50 border-rose-200',   heading: 'text-rose-800',  sub: 'text-rose-600',  pts: 'text-rose-400',  btn: 'text-rose-600 hover:text-rose-800' }
    : { wrap: 'bg-amber-50 border-amber-200', heading: 'text-amber-800', sub: 'text-amber-600', pts: 'text-amber-400', btn: 'text-amber-600 hover:text-amber-800' }

  return (
    <div className={`rounded-2xl border ${s.wrap} px-5 py-4`}>
      <p className={`text-sm font-medium ${s.heading} leading-snug`}>{message}</p>

      {suggestion && (
        <div className={`flex items-center justify-between mt-3 text-xs ${s.sub}`}>
          <span className="truncate">
            Consider deferring:{' '}
            <span className="font-medium">{suggestion.name}</span>
            <span className={`ml-1 ${s.pts}`}>· {ENERGY_VALUES[suggestion.energyCost]}pts</span>
          </span>
          <button
            onClick={() => onDefer(suggestion.id)}
            className={`ml-4 font-medium transition shrink-0 ${s.btn}`}
          >
            → Defer it
          </button>
        </div>
      )}
    </div>
  )
}
