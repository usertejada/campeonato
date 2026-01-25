// src/helpers/statCards.helper.ts
import { Trophy, Power, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCard {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number;
}

interface ChampionshipStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
}

export function getChampionshipStatCards(stats: ChampionshipStats): StatCard[] {
  return [
    {
      icon: Trophy,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
      label: 'Total',
      value: stats.total
    },
    {
      icon: Power,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
      label: 'Ativos',
      value: stats.active
    },
    {
      icon: Power,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-50',
      label: 'Inativos',
      value: stats.inactive
    },
    {
      icon: X,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50',
      label: 'Bloqueados',
      value: stats.blocked
    }
  ];
}