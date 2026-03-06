'use client'

import { useState } from 'react'
import { Priority, EnergyCost, PRIORITY_LABELS, ENERGY_VALUES } from '@/lib/types'

interface Props {
  onAdd: (task: { name: string; priority: Priority; energyCost: EnergyCost }) => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'must', label: 'Must Do', color: 'bg-rose-50 text-rose-600 border-rose-200 data-[selected=true]:bg-rose-100 data-[selected=true]:border-rose-400' },
  { value: 'should', label: 'Should Do', color: 'bg-amber-50 text-amber-600 border-amber-200 data-[selected=true]:bg-amber-100 data-[selected=true]:border-amber-400' },
  { value: 'nice', label: 'Nice to Do', color: 'bg-sage-50 text-sage-600 border-sage-200 data-[selected=true]:bg-sage-100 data-[selected=true]:border-sage-400' },
]

const ENERGY_OPTIONS: { value: EnergyCost; label: string; pts: number; color: string }[] = [
  { value: 'high', label: 'High', pts: 30, color: 'bg-rose-50 text-rose-600 border-rose-200 data-[selected=true]:bg-rose-100 data-[selected=true]:border-rose-400' },
  { value: 'medium', label: 'Medium', pts: 15, color: 'bg-amber-50 text-amber-600 border-amber-200 data-[selected=true]:bg-amber-100 data-[selected=true]:border-amber-400' },
  { value: 'low', label: 'Low', pts: 5, color: 'bg-sage-50 text-sage-600 border-sage-200 data-[selected=true]:bg-sage-100 data-[selected=true]:border-sage-400' },
]

export default function TaskForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('should')
  const [energyCost, setEnergyCost] = useState<EnergyCost>('medium')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a task name.')
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
          placeholder="What needs to get done?"
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
                data-selected={priority === opt.value}
                onClick={() => setPriority(opt.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium text-left transition ${opt.color}`}
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
                data-selected={energyCost === opt.value}
                onClick={() => setEnergyCost(opt.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium text-left transition flex items-center justify-between ${opt.color}`}
              >
                <span>{opt.label}</span>
                <span className="opacity-60">{opt.pts}pts</span>
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
