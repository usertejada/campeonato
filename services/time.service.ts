// src/services/time.service.ts

import { createClient } from '@/lib/supabase'
import type { Time, TimeInsert, TimeFiltros } from '@/types/time'

export async function getTimes(filtros: TimeFiltros): Promise<Time[]> {
  const supabase = createClient()

  let query = supabase
    .from('times')
    .select('*, campeonato:campeonatos(nome, admin_id)')
    .order('created_at', { ascending: false })

  if (filtros.search.trim()) {
    query = query.or(`nome.ilike.%${filtros.search}%,cidade.ilike.%${filtros.search}%`)
  }

  if (filtros.status === 'aprovado') query = query.eq('aprovado', true)
  if (filtros.status === 'pendente') query = query.eq('aprovado', false)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createTime(payload: TimeInsert): Promise<Time> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('times')
    .insert({ ...payload, tecnico_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateTime(id: string, payload: Partial<TimeInsert>): Promise<Time> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('times')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteTime(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('times')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function toggleAprovarTime(id: string, aprovado: boolean): Promise<Time> {
  return updateTime(id, { aprovado: !aprovado })
}