// src/types/jogadores.ts

export interface Jogador {
  id: string
  nome: string
  foto_url: string | null
  foto_documento: string | null
  posicao: string | null
  numero_camisa: number | null
  nacionalidade: string | null
  telefone: string | null
  doc_tipo: string | null
  doc_numero: string | null
  data_nascimento: string | null
  time_id: string
  time?: { nome: string; logo_url: string | null } | null
}

export interface Time {
  id: string
  nome: string
  logo_url: string | null
}

export interface JogadorInsert {
  nome: string
  foto_url?: string | null
  foto_documento?: string | null
  posicao?: string
  numero_camisa?: number
  nacionalidade?: string
  telefone?: string
  doc_tipo?: string
  doc_numero?: string
  data_nascimento?: string
  time_id: string
}