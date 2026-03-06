'use client'

import { useState, useEffect } from 'react'
import { Priority, EnergyCost } from './types'

export interface Template {
  id: string
  name: string
  priority: Priority
  energyCost: EnergyCost
  createdAt: number
}

const STORAGE_KEY = 'drained-templates'

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTemplates(JSON.parse(raw))
    } catch {}
  }, [])

  function persist(next: Template[]) {
    setTemplates(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  function saveTemplate(t: Omit<Template, 'id' | 'createdAt'>) {
    const next = [...templates, { ...t, id: crypto.randomUUID(), createdAt: Date.now() }]
    persist(next)
  }

  function deleteTemplate(id: string) {
    persist(templates.filter(t => t.id !== id))
  }

  return { templates, saveTemplate, deleteTemplate }
}
