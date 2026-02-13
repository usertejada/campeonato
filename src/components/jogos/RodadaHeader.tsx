// src/components/jogos/RodadaHeader.tsx

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface RodadaHeaderProps {
  titulo: string;
  subtitulo?: string;
  local?: string;
  data?: string;
  horario?: string;
  className?: string;
}

export function RodadaHeader({
  titulo,
  subtitulo,
  local,
  data,
  horario,
  className = '',
}: RodadaHeaderProps) {
  return (
    <div className={`border-b border-gray-200 pb-3 ${className}`}>
      {/* Título da Rodada */}
      <h2 className="text-lg font-bold text-gray-900 mb-2">{titulo}</h2>

      {/* Informações em linha */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {/* Data */}
        {data && (
          <>
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="capitalize">{data}</span>
          </>
        )}

        {/* Separador e Local */}
        {local && data && <span className="text-gray-400">|</span>}
        {local && (
          <>
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{local}</span>
          </>
        )}

        {/* Horário em nova linha ou continuação */}
        {local && data && <span className="text-gray-400">|</span>}
        {horario && (
          <>
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{horario}</span>
          </>
        )}
      </div>
    </div>
  );
}