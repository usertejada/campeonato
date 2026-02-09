// src/components/classificacao/CardClassificacaoMobile.tsx

import React from 'react';
import type { EstatisticaTime } from '@/hooks/entities/useClassificacao';

interface CardClassificacaoMobileProps {
  stat: EstatisticaTime;
  index: number;
  getBarraLateralColor: (posicao: number) => string;
  getVariacaoIcon: (variacao: number) => React.ReactElement;
  getTrofeuIcon: (posicao: number) => React.ReactElement | null;
  getUltimosJogosColor: (resultado: 'V' | 'E' | 'D') => string;
}

export function CardClassificacaoMobile({
  stat,
  index,
  getBarraLateralColor,
  getVariacaoIcon,
  getTrofeuIcon,
  getUltimosJogosColor,
}: CardClassificacaoMobileProps) {
  return (
    <div
      className="relative hover:bg-blue-50 transition-colors animate-fade-in"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Barra Lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getBarraLateralColor(stat.posicao)}`}></div>
      
      <div className="p-4 pl-6">
        {/* Header do Card */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Posição */}
            <span className="font-bold text-gray-900 text-lg w-6">
              {stat.posicao}
            </span>
            {/* Variação */}
            {getVariacaoIcon((stat as any).variacao || 0)}
            {/* Troféu */}
            {getTrofeuIcon(stat.posicao)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 shrink-0">
                <img 
                  src={stat.time.logo} 
                  alt={`Escudo ${stat.time.name}`}
                  className="w-10 h-10 rounded-lg object-contain shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          ${stat.time.name.substring(0, 2).toUpperCase()}
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate">
                  {stat.time.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {stat.time.championshipName}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-black text-2xl text-blue-600">
              {stat.pontos}
            </div>
            <div className="text-xs text-gray-500">pontos</div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">J</div>
            <div className="font-semibold text-gray-700">{stat.jogos}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">V</div>
            <div className="font-semibold text-green-600">{stat.vitorias}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">E</div>
            <div className="font-semibold text-yellow-600">{stat.empates}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">D</div>
            <div className="font-semibold text-red-600">{stat.derrotas}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">SG</div>
            <div className={`font-bold ${
              stat.saldoGols > 0 ? 'text-green-600' :
              stat.saldoGols < 0 ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {stat.saldoGols > 0 ? '+' : ''}{stat.saldoGols}
            </div>
          </div>
        </div>

        {/* Últimos Jogos */}
        {stat.ultimosJogos.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Últimos:</span>
            <div className="flex gap-1">
              {stat.ultimosJogos.map((resultado, idx) => (
                <div
                  key={idx}
                  className={`
                    w-6 h-6 rounded-md ${getUltimosJogosColor(resultado)}
                    flex items-center justify-center text-white text-xs font-bold
                    shadow-sm
                  `}
                >
                  {resultado}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}