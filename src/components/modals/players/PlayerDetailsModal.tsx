// src/components/modals/PlayerDetailsModal.tsx
import React from 'react';
import { Mail, Phone, Calendar, MapPin, Shield, Hash, User, Download } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { IOSModal } from '@/components/iosreutilizavel/atoms/IOSModal';
import { IOSSection } from '@/components/iosreutilizavel/atoms/IOSSection';
import { IOSLabel } from '@/components/iosreutilizavel/atoms/IOSLabel';
import { IOSValue } from '@/components/iosreutilizavel/atoms/IOSValue';
import { IOSModalHeader } from '@/components/iosreutilizavel/molecules/IOSModalHeader';
import type { Player } from '@/types/player.types';

interface PlayerDetailsModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerDetailsModal({
  player,
  isOpen,
  onClose,
}: PlayerDetailsModalProps) {

  // Cor do status baseada em isActive
  const statusColor = player.isActive ? 'green' : 'gray';
  const statusLabel = player.isActive ? 'Ativo' : 'Inativo';

  // Foto do jogador - verifica se é URL de imagem, base64 ou iniciais
  const isImageUrl = player.photo && (
    player.photo.startsWith('data:image') || 
    player.photo.startsWith('http') || 
    player.photo.startsWith('/')
  );

  const playerPhoto = isImageUrl ? (
    <img
      src={player.photo}
      alt={player.name}
      className="w-12 h-12 object-cover rounded-full"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
      <span className="text-white font-bold text-lg">{player.photo}</span>
    </div>
  );

  // Formatar data de nascimento
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <IOSModal isOpen={isOpen} onClose={onClose}>

      {/* Header */}
      <IOSModalHeader
        title={player.name}
        subtitle={player.position}
        logo={playerPhoto}
        status={statusLabel}
        statusColor={statusColor}
      />

      {/* Info Grid - Time + Número da Camisa */}
      <IOSSection>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="col-span-2">
            <IOSLabel>Time</IOSLabel>
            <IOSValue icon={<Icon icon={Shield} size={14} className="text-gray-400" />}>
              {player.teamName}
            </IOSValue>
          </div>

          <div className="border-t border-black/5 pt-3">
            <IOSLabel>Camisa</IOSLabel>
            <IOSValue icon={<Icon icon={Hash} size={14} className="text-gray-400" />}>
              Nº {player.shirtNumber}
            </IOSValue>
          </div>

          <div className="border-t border-black/5 pt-3">
            <IOSLabel>Posição</IOSLabel>
            <IOSValue icon={<Icon icon={User} size={14} className="text-gray-400" />}>
              {player.position}
            </IOSValue>
          </div>
        </div>
      </IOSSection>

      {/* Dados Pessoais */}
      <IOSSection>
        <IOSLabel>Dados Pessoais</IOSLabel>

        <div className="grid grid-cols-2 gap-y-4">
          <IOSValue icon={<Icon icon={Calendar} size={14} className="text-gray-400" />}>
            {formatDate(player.birthDate)}
          </IOSValue>

          <IOSValue icon={<Icon icon={MapPin} size={14} className="text-gray-400" />}>
            {player.nationality}
          </IOSValue>
        </div>
      </IOSSection>

      {/* Contato */}
      <IOSSection>
        <IOSLabel>Contato</IOSLabel>

        <div className="flex flex-col gap-2.5 mt-1">
          {player.phone && (
            <IOSValue icon={<Icon icon={Phone} size={14} className="text-gray-400" />}>
              {player.phone}
            </IOSValue>
          )}
        </div>
      </IOSSection>

      {/* Documento com Foto (se houver) */}
      {player.documentPhoto && (
        <IOSSection>
          <IOSLabel>Documento</IOSLabel>
          <div className="mt-1">
            <a
              href={player.documentPhoto}
              download="documento-jogador.jpg"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Icon icon={Download} size={16} className="text-blue-600" />
              <span>Baixar documento</span>
            </a>
          </div>
        </IOSSection>
      )}

    </IOSModal>
  );
}