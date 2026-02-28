// @/services/campeonato.service.ts

import { createClient } from '@/lib/supabase'
import type { Campeonato, CampeonatoInsert, CampeonatoFiltros } from '@/types/campeonato'

// Busca todos os campeonatos com filtros de search e status
export async function getCampeonatos(filtros: CampeonatoFiltros): Promise<Campeonato[]> {
  const supabase = createClient()

  let query = supabase
    .from('campeonatos')
    .select('*')
    .order('created_at', { ascending: false })

  // Filtro de busca por nome ou organizador
  if (filtros.search.trim()) {
    query = query.or(
      `nome.ilike.%${filtros.search}%,organizador.ilike.%${filtros.search}%`
    )
  }

  // Filtro de status
  if (filtros.status !== 'all') {
    query = query.eq('status', filtros.status)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data ?? []
}

// Busca um campeonato pelo ID
export async function getCampeonatoById(id: string): Promise<Campeonato | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campeonatos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Cria um novo campeonato
export async function createCampeonato(payload: CampeonatoInsert): Promise<Campeonato> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campeonatos')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Atualiza um campeonato existente
export async function updateCampeonato(id: string, payload: Partial<CampeonatoInsert>): Promise<Campeonato> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campeonatos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Deleta um campeonato
export async function deleteCampeonato(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('campeonatos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}