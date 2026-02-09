// src/components/modals/TeamDetailsModal.tsx
import React from 'react';
import { Mail, Phone, Calendar, Users, Shield } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { IOSModal } from '@/components/iosreutilizavel/atoms/IOSModal';
import { IOSSection } from '@/components/iosreutilizavel/atoms/IOSSection';
import { IOSLabel } from '@/components/iosreutilizavel/atoms/IOSLabel';
import { IOSValue } from '@/components/iosreutilizavel/atoms/IOSValue';
import { IOSModalHeader } from '@/components/iosreutilizavel/molecules/IOSModalHeader';
import type { Team } from '@/types/team.types';

interface TeamDetailsModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamDetailsModal({
  team,
  isOpen,
  onClose,
}: TeamDetailsModalProps) {

  // Cor do status baseada em isActive
  const statusColor = team.isActive ? 'green' : 'gray';
  const statusLabel = team.isActive ? 'Ativo' : 'Inativo';

  // Logo component — espelha a lógica do ChampionshipDetailsModal
  const logo = team.logo && (team.logo.startsWith('data:image') || team.logo.startsWith('http') || team.logo.startsWith('/')) ? (
    <img
      src={team.logo}
      alt={team.name}
      className="w-8 h-8 object-cover rounded-lg"
    />
  ) : (
    <Icon icon={Shield} size={32} className="text-blue-500" strokeWidth={2.2} />
  );

  return (
    <IOSModal isOpen={isOpen} onClose={onClose}>

      {/* Header */}
      <IOSModalHeader
        title={team.name}
        subtitle={`Tec. ${team.coach}`}
        logo={logo}
        status={statusLabel}
        statusColor={statusColor}
      />

      {/* Info Grid — Campeonato + Jogadores */}
      <IOSSection>
        <div className="grid grid-cols-2 gap-y-5">
          <div className="col-span-2">
            <IOSLabel>Campeonato</IOSLabel>
            <IOSValue>
              {team.championshipName}
            </IOSValue>
          </div>

          <div className="border-t border-black/5 pt-4">
            <IOSLabel>Jogadores</IOSLabel>
            <IOSValue icon={<Icon icon={Users} size={14} className="text-gray-400" />}>
              {team.players} Jogadores
            </IOSValue>
          </div>

          <div className="border-t border-black/5 pt-4">
            <IOSLabel>Fundado</IOSLabel>
            <IOSValue icon={<Icon icon={Calendar} size={14} className="text-gray-400" />}>
              {team.foundedYear}
            </IOSValue>
          </div>
        </div>
      </IOSSection>

      {/* Contato */}
      <IOSSection>
        <IOSLabel>Contato</IOSLabel>

        <div className="flex flex-col gap-3 mt-1">
          <IOSValue icon={<Icon icon={Mail} size={14} className="text-gray-400" />}>
            {team.email}
          </IOSValue>

          {team.phone && (
            <IOSValue icon={<Icon icon={Phone} size={14} className="text-gray-400" />}>
              {team.phone}
            </IOSValue>
          )}
        </div>
      </IOSSection>

    </IOSModal>
  );
}