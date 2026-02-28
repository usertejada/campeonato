// @/types/campeonato.ts

export type CampeonatoStatus = 'ativo' | 'agendado' | 'finalizado' | 'inativo'

export type CampeonatoFase =
  | 'grupos'
  | 'oitavas'
  | 'quartas'
  | 'semifinal'
  | 'final'
  | 'encerrado'

export interface Campeonato {
  id: string
  nome: string
  organizador: string
  local: string
  logo_url: string | null
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
  // ── Ponto Corrido / Mata-mata ──
  fase_atual?: CampeonatoFase
  numero_classificados?: number   // quantos times avançam para o mata-mata (4, 8, 16...)
}

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
  // ── Ponto Corrido / Mata-mata ──
  fase_atual?: CampeonatoFase
  numero_classificados?: number
}

export interface CampeonatoFiltros {
  search: string
  status: CampeonatoStatus | 'all'
}

// Mapa de label por fase (para exibição na UI)
export const FASE_LABEL: Record<CampeonatoFase, string> = {
  grupos:    'Fase de Grupos',
  oitavas:   'Oitavas de Final',
  quartas:   'Quartas de Final',
  semifinal: 'Semifinal',
  final:     'Final',
  encerrado: 'Encerrado',
}

// Próxima fase no fluxo
export const PROXIMA_FASE: Partial<Record<CampeonatoFase, CampeonatoFase>> = {
  grupos:    'oitavas',
  oitavas:   'quartas',
  quartas:   'semifinal',
  semifinal: 'final',
  final:     'encerrado',
}