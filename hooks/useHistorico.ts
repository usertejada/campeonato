// src/hooks/useHistorico.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export interface EventoJogo {
  id: string
  tipo: 'gol' | 'amarelo' | 'vermelho'
  minuto: number | null
  jogador: { nome: string; time_id: string } | null
}

export interface JogoFinalizado {
  id: string
  data_hora: string
  placar_casa: number
  placar_fora: number
  cartoes_amarelos_casa: number
  cartoes_amarelos_fora: number
  cartoes_vermelhos_casa: number
  cartoes_vermelhos_fora: number
  wo: boolean
  observacoes: string | null
  time_casa: { id: string; nome: string; logo_url: string | null } | null
  time_fora: { id: string; nome: string; logo_url: string | null } | null
  campeonato: { id: string; nome: string } | null
  eventos: EventoJogo[]
}

interface UseHistoricoOptions {
  search?: string
  campeonatoId?: string
  dataInicio?: string
  dataFim?: string
}

export function useHistorico({
  search = '',
  campeonatoId = '',
  dataInicio = '',
  dataFim = '',
}: UseHistoricoOptions = {}) {
  const [jogos, setJogos]     = useState<JogoFinalizado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchJogos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()

      let query = supabase
        .from('jogos')
        .select(`
          id,
          data_hora,
          placar_casa,
          placar_fora,
          cartoes_amarelos_casa,
          cartoes_amarelos_fora,
          cartoes_vermelhos_casa,
          cartoes_vermelhos_fora,
          wo,
          observacoes,
          time_casa:times!jogos_time_casa_id_fkey ( id, nome, logo_url ),
          time_fora:times!jogos_time_fora_id_fkey ( id, nome, logo_url ),
          campeonato:campeonatos ( id, nome ),
          eventos:eventos_jogo (
            id,
            tipo,
            minuto,
            jogador:jogadores ( nome, time_id )
          )
        `)
        .eq('finalizado', true)
        .eq('status', 'finalizado')
        .order('data_hora', { ascending: false })

      if (campeonatoId) query = query.eq('campeonato_id', campeonatoId)
      if (dataInicio)   query = query.gte('data_hora', dataInicio)
      if (dataFim)      query = query.lte('data_hora', dataFim + 'T23:59:59')

      const { data, error: err } = await query
      if (err) throw new Error(err.message)

      let resultado = (data ?? []) as unknown as JogoFinalizado[]

      if (search.trim()) {
        const s = search.toLowerCase()
        resultado = resultado.filter(j =>
          j.time_casa?.nome.toLowerCase().includes(s) ||
          j.time_fora?.nome.toLowerCase().includes(s)
        )
      }

      setJogos(resultado)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [search, campeonatoId, dataInicio, dataFim])

  useEffect(() => { fetchJogos() }, [fetchJogos])

  return { jogos, loading, error, refetch: fetchJogos }
}