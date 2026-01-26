// src/utils/helpers/badge.helper.ts

export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';

// Mapa de categorias → cores
const CATEGORY_COLORS: Record<string, BadgeColor> = {
  'Masculino Livre': 'blue',
  'Feminino Livre': 'purple',
  'Veterano 35+': 'gray',
  'Sub-13': 'green',
  'Sub-15': 'yellow',
};

// Mapa de status → cores
const STATUS_COLORS: Record<string, BadgeColor> = {
  'Em Andamento': 'green',
  'Agendado': 'blue',
  'Finalizado': 'gray',
  'Inativo': 'red',
  'Bloqueado': 'orange', // ✅ ADICIONADO
};

/**
 * Retorna a cor do badge baseado na categoria
 * @param category - Categoria do campeonato
 * @returns Cor do badge (padrão: 'blue')
 */
export function getCategoryBadgeColor(category: string): BadgeColor {
  return CATEGORY_COLORS[category] || 'blue';
}

/**
 * Retorna a cor do badge baseado no status
 * @param status - Status do campeonato
 * @returns Cor do badge (padrão: 'gray')
 */
export function getStatusBadgeColor(status: string): BadgeColor {
  return STATUS_COLORS[status] || 'gray';
}

/**
 * Retorna todas as categorias disponíveis
 * Útil para selects/filtros
 */
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_COLORS);
}

/**
 * Retorna todos os status disponíveis
 * Útil para selects/filtros
 */
export function getAvailableStatuses(): string[] {
  return Object.keys(STATUS_COLORS);
}