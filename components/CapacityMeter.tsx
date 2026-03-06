'use client'

import { ENERGY_VALUES, getMeterStatus, Task } from '@/lib/types'

interface Props {
  tasks: Task[]
  budget: number
}

const STATUS_CONFIG = {
  green: {
    text: 'text-sage-600',
    label: 'Looking good 🟢',
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    pillBg: 'bg-sage-100',
    pillText: 'text-sage-700',
    pillBorder: 'border-sage-300',
  },
  yellow: {
    text: 'text-amber-600',
    label: 'Getting full 🟡',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    pillBg: 'bg-amber-100',
    pillText: 'text-amber-700',
    pillBorder: 'border-amber-300',
  },
  red: {
    text: 'text-rose-600',
    label: 'Overloaded 🔴',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    pillBg: 'bg-rose-100',
    pillText: 'text-rose-700',
    pillBorder: 'border-rose-300',
  },
}

export default function CapacityMeter({ tasks, budget }: Props) {
  const activeTasks = tasks.filter(t => !t.done)
  const used = activeTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)
  const remaining = Math.max(0, budget - used)
  const pct = budget > 0 ? Math.min((used / budget) * 100, 100) : 0
  const status = getMeterStatus(used, budget)
  const cfg = STATUS_CONFIG[status]
  const isOver = used > budget

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 shadow-soft`}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            Weekly Capacity
          </h2>
          <p className={`text-2xl font-semibold ${cfg.text}`}>
            {isOver ? `${used - budget} pts over` : `${remaining} pts remaining`}
          </p>
        </div>
        {/* Static status pill — no click */}
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder} select-none`}>
          {cfg.label}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-5">
        {used} of {budget} points used
      </p>

      {/* Meter bar — taller, gradient fill, red glow at 85%+, pulsing glow when over 100% */}
      <div
        className={`relative h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner transition-shadow duration-500 ${isOver ? 'animate-glow-pulse' : ''}`}
        style={status === 'red' && !isOver ? { boxShadow: '0 0 0 3px rgba(251,113,133,0.2), 0 0 16px 4px rgba(239,68,68,0.18)' } : undefined}
      >
        {/* Full-width gradient layer, always rendered */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(to right, #4ade80 0%, #a3e635 45%, #facc15 60%, #fb923c 78%, #f87171 85%, #ef4444 100%)' }}
        />
        {/* Mask — covers unfilled portion with track bg */}
        <div
          className="absolute top-0 right-0 bottom-0 bg-gray-100 transition-meter"
          style={{ left: `${pct}%` }}
        />
        {/* Zone markers */}
        <div className="absolute top-0 bottom-0 w-px bg-white/50 z-10" style={{ left: '60%' }} />
        <div className="absolute top-0 bottom-0 w-px bg-white/50 z-10" style={{ left: '85%' }} />
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
