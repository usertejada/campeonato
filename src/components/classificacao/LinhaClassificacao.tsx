// src/components/classificacao/LinhaClassificacao.tsx

import React from 'react';
import type { EstatisticaTime } from '@/hooks/entities/useClassificacao';

interface LinhaClassificacaoProps {
  stat: EstatisticaTime;
  index: number;
  getBarraLateralColor: (posicao: number) => string;
  getVariacaoIcon: (variacao: number) => React.ReactElement;
  getTrofeuIcon: (posicao: number) => React.ReactElement | null;
  getUltimosJogosColor: (resultado: 'V' | 'E' | 'D') => string;
}

export function LinhaClassificacao({
  stat,
  index,
  getBarraLateralColor,
  getVariacaoIcon,
  getTrofeuIcon,
  getUltimosJogosColor,
}: LinhaClassificacaoProps) {
  return (
    <tr
      className="hover:bg-blue-50 transition-colors group relative animate-fade-in"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Posição com Barra Lateral */}
      <td className="py-4 px-4 text-center relative">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${getBarraLateralColor(stat.posicao)}`}></div>
        <span className="font-bold text-gray-900 text-base">
          {stat.posicao}
        </span>
      </td>

      {/* Ícone de Variação */}
      <td className="py-4 px-3 text-center">
        {getVariacaoIcon((stat as any).variacao || 0)}
      </td>

      {/* Troféu (1º, 2º, 3º) */}
      <td className="py-4 px-3 text-center">
        {getTrofeuIcon(stat.posicao)}
      </td>

      {/* Time */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0">
            <img 
              src={stat.time.logo} 
              alt={`Escudo ${stat.time.name}`}
              className="w-12 h-12 rounded-xl object-contain shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      ${stat.time.name.substring(0, 2).toUpperCase()}
                    </div>
                  `;
                }
              }}
            />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">
              {stat.time.name}
            </div>
            <div className="text-xs text-gray-500">
              {stat.time.championshipName}
            </div>
          </div>
        </div>
      </td>

      {/* Pontos */}
      <td className="py-4 px-3 text-center">
        <span className="font-black text-2xl text-blue-600">
          {stat.pontos}
        </span>
      </td>

      {/* Jogos */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-gray-700">
          {stat.jogos}
        </span>
      </td>

      {/* Vitórias */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-green-600">
          {stat.vitorias}
        </span>
      </td>

      {/* Empates */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-yellow-600">
          {stat.empates}
        </span>
      </td>

      {/* Derrotas */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-red-600">
          {stat.derrotas}
        </span>
      </td>

      {/* Gols Pró */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-gray-700">
          {stat.golsPro}
        </span>
      </td>

      {/* Gols Contra */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-gray-700">
          {stat.golsContra}
        </span>
      </td>

      {/* Saldo */}
      <td className="py-4 px-3 text-center">
        <span className={`font-bold ${
          stat.saldoGols > 0 ? 'text-green-600' :
          stat.saldoGols < 0 ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {stat.saldoGols > 0 ? '+' : ''}{stat.saldoGols}
        </span>
      </td>

      {/* Aproveitamento */}
      <td className="py-4 px-3 text-center">
        <span className="font-semibold text-gray-700">
          {stat.aproveitamento.toFixed(0)}%
        </span>
      </td>

      {/* Últimos Jogos */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-1">
          {stat.ultimosJogos.map((resultado, idx) => (
            <div
              key={idx}
              className={`
                w-6 h-6 rounded-md ${getUltimosJogosColor(resultado)}
                flex items-center justify-center text-white text-xs font-bold
                shadow-sm
              `}
              title={
                resultado === 'V' ? 'Vitória' :
                resultado === 'E' ? 'Empate' : 'Derrota'
              }
            >
              {resultado}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}