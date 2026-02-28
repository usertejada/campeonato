// src/services/jogadores.service.ts

import { createClient } from '@/lib/supabase'
import type { Jogador, Time, JogadorInsert } from '@/types/jogadores'

export type { Jogador, Time, JogadorInsert }

export async function fetchJogadores(role: string, uid: string): Promise<Jogador[]> {
  const supabase = createClient()

  let query = supabase
    .from('jogadores')
    .select(`
      id, nome, foto_url, foto_documento,
      posicao, numero_camisa, nacionalidade,
      telefone, doc_tipo, doc_numero, data_nascimento,
      time_id, time:times(nome, logo_url)
    `)
    .order('nome', { ascending: true })

  if (role === 'tecnico') {
    query = query.eq('times.tecnico_id', uid)
  }

  const { data } = await query

  return (data ?? []).map(j => ({
    ...j,
    time: Array.isArray(j.time) ? j.time[0] ?? null : j.time,
  }))
}

export async function fetchTimes(): Promise<Time[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('times')
    .select('id, nome, logo_url')
    .order('nome')
  return data ?? []
}

export async function criarJogador(data: JogadorInsert): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('jogadores').insert(data)
  if (error) throw new Error(error.message)
}

export async function editarJogador(
  id: string,
  data: JogadorInsert,
): Promise<{ count: number | null }> {
  const supabase = createClient()

  console.log('[EDITAR] Jogador ID:', id)
  console.log('[EDITAR] Dados enviados:', data)

  const { error, count, status, statusText } = await supabase
    .from('jogadores')
    .update(data)
    .eq('id', id)

  console.log('[EDITAR] Status HTTP:', status, statusText)
  console.log('[EDITAR] Rows afetadas:', count)
  console.log('[EDITAR] Error:', error)

  if (error) {
    console.error('[EDITAR] Erro do Supabase:', error)
    throw new Error(error.message)
  }

  return { count }
}

export async function excluirJogador(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('jogadores').delete().eq('id', id)
  if (error) throw new Error(error.message)
}