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
      if (raw) {
        const saved: WeekState = JSON.parse(raw)
        const currentWeek = getWeekStart()
        if (saved.weekStart === currentWeek) {
          setState(saved)
        } else {
          // New week — reset tasks, keep nothing
          setState(getDefaultState())
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

  return { state, loaded, setBudget, addTask, removeTask, toggleTask, applyCheckin, resetWeek }
}
