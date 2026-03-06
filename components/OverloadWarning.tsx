'use client'

import { Task, ENERGY_VALUES } from '@/lib/types'

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

  // Smart suggestion: highest-energy nice task, falling back to highest-energy should task
  const nicePool = activeTasks.filter(t => t.priority === 'nice')
  const pool = nicePool.length > 0 ? nicePool : activeTasks.filter(t => t.priority === 'should')
  const suggestion = pool.length > 0
    ? [...pool].sort((a, b) => ENERGY_VALUES[b.energyCost] - ENERGY_VALUES[a.energyCost])[0]
    : null

  const message = isOver
    ? "You're over capacity. Your week isn't sustainable — something needs to move."
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
