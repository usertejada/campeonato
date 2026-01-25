// src/helpers/badge.helper.ts

type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';

export function getCategoryBadgeColor(category: string): BadgeColor {
  const categoryMap: Record<string, BadgeColor> = {
    'Masculino Livre': 'blue',
    'Feminino Livre': 'purple',
    'Veterano 35+': 'gray',
    'Sub-13': 'green',
    'Sub-15': 'yellow',
  };
  
  return categoryMap[category] || 'blue';
}

export function getStatusBadgeColor(status: string): BadgeColor {
  const statusMap: Record<string, BadgeColor> = {
    'Em Andamento': 'green',
    'Agendado': 'blue',
    'Finalizado': 'gray',
    'Inativo': 'red',
  };
  
  return statusMap[status] || 'gray';
}