'use client'

import { useState } from 'react'
import { Priority, EnergyCost, ENERGY_VALUES } from '@/lib/types'

interface Props {
  onAdd: (task: { name: string; priority: Priority; energyCost: EnergyCost }) => void
}

// Unselected: muted grey. Selected: vibrant color with solid border.
const PRIORITY_OPTIONS: { value: Priority; label: string; selected: string }[] = [
  { value: 'must',   label: 'Must Do',    selected: 'bg-rose-50 text-rose-600 border-rose-400 font-semibold' },
  { value: 'should', label: 'Should Do',  selected: 'bg-amber-50 text-amber-600 border-amber-400 font-semibold' },
  { value: 'nice',   label: 'Nice to Do', selected: 'bg-sage-50 text-sage-600 border-sage-400 font-semibold' },
]

const ENERGY_OPTIONS: { value: EnergyCost; label: string; pts: number; selected: string }[] = [
  { value: 'high',   label: 'High',   pts: 30, selected: 'bg-rose-50 text-rose-600 border-rose-400 font-semibold' },
  { value: 'medium', label: 'Medium', pts: 15, selected: 'bg-amber-50 text-amber-600 border-amber-400 font-semibold' },
  { value: 'low',    label: 'Low',    pts: 5,  selected: 'bg-sage-50 text-sage-600 border-sage-400 font-semibold' },
]

const UNSELECTED = 'bg-white text-gray-300 border-gray-200 font-medium hover:border-gray-300 hover:text-gray-400'

export default function TaskForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('should')
  const [energyCost, setEnergyCost] = useState<EnergyCost>('medium')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Give this task a name first.')
      return
    }
    onAdd({ name: name.trim(), priority, energyCost })
    setName('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Add a task</h3>

      <div>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          placeholder="What's on your plate this week?"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition"
        />
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Priority</p>
          <div className="flex flex-col gap-1.5">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs text-left transition ${
                  priority === opt.value ? opt.selected : UNSELECTED
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Energy cost</p>
          <div className="flex flex-col gap-1.5">
            {ENERGY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEnergyCost(opt.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs text-left transition flex items-center justify-between ${
                  energyCost === opt.value ? opt.selected : UNSELECTED
                }`}
              >
                <span>{opt.label}</span>
                <span className={energyCost === opt.value ? 'opacity-60' : 'opacity-40'}>{opt.pts}pts</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 active:scale-[0.99] transition"
      >
        Add task
      </button>
    </form>
  )
}
