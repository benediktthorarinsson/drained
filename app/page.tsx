'use client'

import { useMemo } from 'react'
import { useWeekState } from '@/lib/useWeekState'
import { ENERGY_VALUES, PRIORITY_ORDER, isCheckinDay } from '@/lib/types'
import CapacityMeter from '@/components/CapacityMeter'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import BudgetEditor from '@/components/BudgetEditor'
import OverloadWarning from '@/components/OverloadWarning'
import MidweekCheckin from '@/components/MidweekCheckin'

function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

export default function Home() {
  const { state, loaded, setBudget, addTask, removeTask, toggleTask, applyCheckin, resetWeek } = useWeekState()

  const flaggedIds = useMemo(() => {
    const activeTasks = state.tasks.filter(t => !t.done)
    const used = activeTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)
    const overBy = used - state.budget
    if (overBy <= 0) return new Set<string>()

    const sorted = [...activeTasks].sort((a, b) =>
      PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority)
    )

    const flagged = new Set<string>()
    let freed = 0
    for (const task of sorted) {
      if (freed >= overBy) break
      flagged.add(task.id)
      freed += ENERGY_VALUES[task.energyCost]
    }
    return flagged
  }, [state.tasks, state.budget])

  const showCheckin = isCheckinDay() && !state.checkinDone

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-sage-300 border-t-sage-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Drained</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Week of {getWeekLabel(state.weekStart)}
              </p>
            </div>
            <button
              onClick={() => { if (confirm('Start a fresh week? All tasks will be cleared.')) resetWeek() }}
              className="text-xs text-gray-300 hover:text-rose-400 transition"
            >
              Reset week
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {/* Hero: Capacity Meter */}
          <CapacityMeter tasks={state.tasks} budget={state.budget} />

          {/* Budget editor */}
          <BudgetEditor budget={state.budget} onSave={setBudget} />

          {/* Overload warning */}
          <OverloadWarning tasks={state.tasks} budget={state.budget} />

          {/* Mid-week check-in */}
          {showCheckin && (
            <MidweekCheckin
              done={state.checkinDone}
              onApply={reduction => applyCheckin(reduction)}
              onDismiss={() => applyCheckin(0)}
            />
          )}

          {/* Task form */}
          <TaskForm onAdd={addTask} />

          {/* Task list */}
          {state.tasks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  This week
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    {state.tasks.filter(t => t.done).length}/{state.tasks.length} done
                  </span>
                </h3>
              </div>
              <TaskList
                tasks={state.tasks}
                flaggedIds={flaggedIds}
                onToggle={toggleTask}
                onRemove={removeTask}
              />
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-300 py-4">
            Plan by energy, not just time.
          </p>
        </div>
      </div>
    </div>
  )
}
