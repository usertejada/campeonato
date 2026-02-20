// @/types/campeonato.ts

export type CampeonatoStatus = 'ativo' | 'agendado' | 'finalizado' | 'inativo'

export interface Campeonato {
  id: string
  nome: string
  organizador: string
  local: string
  logo_url: string | null  // nome real da coluna no Supabase
  categoria: string
  status: CampeonatoStatus
  formato: string
  numero_times: number
  data_inicio: string
  data_termino: string
  telefone?: string | null
  phone_code?: string | null
  admin_id?: string | null
  data_limite_e?: string | null
  ano_criacao?: number | null
  created_at?: string
  updated_at?: string
}

// Usado no formulário de criação
export interface CampeonatoInsert {
  nome: string
  organizador: string
  local: string
  logo_url?: string | null
  categoria: string
  status: CampeonatoStatus
  formato: string
  numero_times: number
  data_inicio: string
  data_termino: string
  telefone?: string | null
  phone_code?: string | null
  ano_criacao?: number | null
}

// Filtros disponíveis na listagem
export interface CampeonatoFiltros {
  search: string
  status: CampeonatoStatus | 'all'
}