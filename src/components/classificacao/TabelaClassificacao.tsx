// src/components/classificacao/TabelaClassificacao.tsx

import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { LinhaClassificacao } from './LinhaClassificacao';
import { CardClassificacaoMobile } from './CardClassificacaoMobile';
import type { EstatisticaTime } from '@/hooks/entities/useClassificacao';

interface TabelaClassificacaoProps {
  classificacao: EstatisticaTime[];
}

export function TabelaClassificacao({ classificacao }: TabelaClassificacaoProps) {
  // Função para retornar o ícone de variação de posição
  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) {
      return <Icon icon={TrendingUp} size={16} className="text-green-600" />;
    } else if (variacao < 0) {
      return <Icon icon={TrendingDown} size={16} className="text-red-600" />;
    } else {
      return <Icon icon={Minus} size={16} className="text-gray-400" />;
    }
  };

  // Função para retornar a cor de fundo dos últimos jogos
  const getUltimosJogosColor = (resultado: 'V' | 'E' | 'D') => {
    switch (resultado) {
      case 'V':
        return 'bg-green-500';
      case 'E':
        return 'bg-yellow-500';
      case 'D':
        return 'bg-red-500';
    }
  };

  // Função para retornar a cor da barra lateral baseada na posição
  const getBarraLateralColor = (posicao: number) => {
    if (posicao <= 4) return 'bg-blue-500';
    if (posicao <= 6) return 'bg-green-500';
    if (posicao <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Função para retornar o ícone de troféu (1º, 2º, 3º)
  const getTrofeuIcon = (posicao: number) => {
    if (posicao === 1) return <Icon icon={Trophy} size={20} className="text-yellow-500" />;
    if (posicao === 2) return <Icon icon={Trophy} size={20} className="text-gray-400" />;
    if (posicao === 3) return <Icon icon={Trophy} size={20} className="text-orange-500" />;
    return null;
  };

  // Estado vazio
  if (classificacao.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Icon icon={Trophy} size={64} className="text-gray-300" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum time encontrado
            </h3>
            <p className="text-gray-500">
              Cadastre times e finalize partidas para ver a classificação
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Tabela Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-slate-800 to-slate-900 text-white">
              <th className="py-4 px-4 text-center text-sm font-bold tracking-wider w-16">POS</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-12"></th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-12"></th>
              <th className="py-4 px-6 text-left text-sm font-bold tracking-wider">TIME</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">P</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">J</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">V</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">E</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">D</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">GP</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">GC</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-16">SG</th>
              <th className="py-4 px-3 text-center text-sm font-bold tracking-wider w-20">%</th>
              <th className="py-4 px-4 text-center text-sm font-bold tracking-wider w-32">ÚLTIMOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classificacao.map((stat, index) => (
              <LinhaClassificacao
                key={stat.time.id}
                stat={stat}
                index={index}
                getBarraLateralColor={getBarraLateralColor}
                getVariacaoIcon={getVariacaoIcon}
                getTrofeuIcon={getTrofeuIcon}
                getUltimosJogosColor={getUltimosJogosColor}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden divide-y divide-gray-100">
        {classificacao.map((stat, index) => (
          <CardClassificacaoMobile
            key={stat.time.id}
            stat={stat}
            index={index}
            getBarraLateralColor={getBarraLateralColor}
            getVariacaoIcon={getVariacaoIcon}
            getTrofeuIcon={getTrofeuIcon}
            getUltimosJogosColor={getUltimosJogosColor}
          />
        ))}
      </div>
    </div>
  );
}