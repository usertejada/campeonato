// src/components/historico/HeaderTimes.tsx

import React from 'react';
import type { Jogo } from '@/types/jogo.types';

interface HeaderTimesProps {
  jogo: Jogo;
}

export function HeaderTimes({ jogo }: HeaderTimesProps) {
  return (
    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-100">
      <div className="flex items-center justify-center gap-6">
        {/* Time Casa */}
        <div className="flex flex-col items-center flex-1">
          <img 
            src={jogo.timeCasa.escudo} 
            alt={jogo.timeCasa.nome}
            className="w-16 h-16 object-contain mb-2"
          />
          <span className="font-bold text-gray-900 text-center text-sm">
            {jogo.timeCasa.nome}
          </span>
        </div>

        <div className="text-3xl font-bold text-gray-400">VS</div>

        {/* Time Visitante */}
        <div className="flex flex-col items-center flex-1">
          <img 
            src={jogo.timeVisitante.escudo} 
            alt={jogo.timeVisitante.nome}
            className="w-16 h-16 object-contain mb-2"
          />
          <span className="font-bold text-gray-900 text-center text-sm">
            {jogo.timeVisitante.nome}
          </span>
        </div>
      </div>
    </div>
  );
}