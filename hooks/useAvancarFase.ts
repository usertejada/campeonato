// src/hooks/useAvancarFase.ts
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { TimeClassificacao } from './useClassificacao'
import type { CampeonatoFase } from '@/types/campeonato'
import { PROXIMA_FASE } from '@/types/campeonato'

interface AvancarFaseOptions {
  campeonatoId:        string
  faseAtual:           CampeonatoFase
  classificados:       TimeClassificacao[]   // top N da classificação
  local:               string
  tempoPrimeiro?:      number
  tempoSegundo?:       number
  intervalo?:          number
}

interface JogoMataMata {
  time_casa: { id: string; nome: string; logo_url: string | null }
  time_fora: { id: string; nome: string; logo_url: string | null }
  descricao: string   // ex: "1º vs 16º"
}

export function useAvancarFase() {
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState<string | null>(null)

  // Gera os confrontos do mata-mata: 1º vs último, 2º vs penúltimo...
  function gerarConfrontos(classificados: TimeClassificacao[]): JogoMataMata[] {
    const confrontos: JogoMataMata[] = []
    const n = classificados.length

    for (let i = 0; i < n / 2; i++) {
      const melhor = classificados[i]
      const pior   = classificados[n - 1 - i]
      confrontos.push({
        time_casa: { id: melhor.id, nome: melhor.nome, logo_url: melhor.logo_url },
        time_fora: { id: pior.id,   nome: pior.nome,   logo_url: pior.logo_url   },
        descricao: `${melhor.pos}º vs ${pior.pos}º`,
      })
    }

    return confrontos
  }

  async function avancarFase({
    campeonatoId,
    faseAtual,
    classificados,
    local,
    tempoPrimeiro = 45,
    tempoSegundo  = 45,
    intervalo     = 5,
  }: AvancarFaseOptions): Promise<boolean> {
    setErro(null)
    setLoading(true)

    try {
      const supabase    = createClient()
      const proximaFase = PROXIMA_FASE[faseAtual]

      if (!proximaFase) {
        throw new Error('Campeonato já está na fase final ou encerrado.')
      }

      if (classificados.length < 2) {
        throw new Error('É necessário pelo menos 2 times classificados.')
      }

      if (classificados.length % 2 !== 0) {
        throw new Error(`Número de classificados deve ser par. Recebido: ${classificados.length}`)
      }

      const confrontos = gerarConfrontos(classificados)

      // Insere os jogos do mata-mata sem data (admin define depois)
      const inserts = confrontos.map(c => ({
        campeonato_id:          campeonatoId,
        time_casa_id:           c.time_casa.id,
        time_fora_id:           c.time_fora.id,
        data_hora:              null,
        local,
        rodada:                 null,
        fase:                   proximaFase,
        tempo_primeiro:         tempoPrimeiro,
        tempo_segundo:          tempoSegundo,
        intervalo,
        status:                 'agendado',
        placar_casa:            0,
        placar_fora:            0,
        finalizado:             false,
        wo:                     false,
        cartoes_amarelos_casa:  0,
        cartoes_amarelos_fora:  0,
        cartoes_vermelhos_casa: 0,
        cartoes_vermelhos_fora: 0,
      }))

      const { error: erroInsert } = await supabase.from('jogos').insert(inserts)
      if (erroInsert) throw new Error(erroInsert.message)

      // Atualiza a fase atual do campeonato
      const { error: erroUpdate } = await supabase
        .from('campeonatos')
        .update({ fase_atual: proximaFase })
        .eq('id', campeonatoId)

      if (erroUpdate) throw new Error(erroUpdate.message)

      return true
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao avançar de fase.')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Gera próxima fase a partir dos vencedores do mata-mata anterior
  async function avancarProximaFase({
    campeonatoId,
    faseAtual,
    local,
    tempoPrimeiro = 45,
    tempoSegundo  = 45,
    intervalo     = 5,
  }: Omit<AvancarFaseOptions, 'classificados'>): Promise<boolean> {
    setErro(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Busca jogos finalizados da fase atual para pegar os vencedores
      const { data: jogos, error: erroJogos } = await supabase
        .from('jogos')
        .select('time_casa_id, time_fora_id, placar_casa, placar_fora, wo, time_casa:times!jogos_time_casa_id_fkey(id, nome, logo_url), time_fora:times!jogos_time_fora_id_fkey(id, nome, logo_url)')
        .eq('campeonato_id', campeonatoId)
        .eq('fase', faseAtual)
        .eq('finalizado', true)

      if (erroJogos) throw new Error(erroJogos.message)
      if (!jogos || jogos.length === 0) throw new Error('Nenhum jogo finalizado encontrado nessa fase.')

      // Verifica se todos os jogos da fase foram finalizados
      const { data: pendentes } = await supabase
        .from('jogos')
        .select('id')
        .eq('campeonato_id', campeonatoId)
        .eq('fase', faseAtual)
        .eq('finalizado', false)
        .neq('status', 'cancelado')

      if (pendentes && pendentes.length > 0) {
        throw new Error(`Ainda há ${pendentes.length} jogo(s) não finalizados nessa fase.`)
      }

      // Extrai os vencedores
      type TimeInfo = { id: string; nome: string; logo_url: string | null }
      const vencedores: TimeInfo[] = []

      for (const jogo of jogos) {
        const casaArr = jogo.time_casa as any
        const foraArr = jogo.time_fora as any
        const casa: TimeInfo = Array.isArray(casaArr) ? casaArr[0] : casaArr
        const fora: TimeInfo = Array.isArray(foraArr) ? foraArr[0] : foraArr
        const pc = jogo.placar_casa ?? 0
        const pf = jogo.placar_fora ?? 0

        if (pc > pf) vencedores.push(casa)
        else if (pf > pc) vencedores.push(fora)
        // Empate em mata-mata não deveria ocorrer, mas se ocorrer ignora (admin resolve)
      }

      if (vencedores.length < 2) throw new Error('Vencedores insuficientes para gerar próxima fase.')

      // Converte vencedores para TimeClassificacao (sem stats, só para confrontos)
      const classificados: TimeClassificacao[] = vencedores.map((t, i) => ({
        pos: i + 1, id: t.id, nome: t.nome, logo_url: t.logo_url,
        pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, form: [],
      }))

      return avancarFase({
        campeonatoId, faseAtual, classificados, local,
        tempoPrimeiro, tempoSegundo, intervalo,
      })
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao avançar fase.')
      setLoading(false)
      return false
    }
  }

  return {
    loading,
    erro,
    gerarConfrontos,
    avancarFase,
    avancarProximaFase,
  }
}