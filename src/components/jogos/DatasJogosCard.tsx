// src/components/jogos/DatasJogosCard.tsx

import React from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { Badge } from '@/components/atoms/Badge';
import { CardHeader } from './CardHeader';

interface DatasJogosCardProps {
  datasSelecionadas: string[];
  temDatasParaCalendario: boolean;
  onAbrirCalendario: () => void;
  onRemoverData: (dateStr: string) => void;
}

export function DatasJogosCard({
  datasSelecionadas,
  temDatasParaCalendario,
  onAbrirCalendario,
  onRemoverData,
}: DatasJogosCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 h-60 flex flex-col">
      <div className="flex items-center justify-between flex-linear-0 mb-3">
        <CardHeader
          icon={Calendar}
          iconColor="pink"
          title="Datas dos Jogos"
          subtitle="Escolha o dia do jogo"
        />

        {temDatasParaCalendario && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAbrirCalendario}
            className="px-3!"
          >
            <Calendar className="w-5 h-7" />
          </Button>
        )}
      </div>

      {/* Lista de datas selecionadas */}
      {datasSelecionadas && datasSelecionadas.length > 0 ? (
        <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 content-start">
          {datasSelecionadas.sort().map((dateStr) => {
            const date = new Date(dateStr + 'T00:00:00');
            const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const dayName = dayNames[date.getDay()];
            const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(
              date.getMonth() + 1
            ).padStart(2, '0')}`;

            return (
              <Badge key={dateStr} variant="filled" color="purple" className="gap-2">
                <span>
                  {dayName} {formatted}
                </span>
                <button
                  onClick={() => onRemoverData(dateStr)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          {temDatasParaCalendario
            ? 'Clique em "Selecionar" para escolher as datas'
            : 'Selecione um campeonato primeiro'}
        </div>
      )}
    </div>
  );
}