// src/components/cards/JogosCard.tsx

import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { SettingsDropdown } from '@/components/molecules/SettingsDropdown';
import type { DropdownMenuItem } from '@/components/molecules/DropdownMenu';
import type { Jogo } from '@/types/jogo.types';

interface JogosCardProps {
  jogo: Jogo;
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onFinalizarJogo: () => void;
  onAdiarJogo: (jogoId: string) => void;
}

export function JogosCard({ 
  jogo, 
  activeDropdown,
  onToggleDropdown,
  onFinalizarJogo,
  onAdiarJogo 
}: JogosCardProps) {
  // Formatar data
  const dataFormatada = new Date(jogo.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const diaSemana = new Date(jogo.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
  });

  // Definir cor do badge baseado no status
  const getStatusBadge = () => {
    switch (jogo.status) {
      case 'finalizado':
        return { color: 'gray' as const, label: 'Finalizado' };
      case 'ao-vivo':
        return { color: 'red' as const, label: 'Ao Vivo' };
      case 'agendado':
        return { color: 'green' as const, label: 'Agendado' };
      default:
        return { color: 'gray' as const, label: 'Agendado' };
    }
  };

  const statusBadge = getStatusBadge();

  // Itens do menu dropdown para jogos
  const gameMenuItems: DropdownMenuItem[] = [
    {
      label: 'Finalizar Partida',
      icon: CheckCircle,
      onClick: onFinalizarJogo,
    },
    {
      label: 'Adiar Partida',
      icon: CalendarIcon,
      onClick: () => onAdiarJogo(jogo.id),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
      
      {/* Dropdown de ações (SettingsDropdown já tem position absolute interno) */}
      {jogo.status !== 'finalizado' && (
        <SettingsDropdown
          id={`game-${jogo.id}`}
          items={gameMenuItems}
          activeDropdown={activeDropdown}
          onToggleDropdown={onToggleDropdown}
          position="top-right"
        />
      )}

      {/* Header com status */}
      <div className="flex items-center mb-4">
        <Badge variant="filled" color={statusBadge.color}>
          {statusBadge.label}
        </Badge>
      </div>

      {/* Times e Placar */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-6">
          {/* Time Casa */}
          <div className="flex flex-col items-center flex-1">
            <img 
              src={jogo.timeCasa.escudo} 
              alt={`Escudo ${jogo.timeCasa.nome}`}
              className="w-16 h-16 object-contain mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/shields/default.svg';
              }}
            />
            <span className="font-semibold text-gray-900 text-center text-sm">
              {jogo.timeCasa.nome}
            </span>
            {jogo.placarCasa !== null && (
              <span className="text-3xl font-bold text-blue-600 mt-2">
                {jogo.placarCasa}
              </span>
            )}
          </div>

          {/* X no meio */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-400 mb-2">X</span>
          </div>

          {/* Time Visitante */}
          <div className="flex flex-col items-center flex-1">
            <img 
              src={jogo.timeVisitante.escudo} 
              alt={`Escudo ${jogo.timeVisitante.nome}`}
              className="w-16 h-16 object-contain mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/shields/default.svg';
              }}
            />
            <span className="font-semibold text-gray-900 text-center text-sm">
              {jogo.timeVisitante.nome}
            </span>
            {jogo.placarVisitante !== null && (
              <span className="text-3xl font-bold text-blue-600 mt-2">
                {jogo.placarVisitante}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        {/* Data e Horário */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="capitalize">{diaSemana}</span>
          <span>{dataFormatada}</span>
          <Clock className="w-4 h-4 text-blue-500 ml-2" />
          <span>{jogo.horario}</span>
        </div>

        {/* Local */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-green-500" />
          <span>{jogo.estadio}</span>
        </div>
      </div>
    </div>
  );
}