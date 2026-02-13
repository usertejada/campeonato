// src/components/jogos/TempoJogoCard.tsx

import React from 'react';
import { Clock } from 'lucide-react';
import { CardHeader } from './CardHeader';
import type { TempoJogo } from '@/types/parametros-jogos.types';

interface TempoJogoCardProps {
  tempoSelecionado: TempoJogo | null;
  temposDisponiveis: TempoJogo[];
  onSelecionar: (tempo: TempoJogo) => void;
}

export function TempoJogoCard({
  tempoSelecionado,
  temposDisponiveis,
  onSelecionar,
}: TempoJogoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 h-60 flex flex-col">
      <CardHeader
        icon={Clock}
        iconColor="purple"
        title="Tempo de Jogo"
        subtitle="Escolha a duração das partidas"
      />

      <div className="flex-1 grid grid-cols-3 gap-2 overflow-y-auto content-start p-3">
        {temposDisponiveis.map((tempo) => {
          const isSelected = tempoSelecionado?.id === tempo.id;
          return (
            <button
              key={tempo.id}
              onClick={() => onSelecionar(tempo)}
              className={`
                h-20 rounded-lg border-2 transition-all font-semibold flex flex-col items-center justify-center 
                ${
                  isSelected
                    ? 'bg-purple-500 border-purple-600 text-white shadow-md scale-105'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }
              `}
            >
              <span className="text-md">{tempo.label}</span>
              <span className="text-xs opacity-80">
                {tempo.primeiroTempo + tempo.segundoTempo} min
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}