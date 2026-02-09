// src/utils/common/date.utils.ts

/**
 * Formata data no padrão brasileiro completo
 * Ex: "15 de janeiro de 2025"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formata data de forma compacta (dd/mmm)
 * Ex: "15/jan"
 */
export function formatDateCompact(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
}

/**
 * Calcula diferença em dias entre duas datas
 */
export function calculateDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formata data da rodada com dia da semana completo
 * Ex: "sábado, 15 de janeiro de 2025"
 */
export function formatRodadaDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Retorna o rótulo da rodada com o sufixo correto
 * Ex: "1ª Rodada", "2ª Rodada", "3ª Rodada"
 */
export function getRodadaLabel(numeroRodada: number): string {
  return `${numeroRodada}ª Rodada`;
}