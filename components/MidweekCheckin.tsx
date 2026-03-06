'use client'

import { useState } from 'react'

interface Props {
  done: boolean
  onApply: (reduction: number) => void
  onDismiss: () => void
}

const OPTIONS = [
  { label: "I'm fine, full steam ahead", reduction: 0 },
  { label: "A bit tired — I'll ease up a little", reduction: 20 },
  { label: "Pretty drained — let's protect some space", reduction: 35 },
  { label: "Running on empty — scale it back significantly", reduction: 50 },
]

export default function MidweekCheckin({ done, onApply, onDismiss }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  if (done) return null

  return (
    <div className="rounded-2xl border border-sage-200 bg-sage-50 p-5">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h3 className="text-sm font-semibold text-sage-800">Mid-week check-in</h3>
        </div>
        <button
          onClick={onDismiss}
          className="text-sage-300 hover:text-sage-500 transition"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 12 12">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-sage-600 mb-4 ml-8">How are you actually feeling right now?</p>

      <div className="space-y-2 mb-4">
        {OPTIONS.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${
              selected === i
                ? 'bg-sage-100 border-sage-400 text-sage-800'
                : 'bg-white border-sage-100 text-sage-700 hover:border-sage-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={() => selected !== null && onApply(OPTIONS[selected].reduction)}
        className="w-full py-2 rounded-xl bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Update my plan
      </button>
    </div>
  )
}
