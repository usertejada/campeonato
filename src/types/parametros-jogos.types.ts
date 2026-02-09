// src/types/parametros-jogos.types.ts

export interface TempoJogo {
  id: string;
  label: string;
  primeiroTempo: number; // em minutos
  segundoTempo: number; // em minutos
}

export interface LocalJogo {
  id: string;
  nome: string;
}

export interface ConfiguracaoPartidas {
  horarioInicio: string; // formato "HH:mm"
  numeroPartidas: number;
  intervaloEntreJogos: number; // em minutos
}

export interface DiaSemana {
  id: string;
  dia: string;
  ativo: boolean;
}

export interface CampeonatoSelecionado {
  id: string;
  nome: string;
  formato: 'Pontos Corridos' | 'Chaveamento';
  dataInicio?: string; // ISO format YYYY-MM-DD
  dataFim?: string;    // ISO format YYYY-MM-DD
}

export interface ParametrosJogos {
  campeonato: CampeonatoSelecionado | null;
  locais: LocalJogo[];
  tempoJogo: TempoJogo | null;
  configuracaoPartidas: ConfiguracaoPartidas | null;
  diasSemana: DiaSemana[]; // Mantido para compatibilidade
  datasSelecionadas: string[]; // Array de datas em formato ISO (YYYY-MM-DD)
}

export const TEMPOS_JOGO_PRESET: TempoJogo[] = [
  {
    id: '15-15',
    label: '15 x 15',
    primeiroTempo: 15,
    segundoTempo: 15,
  },
  {
    id: '20-20',
    label: '20 x 20',
    primeiroTempo: 20,
    segundoTempo: 20,
  },
  {
    id: '45-45',
    label: '45 x 45',
    primeiroTempo: 45,
    segundoTempo: 45,
  },
];

export const DIAS_SEMANA_PRESET: DiaSemana[] = [
  { id: 'domingo', dia: 'Domingo', ativo: false },
  { id: 'segunda', dia: 'Segunda', ativo: false },
  { id: 'terca', dia: 'Terça', ativo: false },
  { id: 'quarta', dia: 'Quarta', ativo: false },
  { id: 'quinta', dia: 'Quinta', ativo: false },
  { id: 'sexta', dia: 'Sexta', ativo: false },
  { id: 'sabado', dia: 'Sábado', ativo: false },
];