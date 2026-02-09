// src/components/historico/ListaGols.tsx

import React from 'react';
import { Input } from '@/components/atoms/Input';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import type { Gol } from '@/types/jogo.types';
import type { Player } from '@/types/player.types';

interface ListaGolsProps {
  titulo: string;
  gols: Gol[];
  jogadores: Player[];
  onAtualizarGol: (index: number, campo: 'jogador' | 'minuto', valor: string | number) => void;
}

export function ListaGols({ titulo, gols, jogadores, onAtualizarGol }: ListaGolsProps) {
  if (gols.length === 0) return null;

  // Cria lista de opções para o select
  const opcoesJogadores = jogadores.map(j => `${j.name} (#${j.shirtNumber})`);

  // Se não tiver jogadores, mostra mensagem
  if (jogadores.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          ⚽ {titulo}
        </h3>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            Nenhum jogador ativo cadastrado neste time. Cadastre jogadores antes de finalizar a partida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        ⚽ {titulo}
      </h3>
      {gols.map((gol, index) => (
        <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="col-span-2">
            <CustomSelect
              label={`Jogador ${index + 1}º gol`}
              value={gol.jogador}
              onChange={(valor) => {
                // Extrai apenas o nome (remove o número da camisa)
                const nome = valor.replace(/\s*\(#\d+\)$/, '');
                onAtualizarGol(index, 'jogador', nome);
              }}
              options={opcoesJogadores}
              placeholder="Selecione o jogador"
              required
            />
          </div>
          <div>
            <Input
              label="Minuto"
              type="number"
              placeholder="Ex: 45"
              value={gol.minuto || ''}
              onChange={(e) => onAtualizarGol(index, 'minuto', e.target.value)}
              min={0}
              max={120}
            />
          </div>
        </div>
      ))}
    </div>
  );
}