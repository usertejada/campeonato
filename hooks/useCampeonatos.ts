// @/hooks/useCampeonatos.ts

import { useState, useEffect, useCallback } from 'react'
import { getCampeonatos } from '@/services/campeonato.service'
import type { Campeonato, CampeonatoStatus } from '@/types/campeonato'

export function useCampeonatos() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<CampeonatoStatus | 'all'>('all')

  const fetchCampeonatos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCampeonatos({ search, status: statusFiltro })
      setCampeonatos(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, statusFiltro])

  // Debounce: só busca 400ms após parar de digitar
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCampeonatos()
    }, 400)

    return () => clearTimeout(timeout)
  }, [fetchCampeonatos])

  return {
    campeonatos,
    loading,
    error,
    search,
    setSearch,
    statusFiltro,
    setStatusFiltro,
    refetch: fetchCampeonatos,
  }
}