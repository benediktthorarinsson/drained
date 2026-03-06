'use client'

import { useState } from 'react'

interface Props {
  budget: number
  onSave: (value: number) => void
}

const PRESETS = [
  { label: 'Full', value: 100 },
  { label: 'Reduced', value: 75 },
  { label: 'Low', value: 50 },
  { label: 'Rest', value: 25 },
]

export default function BudgetEditor({ budget, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(budget)

  function handleSave() {
    const clamped = Math.max(10, Math.min(200, draft))
    onSave(clamped)
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => { setDraft(budget); setOpen(true) }}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-sage-600 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Set weekly budget ({budget} pts)
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Weekly energy budget</h3>
        <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-500 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 12 12">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-400">Lower this if you&apos;re sick, tired, or have a big personal event.</p>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => setDraft(p.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              draft === p.value
                ? 'bg-sage-100 border-sage-300 text-sage-700'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-sage-200'
            }`}
          >
            {p.label} — {p.value}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={10}
          max={150}
          step={5}
          value={draft}
          onChange={e => setDraft(Number(e.target.value))}
          className="flex-1 accent-sage-500"
        />
        <span className="text-sm font-semibold text-gray-700 w-16 text-right">{draft} pts</span>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 rounded-xl bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 transition"
      >
        Save budget
      </button>
    </div>
  )
}
