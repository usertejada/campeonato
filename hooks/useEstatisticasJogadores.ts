// src/hooks/useEstatisticasJogadores.ts
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export interface EstatisticaJogador {
  jogador_id: string
  gols:       number
  amarelos:   number
  vermelhos:  number
}

interface UseEstatisticasJogadoresProps {
  jogadorIds: string[]
  campeonatoId?: string  // opcional: filtra só os eventos do campeonato
}

export function useEstatisticasJogadores({ jogadorIds, campeonatoId }: UseEstatisticasJogadoresProps) {
  const [stats,   setStats]   = useState<Map<string, EstatisticaJogador>>(new Map())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (jogadorIds.length === 0) { setStats(new Map()); return }

    setLoading(true)
    const supabase = createClient()

    // Busca todos os eventos dos jogadores listados
    // Se campeonatoId fornecido, join com jogos para filtrar pelo campeonato
    let query = supabase
      .from('eventos_jogo')
      .select(campeonatoId
        ? 'jogador_id, tipo, jogos!inner(campeonato_id)'
        : 'jogador_id, tipo'
      )
      .in('jogador_id', jogadorIds)
      .in('tipo', ['gol', 'amarelo', 'vermelho'])

    if (campeonatoId) {
      query = query.eq('jogos.campeonato_id', campeonatoId)
    }

    query.then(({ data }) => {
      const map = new Map<string, EstatisticaJogador>()

      // Inicializa todos com zero
      jogadorIds.forEach(id => map.set(id, { jogador_id: id, gols: 0, amarelos: 0, vermelhos: 0 }))

      ;(data ?? []).forEach((ev: any) => {
        const entry = map.get(ev.jogador_id)
        if (!entry) return
        if (ev.tipo === 'gol')      entry.gols++
        if (ev.tipo === 'amarelo')  entry.amarelos++
        if (ev.tipo === 'vermelho') entry.vermelhos++
      })

      setStats(new Map(map))
      setLoading(false)
    })
  }, [jogadorIds.join(','), campeonatoId])

  return { stats, loading }
}