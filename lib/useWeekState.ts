'use client'

import { useState, useEffect, useCallback } from 'react'
import { WeekState, Task, getWeekStart } from './types'

const STORAGE_KEY = 'drained-week-state'
const DEFAULT_BUDGET = 100

function getDefaultState(): WeekState {
  return {
    budget: DEFAULT_BUDGET,
    tasks: [],
    checkinDone: false,
    checkinAdjustment: 0,
    weekStart: getWeekStart(),
  }
}

export function useWeekState() {
  const [state, setState] = useState<WeekState>(getDefaultState)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const currentWeek = getWeekStart()
      if (raw) {
        const saved: WeekState = JSON.parse(raw)
        if (saved.weekStart === currentWeek) {
          setState(saved)
        } else {
          // New week — load any deferred tasks for this week
          const deferKey = `drained-deferred-${currentWeek}`
          let deferredTasks: Task[] = []
          try {
            const deferredRaw = localStorage.getItem(deferKey)
            if (deferredRaw) {
              deferredTasks = JSON.parse(deferredRaw)
              localStorage.removeItem(deferKey)
            }
          } catch {}
          const freshState = getDefaultState()
          setState({ ...freshState, tasks: deferredTasks })
        }
      } else {
        // No saved state — still check for deferred tasks
        const deferKey = `drained-deferred-${currentWeek}`
        let deferredTasks: Task[] = []
        try {
          const deferredRaw = localStorage.getItem(deferKey)
          if (deferredRaw) {
            deferredTasks = JSON.parse(deferredRaw)
            localStorage.removeItem(deferKey)
          }
        } catch {}
        if (deferredTasks.length > 0) {
          setState(s => ({ ...s, tasks: deferredTasks }))
        }
      }
    } catch {
      // corrupt data — reset
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, loaded])

  const setBudget = useCallback((budget: number) => {
    setState(s => ({ ...s, budget }))
  }, [])

  const addTask = useCallback((task: Omit<Task, 'id' | 'done' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      done: false,
      createdAt: Date.now(),
    }
    setState(s => ({ ...s, tasks: [...s.tasks, newTask] }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
    }))
  }, [])

  const applyCheckin = useCallback((reduction: number) => {
    setState(s => ({
      ...s,
      checkinDone: true,
      checkinAdjustment: reduction,
      budget: Math.max(0, s.budget - reduction),
    }))
  }, [])

  const resetWeek = useCallback(() => {
    setState(getDefaultState())
  }, [])

  const deferTask = useCallback((id: string) => {
    const task = state.tasks.find(t => t.id === id)
    if (!task) return

    const nextWeekDate = new Date(state.weekStart + 'T00:00:00')
    nextWeekDate.setDate(nextWeekDate.getDate() + 7)
    const nextWeekStart = nextWeekDate.toISOString().split('T')[0]

    const deferKey = `drained-deferred-${nextWeekStart}`
    try {
      const existing: Task[] = JSON.parse(localStorage.getItem(deferKey) || '[]')
      const filtered = existing.filter(t => t.id !== id)
      const deferredTask: Task = { ...task, deferred: true, done: false }
      localStorage.setItem(deferKey, JSON.stringify([...filtered, deferredTask]))
    } catch {}

    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }))
  }, [state.tasks, state.weekStart])

  return { state, loaded, setBudget, addTask, removeTask, toggleTask, applyCheckin, resetWeek, deferTask }
}
