// src/components/historico/SecaoPlacar.tsx

import React from 'react';
import { Input } from '@/components/atoms/Input';
import type { Jogo } from '@/types/jogo.types';

interface SecaoPlacarProps {
  jogo: Jogo;
  placarCasa: number;
  placarVisitante: number;
  onPlacarCasaChange: (valor: number) => void;
  onPlacarVisitanteChange: (valor: number) => void;
}

export function SecaoPlacar({
  jogo,
  placarCasa,
  placarVisitante,
  onPlacarCasaChange,
  onPlacarVisitanteChange,
}: SecaoPlacarProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label={`Gols ${jogo.timeCasa.nome}`}
        type="number"
        value={placarCasa}
        onChange={(e) => onPlacarCasaChange(Math.max(0, Number(e.target.value)))}
        min={0}
        required
      />
      <Input
        label={`Gols ${jogo.timeVisitante.nome}`}
        type="number"
        value={placarVisitante}
        onChange={(e) => onPlacarVisitanteChange(Math.max(0, Number(e.target.value)))}
        min={0}
        required
      />
    </div>
  );
}