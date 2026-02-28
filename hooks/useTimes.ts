// src/hooks/useTimes.ts

import { useState, useEffect, useCallback } from 'react'
import { getTimes } from '@/services/time.service'
import type { Time, TimeFiltros } from '@/types/time'

export function useTimes() {
  const [times,   setTimes]   = useState<Time[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState<TimeFiltros['status']>('all')

  const fetchTimes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTimes({ search, status })
      setTimes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const t = setTimeout(fetchTimes, 400)
    return () => clearTimeout(t)
  }, [fetchTimes])

  return {
    times,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    refetch: fetchTimes,
  }
}