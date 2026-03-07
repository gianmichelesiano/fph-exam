import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fph_exam_progress'

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  function saveResult(testId, result) {
    setProgress(prev => ({
      ...prev,
      [testId]: {
        ...result,
        completedAt: new Date().toISOString(),
      },
    }))
  }

  function savePartial(testId, answers, currentIndex) {
    setProgress(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        status: 'in_progress',
        answers,
        currentIndex,
        savedAt: new Date().toISOString(),
      },
    }))
  }

  function clearResult(testId) {
    setProgress(prev => {
      const next = { ...prev }
      delete next[testId]
      return next
    })
  }

  return { progress, saveResult, savePartial, clearResult }
}
