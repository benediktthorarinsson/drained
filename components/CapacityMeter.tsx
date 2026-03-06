'use client'

import { ENERGY_VALUES, getMeterStatus, Task } from '@/lib/types'

interface Props {
  tasks: Task[]
  budget: number
}

const STATUS_COLORS = {
  green: {
    bar: 'bg-sage-400',
    text: 'text-sage-600',
    label: 'Looking good',
    bg: 'bg-sage-50',
    border: 'border-sage-200',
  },
  yellow: {
    bar: 'bg-amber-400',
    text: 'text-amber-600',
    label: 'Getting full',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  red: {
    bar: 'bg-rose-400',
    text: 'text-rose-600',
    label: 'Overloaded',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
}

export default function CapacityMeter({ tasks, budget }: Props) {
  const activeTasks = tasks.filter(t => !t.done)
  const used = activeTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)
  const remaining = Math.max(0, budget - used)
  const pct = budget > 0 ? Math.min((used / budget) * 100, 100) : 0
  const status = getMeterStatus(used, budget)
  const colors = STATUS_COLORS[status]
  const isOver = used > budget

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 shadow-soft`}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            Weekly Capacity
          </h2>
          <p className={`text-2xl font-semibold ${colors.text}`}>
            {isOver ? `${used - budget} pts over` : `${remaining} pts remaining`}
          </p>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {colors.label}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-5">
        {used} of {budget} points used
      </p>

      {/* Meter bar */}
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-meter ${colors.bar}`}
          style={{ width: `${pct}%` }}
        />
        {/* 60% marker */}
        <div className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: '60%' }} />
        {/* 85% marker */}
        <div className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: '85%' }} />
      </div>

      <div className="flex justify-between mt-1.5 text-[10px] text-gray-300 font-medium">
        <span>0</span>
        <span className="ml-[60%] -translate-x-1/2">60%</span>
        <span>85%</span>
        <span>{budget}pts</span>
      </div>

      {/* Energy breakdown */}
      {activeTasks.length > 0 && (
        <div className="mt-5 flex gap-3 flex-wrap">
          {(['high', 'medium', 'low'] as const).map(level => {
            const count = activeTasks.filter(t => t.energyCost === level).length
            const pts = count * ENERGY_VALUES[level]
            if (count === 0) return null
            return (
              <div key={level} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${
                  level === 'high' ? 'bg-rose-300' :
                  level === 'medium' ? 'bg-amber-300' : 'bg-sage-300'
                }`} />
                <span className="capitalize">{level}</span>
                <span className="text-gray-300">×{count}</span>
                <span className="text-gray-400 font-medium">{pts}pts</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
