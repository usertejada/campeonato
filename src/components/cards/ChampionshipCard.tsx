// src/components/cards/ChampionshipCard.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { DropdownMenu } from '../molecules/DropdownMenu';
import type { DropdownMenuItem } from '../molecules/DropdownMenu';
import { Trophy, Users, Calendar, Power, Edit, Eye, Trash2 } from 'lucide-react';
import type { BadgeColor } from '../../utils/helpers/badge.helper'; // ✅ IMPORTADO

interface ChampionshipCardProps {
  id: string;
  logo: string;
  name: string;
  organizer: string;
  category: string;
  status: string;
  teams: number;
  format: string;
  startDate: string;
  endDate: string;
  categoryBadgeVariant?: 'dot' | 'text' | 'filled';
  categoryBadgeColor?: BadgeColor; // ✅ CORRIGIDO
  statusBadgeColor?: BadgeColor;   // ✅ CORRIGIDO
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function ChampionshipCard({
  id,
  logo,
  name,
  organizer,
  category,
  status,
  teams,
  format,
  startDate,
  endDate,
  categoryBadgeVariant = 'dot',
  categoryBadgeColor = 'blue',
  statusBadgeColor = 'green',
  activeDropdown,
  onToggleDropdown,
  onToggleStatus,
  onDelete,
  onEdit,
  onViewDetails,
}: ChampionshipCardProps) {
  
  // Define os itens do menu dropdown
  const dropdownItems: DropdownMenuItem[] = [
    {
      label: status === 'Inativo' ? 'Ativar' : 'Desativar',
      icon: Power,
      onClick: () => onToggleStatus(id)
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: () => onEdit?.(id)
    },
    {
      label: 'Ver Detalhes',
      icon: Eye,
      onClick: () => onViewDetails?.(id)
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: () => onDelete(id),
      variant: 'danger',
      divider: true
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
      {/* Menu de ações - Componente Reutilizável */}
      <DropdownMenu
        id={id}
        items={dropdownItems}
        activeDropdown={activeDropdown}
        onToggleDropdown={onToggleDropdown}
        position="top-right"
      />

      {/* Header com fundo azul claro */}
      <div className="bg-blue-100 rounded-xl p-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            {/* Logo */}
            <div className="overflow-hidden w-16 h-16 flex items-center justify-center">
              {logo && logo.startsWith('data:image') ? (
                <img src={logo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{logo || '🏆'}</span>
              )}
            </div>
          </div>
          
          {/* Título e organizador */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{name}</h3>
          <p className="text-xs text-gray-600 truncate">{organizer}</p>
        </div>
      </div>

      {/* Body do card */}
      <div className="p-5 space-y-4">
        {/* Badge de categoria com variante personalizável */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={categoryBadgeVariant} color={categoryBadgeColor}>
            {category.toUpperCase()}
          </Badge>
        </div>
        
        {/* Informações */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Icon icon={Users} size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600 font-medium">{teams} times inscritos</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={Trophy} size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600 font-medium">{format}</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={Calendar} size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600 font-medium">
              {new Date(startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {new Date(endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Badge de status no canto inferior direito */}
        <div className="flex justify-end">
          <Badge variant="filled" color={statusBadgeColor}>
            {status.toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
}