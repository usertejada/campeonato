// src/hooks/useClassificacao.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export interface TimeClassificacao {
  pos:      number
  id:       string
  nome:     string
  logo_url: string | null
  pts:      number
  j:        number
  v:        number
  e:        number
  d:        number
  gp:       number
  gc:       number
  sg:       number
  form:     ('v' | 'e' | 'd')[]
  classificado?: boolean   // true se está dentro do número de classificados
}

interface UseClassificacaoOptions {
  campeonatoId?:        string
  search?:              string
  fase?:                string   // filtra jogos por fase (ex: 'grupos', 'oitavas'...)
  numeroClassificados?: number   // quantos times são destacados como classificados
}

export function useClassificacao({
  campeonatoId        = '',
  search              = '',
  fase                = 'grupos',
  numeroClassificados = 0,
}: UseClassificacaoOptions = {}) {
  const [classificacao, setClassificacao] = useState<TimeClassificacao[]>([])
  const [loading, setLoading]             = useState(true)
  const [error,   setError]               = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 1. Busca times aprovados do campeonato
      let timesQuery = supabase
        .from('times')
        .select('id, nome, logo_url')
        .eq('aprovado', true)

      if (campeonatoId) timesQuery = timesQuery.eq('campeonato_id', campeonatoId)

      const { data: times, error: timesErr } = await timesQuery
      if (timesErr) throw new Error(timesErr.message)

      // 2. Busca jogos finalizados do campeonato (filtra por fase se informada)
      let jogosQuery = supabase
        .from('jogos')
        .select('id, time_casa_id, time_fora_id, placar_casa, placar_fora, wo, data_hora, fase')
        .eq('finalizado', true)
        .eq('status', 'finalizado')
        .order('data_hora', { ascending: true })

      if (campeonatoId) jogosQuery = jogosQuery.eq('campeonato_id', campeonatoId)

      // Filtra pela fase — se a coluna 'fase' existir no banco
      // Se não existir ainda, ignora o filtro silenciosamente
      if (fase) jogosQuery = jogosQuery.eq('fase', fase)

      let jogosData: { id: any; time_casa_id: any; time_fora_id: any; placar_casa: any; placar_fora: any; wo: any; data_hora: any; fase?: any }[] = []

      const { data: jogos, error: jogosErr } = await jogosQuery
      if (jogosErr) {
        // Se erro for por coluna inexistente (fase ainda não existe), tenta sem filtro de fase
        if (jogosErr.message.includes('fase')) {
          const { data: jogosSemFase, error: err2 } = await supabase
            .from('jogos')
            .select('id, time_casa_id, time_fora_id, placar_casa, placar_fora, wo, data_hora')
            .eq('finalizado', true)
            .eq('status', 'finalizado')
            .eq('campeonato_id', campeonatoId)
            .order('data_hora', { ascending: true })
          if (err2) throw new Error(err2.message)
          jogosData = jogosSemFase ?? []
        } else {
          throw new Error(jogosErr.message)
        }
      } else {
        jogosData = jogos ?? []
      }

      // 3. Monta mapa de stats por time
      type StatsEntry = Omit<TimeClassificacao, 'pos' | 'form' | 'sg' | 'classificado'> & {
        jogosOrdenados: { resultado: 'v' | 'e' | 'd'; data: string }[]
      }

      const statsMap: Record<string, StatsEntry> = {}

      for (const t of times ?? []) {
        statsMap[t.id] = {
          id: t.id, nome: t.nome, logo_url: t.logo_url,
          pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0,
          jogosOrdenados: [],
        }
      }

      // 4. Processa cada jogo — W.O. usa o PLACAR salvo (3×0) para decidir vencedor
      for (const jogo of jogosData) {
        const { time_casa_id, time_fora_id, placar_casa, placar_fora, data_hora } = jogo

        const casa = statsMap[time_casa_id]
        const fora = statsMap[time_fora_id]
        if (!casa || !fora) continue

        const pc = placar_casa ?? 0
        const pf = placar_fora  ?? 0

        casa.j++; fora.j++
        casa.gp += pc; casa.gc += pf
        fora.gp += pf; fora.gc += pc

        // Decide resultado pelo placar (W.O. já vem com 3×0 salvo corretamente)
        if (pc > pf) {
          casa.v++; casa.pts += 3; fora.d++
          casa.jogosOrdenados.push({ resultado: 'v', data: data_hora })
          fora.jogosOrdenados.push({ resultado: 'd', data: data_hora })
        } else if (pc < pf) {
          fora.v++; fora.pts += 3; casa.d++
          casa.jogosOrdenados.push({ resultado: 'd', data: data_hora })
          fora.jogosOrdenados.push({ resultado: 'v', data: data_hora })
        } else {
          casa.e++; casa.pts += 1
          fora.e++; fora.pts += 1
          casa.jogosOrdenados.push({ resultado: 'e', data: data_hora })
          fora.jogosOrdenados.push({ resultado: 'e', data: data_hora })
        }
      }

      // 5. Monta array ordenado (pts > v > sg > gp)
      let resultado: TimeClassificacao[] = Object.values(statsMap).map(t => {
        const sg   = t.gp - t.gc
        const form = t.jogosOrdenados
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, 5)
          .map(j => j.resultado)

        return {
          pos: 0, id: t.id, nome: t.nome, logo_url: t.logo_url,
          pts: t.pts, j: t.j, v: t.v, e: t.e, d: t.d,
          gp: t.gp, gc: t.gc, sg, form,
        }
      })

      resultado.sort((a, b) =>
        b.pts - a.pts ||
        b.v   - a.v   ||
        b.sg  - a.sg  ||
        b.gp  - a.gp
      )

      // 6. Numera posições e marca classificados
      resultado = resultado.map((t, i) => ({
        ...t,
        pos:          i + 1,
        classificado: numeroClassificados > 0 ? i < numeroClassificados : undefined,
      }))

      // 7. Filtro por nome (client-side)
      if (search.trim()) {
        const s = search.toLowerCase()
        resultado = resultado.filter(t => t.nome.toLowerCase().includes(s))
      }

      setClassificacao(resultado)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao calcular classificação')
    } finally {
      setLoading(false)
    }
  }, [campeonatoId, search, fase, numeroClassificados])

  useEffect(() => { fetch() }, [fetch])

  return { classificacao, loading, error, refetch: fetch }
}