'use client'

import { Task, Priority, ENERGY_VALUES, PRIORITY_LABELS, PRIORITY_ORDER } from '@/lib/types'

interface Props {
  tasks: Task[]
  flaggedIds: Set<string>
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onDefer: (id: string) => void
}

const PRIORITY_STYLES: Record<Priority, { dot: string; badge: string }> = {
  must: { dot: 'bg-rose-400', badge: 'bg-rose-50 text-rose-500 border-rose-100' },
  should: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-500 border-amber-100' },
  nice: { dot: 'bg-sage-400', badge: 'bg-sage-50 text-sage-600 border-sage-100' },
}

const ENERGY_STYLES = {
  high: 'text-rose-400',
  medium: 'text-amber-400',
  low: 'text-sage-400',
}

const PRIORITY_SECTION_LABELS: Record<Priority, string> = {
  must: 'Must Do',
  should: 'Should Do',
  nice: 'Nice to Do',
}

export default function TaskList({ tasks, flaggedIds, onToggle, onRemove, onDefer }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-300">
        <div className="text-4xl mb-3">🌿</div>
        <p className="text-sm">No tasks yet. Add one above.</p>
      </div>
    )
  }

  // Group by priority
  const groups = (['must', 'should', 'nice'] as Priority[]).map(p => ({
    priority: p,
    tasks: tasks.filter(t => t.priority === p),
  })).filter(g => g.tasks.length > 0)

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.priority}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[group.priority].dot}`} />
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {PRIORITY_SECTION_LABELS[group.priority]}
            </h4>
          </div>
          <div className="space-y-2">
            {group.tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                flagged={flaggedIds.has(task.id)}
                onToggle={onToggle}
                onRemove={onRemove}
                onDefer={onDefer}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskRow({
  task,
  flagged,
  onToggle,
  onRemove,
  onDefer,
}: {
  task: Task
  flagged: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onDefer: (id: string) => void
}) {
  const styles = PRIORITY_STYLES[task.priority]
  const energyPts = ENERGY_VALUES[task.energyCost]

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition ${
        task.done
          ? 'opacity-50 border-gray-100'
          : flagged
          ? 'border-amber-200 bg-amber-50/50'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
          task.done
            ? 'bg-sage-400 border-sage-400'
            : 'border-gray-300 hover:border-sage-400'
        }`}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-gray-800 truncate ${task.done ? 'line-through text-gray-400' : ''}`}>
          {task.name}
        </p>
        {task.deferred && (
          <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-50 text-sky-400 border border-sky-100">
            Deferred ↩
          </span>
        )}
        {flagged && !task.done && (
          <p className="text-[10px] text-amber-500 font-medium mt-0.5">Consider deferring</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-semibold ${ENERGY_STYLES[task.energyCost]}`}>
          {energyPts}pts
        </span>
        {!task.done && (
          <button
            onClick={() => onDefer(task.id)}
            className="opacity-0 group-hover:opacity-100 text-[11px] text-gray-300 hover:text-gray-500 transition whitespace-nowrap"
            aria-label="Defer to next week"
          >
            → Next week
          </button>
        )}
        <button
          onClick={() => onRemove(task.id)}
          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-rose-400 transition"
          aria-label="Remove task"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
