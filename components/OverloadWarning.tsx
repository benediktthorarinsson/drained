'use client'

import { Task, ENERGY_VALUES, PRIORITY_ORDER } from '@/lib/types'

interface Props {
  tasks: Task[]
  budget: number
}

export default function OverloadWarning({ tasks, budget }: Props) {
  const activeTasks = tasks.filter(t => !t.done)
  const used = activeTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)
  const overBy = used - budget

  if (overBy <= 0) return null

  // Flag lowest-priority tasks first until we're back within budget
  const sorted = [...activeTasks].sort((a, b) => {
    const pa = PRIORITY_ORDER.indexOf(a.priority)
    const pb = PRIORITY_ORDER.indexOf(b.priority)
    return pb - pa // highest index = lowest priority first
  })

  const toDefer: Task[] = []
  let freed = 0
  for (const task of sorted) {
    if (freed >= overBy) break
    toDefer.push(task)
    freed += ENERGY_VALUES[task.energyCost]
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">⚡</span>
        <div>
          <h3 className="text-sm font-semibold text-amber-800">You&apos;re over capacity</h3>
          <p className="text-xs text-amber-600 mt-0.5">
            {overBy} pts over budget. Consider deferring these tasks:
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {toDefer.map(task => (
          <div key={task.id} className="flex items-center gap-2 text-xs text-amber-700">
            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="flex-1 truncate">{task.name}</span>
            <span className="text-amber-400 font-medium">{ENERGY_VALUES[task.energyCost]}pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
