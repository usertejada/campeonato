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