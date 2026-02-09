// src/utils/helpers/statCards.helper.ts
import type { LucideIcon } from 'lucide-react';

export interface StatCardConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number;
}

/**
 * Cria uma configuração de stat card
 * Função auxiliar para facilitar a criação
 */
export function createStatCard(
  icon: LucideIcon,
  label: string,
  value: number,
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'yellow' | 'gray'
): StatCardConfig {
  const colorMap = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' },
    gray: { text: 'text-gray-600', bg: 'bg-gray-50' },
  };

  const colors = colorMap[color];

  return {
    icon,
    iconColor: colors.text,
    iconBgColor: colors.bg,
    label,
    value,
  };
}

// ========================================
// ESPECÍFICO: Campeonatos
// ========================================
import { Trophy, Power, X } from 'lucide-react';

interface ChampionshipStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
}

/**
 * Gera os stat cards para a página de Campeonatos
 */
export function getChampionshipStatCards(stats: ChampionshipStats): StatCardConfig[] {
  return [
    createStatCard(Trophy, 'Total', stats.total, 'blue'),
    createStatCard(Power, 'Ativos', stats.active, 'green'),
    createStatCard(Power, 'Inativos', stats.inactive, 'red'),
    createStatCard(X, 'Bloqueados', stats.blocked, 'orange'),
  ];
}

// ========================================
// EXEMPLO: Como criar para outras entidades
// ========================================

/*
import { Users, UserCheck, UserX } from 'lucide-react';

interface TeamStats {
  total: number;
  active: number;
  inactive: number;
}

export function getTeamStatCards(stats: TeamStats): StatCardConfig[] {
  return [
    createStatCard(Users, 'Total', stats.total, 'blue'),
    createStatCard(UserCheck, 'Ativos', stats.active, 'green'),
    createStatCard(UserX, 'Inativos', stats.inactive, 'red'),
  ];
}
*/