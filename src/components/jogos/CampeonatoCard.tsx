// src/components/jogos/CampeonatoCard.tsx

import React from 'react';
import { Trophy, X } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { Badge } from '@/components/atoms/Badge';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { CardHeader } from './CardHeader';
import type { Championship } from '@/types/championship.types';
import type { CampeonatoSelecionado } from '@/types/parametros-jogos.types';

interface CampeonatoCardProps {
  campeonatoSelecionado: CampeonatoSelecionado | null;
  campeonatosDisponiveis: Championship[];
  onSelecionar: (championshipId: string) => void;
  onRemover: () => void;
}

export function CampeonatoCard({
  campeonatoSelecionado,
  campeonatosDisponiveis,
  onSelecionar,
  onRemover,
}: CampeonatoCardProps) {
  // Converte championships para options do CustomSelect
  const championshipOptions = campeonatosDisponiveis.map((c) => c.name);
  
  const handleSelectChange = (championshipName: string) => {
    const championship = campeonatosDisponiveis.find((c) => c.name === championshipName);
    if (championship) {
      onSelecionar(championship.id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 h-60 flex flex-col">
      <CardHeader
        icon={Trophy}
        iconColor="blue"
        title="Campeonato"
        subtitle="Selecione um campeonato"
      />

      {campeonatosDisponiveis.length > 0 ? (
        <div className="flex-1 flex flex-col overflow-hidden space-y-3">
          <CustomSelect
            value={campeonatoSelecionado?.nome || ''}
            onChange={handleSelectChange}
            options={championshipOptions}
            placeholder="Selecione um campeonato"
            className="flex-linear-0"
          />

          {campeonatoSelecionado && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 flex-linear-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900">
                  {campeonatoSelecionado.nome}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemover}
                  className="px-2! text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="filled" color="blue">
                  {campeonatoSelecionado.formato}
                </Badge>
                {campeonatoSelecionado.dataInicio && campeonatoSelecionado.dataFim && (
                  <Badge variant="filled" color="blue">
                    {new Date(campeonatoSelecionado.dataInicio).toLocaleDateString('pt-BR')} -{' '}
                    {new Date(campeonatoSelecionado.dataFim).toLocaleDateString('pt-BR')}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Trophy className="w-12 h-12 mb-2 opacity-30" />
          <p className="text-sm">Nenhum campeonato ativo</p>
          <p className="text-xs mt-1">Crie um campeonato primeiro</p>
        </div>
      )}
    </div>
  );
}