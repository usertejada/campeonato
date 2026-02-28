// src/types/time.ts

export interface Time {
  id: string
  campeonato_id: string | null
  tecnico_id: string | null
  nome: string
  logo_url: string | null
  cidade: string | null
  aprovado: boolean
  ano_fundacao: number | null
  quantidade_jogadores: number | null
  created_at?: string
  updated_at?: string
  // join
  campeonato?: { nome: string; admin_id: string | null } | null
}

export interface TimeInsert {
  nome: string
  logo_url?: string | null
  cidade?: string | null
  campeonato_id?: string | null
  tecnico_id?: string | null   // ← adicionado
  aprovado?: boolean
  ano_fundacao?: number | null
  quantidade_jogadores?: number | null
}

export interface TimeFiltros {
  search: string
  status: 'all' | 'aprovado' | 'pendente'
}