// src/types/jogo.types.ts

export interface Time {
  nome: string;
  escudo: string;
}

export interface Gol {
  jogador: string;
  minuto?: number;
}

export interface Cartao {
  jogador: string;
  time: 'casa' | 'visitante';
  tipo: 'amarelo' | 'vermelho';
}

export interface Jogo {
  id: string;
  timeCasa: Time;
  timeVisitante: Time;
  placarCasa: number | null;
  placarVisitante: number | null;
  estadio: string;
  data: string;
  horario: string;
  status: 'agendado' | 'ao-vivo' | 'finalizado';
  
  // Campos de finalização
  golsCasa?: Gol[];
  golsVisitante?: Gol[];
  cartoes?: Cartao[];
  relatorioArbitro?: string;
}

export interface FinalizarJogoData {
  placarCasa: number;
  placarVisitante: number;
  golsCasa: Gol[];
  golsVisitante: Gol[];
  cartoes: Cartao[];
  relatorioArbitro: string;
}