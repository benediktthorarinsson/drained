'use client'

import { useState } from 'react'
import { Task, ENERGY_VALUES } from '@/lib/types'

type EnergyRating = 'exhausted' | 'drained' | 'okay' | 'good' | 'energised'
type CapacityMatch = 'too-much' | 'about-right' | 'more-in-me'

interface ReflectionData {
  weekStart: string
  energy: EnergyRating
  capacityMatch: CapacityMatch
  takeaway: string
  completionRate: number
  pointsUsed: number
  budget: number
  savedAt: number
}

interface Props {
  weekStart: string
  tasks: Task[]
  budget: number
  onDone: () => void
}

const ENERGY_OPTIONS: { value: EnergyRating; emoji: string; label: string }[] = [
  { value: 'exhausted', emoji: '😴', label: 'Exhausted' },
  { value: 'drained',   emoji: '😓', label: 'Drained'   },
  { value: 'okay',      emoji: '😐', label: 'Okay'      },
  { value: 'good',      emoji: '😊', label: 'Good'      },
  { value: 'energised', emoji: '⚡', label: 'Energised' },
]

const CAPACITY_OPTIONS: { value: CapacityMatch; label: string }[] = [
  { value: 'too-much',    label: 'I took on too much' },
  { value: 'about-right', label: 'About right'        },
  { value: 'more-in-me',  label: 'I had more in me'   },
]

const UNSELECTED = 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
const SELECTED   = 'bg-sage-50 text-sage-700 border-sage-400 font-semibold'

export default function ReflectionModal({ weekStart, tasks, budget, onDone }: Props) {
  const [step, setStep] = useState(1)
  const [energy, setEnergy] = useState<EnergyRating | null>(null)
  const [capacityMatch, setCapacityMatch] = useState<CapacityMatch | null>(null)
  const [takeaway, setTakeaway] = useState('')

  const doneTasks = tasks.filter(t => t.done)
  const pointsUsed = doneTasks.reduce((sum, t) => sum + ENERGY_VALUES[t.energyCost], 0)

  function saveAndReset() {
    if (!energy || !capacityMatch) return
    const data: ReflectionData = {
      weekStart,
      energy,
      capacityMatch,
      takeaway: takeaway.trim(),
      completionRate: tasks.length > 0 ? doneTasks.length / tasks.length : 0,
      pointsUsed,
      budget,
      savedAt: Date.now(),
    }
    try {
      localStorage.setItem(`reflection_${weekStart}`, JSON.stringify(data))
    } catch {}
    onDone()
  }

  function handleContinue() {
    if (step < 3) setStep(s => s + 1)
    else saveAndReset()
  }

  const canContinue = !(step === 1 && !energy) && !(step === 2 && !capacityMatch)

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto sm:bg-black/20 sm:backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl sm:shadow-xl">
        <div className="px-5 py-12 sm:p-8">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  n <= step ? 'bg-sage-400' : 'bg-gray-100'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1 tabular-nums whitespace-nowrap">
              {step} / 3
            </span>
          </div>

          {/* Step 1 — Energy check */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-1">
                How did your energy feel this week?
              </h2>
              <p className="text-sm text-gray-400 mb-6">Be honest — this is just for you.</p>
              <div className="flex flex-wrap gap-2">
                {ENERGY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEnergy(opt.value)}
                    className={`px-4 py-2.5 rounded-xl border text-sm transition ${
                      energy === opt.value ? SELECTED : UNSELECTED
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Capacity honesty */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-1">
                How did your planned capacity match reality?
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Did your budget reflect what you could actually do?
              </p>
              <div className="flex flex-col gap-2">
                {CAPACITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCapacityMatch(opt.value)}
                    className={`px-4 py-3 rounded-xl border text-sm text-left transition ${
                      capacityMatch === opt.value ? SELECTED : UNSELECTED
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Takeaway */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-1">
                One thing to remember for next week?
              </h2>
              <p className="text-sm text-gray-400 mb-6">Optional — leave blank to skip.</p>
              <textarea
                value={takeaway}
                onChange={e => setTakeaway(e.target.value)}
                placeholder="e.g. Block mornings for deep work…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-2.5 rounded-xl bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step < 3 ? 'Continue →' : 'Save & start new week'}
            </button>
            <button
              onClick={onDone}
              className="w-full text-center text-xs text-gray-300 hover:text-gray-500 transition py-1"
            >
              Skip reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
