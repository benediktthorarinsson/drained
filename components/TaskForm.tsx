'use client'

import { useState, useEffect } from 'react'
import { Priority, EnergyCost, ENERGY_VALUES } from '@/lib/types'
import { useTemplates, Template } from '@/lib/useTemplates'

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

const PRIORITY_DOT: Record<Priority, string> = {
  must: 'bg-rose-400',
  should: 'bg-amber-400',
  nice: 'bg-sage-400',
}

export default function TaskForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<Priority>('should')
  const [energyCost, setEnergyCost] = useState<EnergyCost>('medium')
  const [error, setError] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [savedConfirm, setSavedConfirm] = useState(false)

  const { templates, saveTemplate, deleteTemplate } = useTemplates()

  // Close picker automatically if all templates are deleted
  useEffect(() => {
    if (templates.length === 0) setShowPicker(false)
  }, [templates.length])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Give this task a name first.')
      return
    }
    if (saveAsTemplate) {
      saveTemplate({ name: name.trim(), priority, energyCost })
      setSaveAsTemplate(false)
      setSavedConfirm(true)
      setTimeout(() => setSavedConfirm(false), 2500)
    }
    onAdd({ name: name.trim(), priority, energyCost })
    setName('')
    setError('')
  }

  function applyTemplate(t: Template) {
    setName(t.name)
    setPriority(t.priority)
    setEnergyCost(t.energyCost)
    setShowPicker(false)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 sm:p-5 space-y-4">

      {/* Heading row + "Use a template" toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Add a task</h3>
          {templates.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPicker(p => !p)}
              className="text-xs text-gray-400 hover:text-sage-600 transition"
            >
              {showPicker ? 'Close' : 'Use a template'}
            </button>
          )}
        </div>

        {/* Inline template picker — only shown when templates exist and picker is open */}
        {showPicker && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            {templates.map(t => (
              <div
                key={t.id}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition border-b border-gray-50 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[t.priority]}`} />
                  <span className="text-sm text-gray-700 truncate">{t.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-auto pl-2">
                    {ENERGY_VALUES[t.energyCost]}pts
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTemplate(t.id)}
                  className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition ml-1"
                  aria-label={`Delete template: ${t.name}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task name */}
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

      {/* Priority + energy selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Save as template checkbox + confirmation */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={saveAsTemplate}
            onChange={e => setSaveAsTemplate(e.target.checked)}
            className="accent-sage-500 w-3.5 h-3.5"
          />
          Save as template
        </label>
        {savedConfirm && (
          <span className="text-xs text-sage-600">Saved as template 🌿</span>
        )}
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
