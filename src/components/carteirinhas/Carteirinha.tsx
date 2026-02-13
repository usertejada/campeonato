// src/components/carteirinhas/Carteirinha.tsx

import React from 'react';
import type { Player } from '@/types/player.types';
import type { Team } from '@/types/team.types';
import type { Championship } from '@/types/championship.types';

interface CarteirinhaProps {
  jogador: Player;
  time: Team;
  campeonato: Championship;
  lado: 'frente' | 'verso';
}

export function Carteirinha({ jogador, time, campeonato, lado }: CarteirinhaProps) {
  if (lado === 'frente') {
    return (
      <div 
        className="w-87.5 h-55 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl overflow-hidden relative"
        style={{
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          colorAdjust: 'exact'
        }}
      >
        {/* Padrão de fundo */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}
        >
          <div 
            className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"
            style={{
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"
            style={{
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}
          ></div>
        </div>

        {/* Conteúdo */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-start gap-3 mb-5">
            {/* Logo no canto esquerdo */}
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden shrink-0">
              {campeonato.logo.startsWith('http') || campeonato.logo.startsWith('/') || campeonato.logo.startsWith('data:') ? (
                <img src={campeonato.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl leading-none">{campeonato.logo || '🏆'}</span>
              )}
            </div>
            
            {/* Título */}
            <div className="flex-1 text-center">
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                {campeonato.name}
              </h2>
              <p className="text-blue-200 text-[10px] uppercase tracking-wider mt-1">
                {campeonato.organizer}
              </p>
            </div>

            {/* Espaço para manter simetria (invisível) */}
            <div className="w-11 h-11 shrink-0"></div>
          </div>

          {/* Corpo */}
          <div className="flex gap-3 flex-1">
            {/* Foto 3x4 */}
            <div className="w-20 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-blue-300 shadow-lg">
              {jogador.photo && jogador.photo.length > 5 ? (
                <img src={jogador.photo} alt={jogador.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-2xl">
                    {jogador.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Dados */}
            <div className="flex-1 space-y-1 text-white">
              <div>
                <p className="text-[9px] text-blue-200 uppercase tracking-wide">Nome</p>
                <p className="text-[11px] font-semibold leading-tight">{jogador.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-blue-200 uppercase tracking-wide">Nasc.</p>
                  <p className="text-[10px] font-medium">
                    {new Date(jogador.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-blue-200 uppercase tracking-wide">
                    {jogador.documentType === 'cpf' ? 'CPF' : 
                     jogador.documentType === 'rg' ? 'RG' :
                     jogador.documentType === 'dni_colombia' ? 'DNI COL' :
                     jogador.documentType === 'dni_peru' ? 'DNI PER' : 'DOC'}
                  </p>
                  <p className="text-[10px] font-medium">
                    {jogador.documentType === 'cpf' ? jogador.cpf :
                     jogador.documentType === 'rg' ? jogador.rg :
                     jogador.documentType === 'dni_colombia' ? jogador.dni_colombia :
                     jogador.documentType === 'dni_peru' ? jogador.dni_peru : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-blue-200 uppercase tracking-wide">Nacionalidade</p>
                  <p className="text-[10px] font-medium">{jogador.nationality}</p>
                </div>
                <div>
                  <p className="text-[9px] text-blue-200 uppercase tracking-wide">Time</p>
                  <p className="text-[11px] font-semibold">{time.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-2 pt-2 border-t border-blue-400 flex items-center justify-between text-white">
            <div className="flex items-baseline gap-1">
              <p className="text-[8px] text-blue-200">CAMISA</p>
              <p className="text-lg font-bold">#{ jogador.shirtNumber}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-[8px] text-blue-200">POSIÇÃO</p>
              <p className="text-sm font-semibold">{jogador.position}</p>
            </div>
          </div>
        </div>

        {/* Selo de autenticidade */}
        <div 
          className="absolute top-4 right-2 w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
          style={{
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}
        >
          <span className="text-yellow-900 text-xs font-bold">✓</span>
        </div>
      </div>
    );
  }

  // VERSO
  return (
    <div className="w-87.5 h-55 bg-white rounded-xl shadow-2xl overflow-hidden relative border-2 border-blue-600">
      {/* Padrão de fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px'
        }}></div>
      </div>

      {/* Conteúdo */}
      <div className="relative h-full p-5 flex flex-col">
        {/* Título */}
        <div className="text-center mb-4 pb-3 border-b-2 border-blue-200">
          <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide">
            Carteira de Identificação
          </h3>
          <p className="text-blue-600 text-[10px] mt-1">{campeonato.name}</p>
        </div>

        {/* Assinaturas */}
        <div className="flex-1 space-y-4">
          {/* Assinatura do Presidente */}
          <div>
            <div className="border-b border-gray-400 h-12 mb-1"></div>
            <p className="text-[9px] text-gray-600 text-center uppercase tracking-wide">
              Presidente da Liga
            </p>
          </div>

          {/* Assinatura do Técnico */}
          <div>
            <div className="border-b border-gray-400 h-12 mb-1"></div>
            <p className="text-[9px] text-gray-600 text-center uppercase tracking-wide">
              Técnico - {time.coach || 'N/A'}
            </p>
          </div>

          {/* Assinatura do Jogador */}
          <div>
            <div className="border-b border-gray-400 h-12 mb-1"></div>
            <p className="text-[9px] text-gray-600 text-center uppercase tracking-wide">
              Assinatura do Atleta
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-[8px] text-gray-500 leading-tight">
            Esta carteirinha é válida apenas para o campeonato {campeonato.name}
            <br />
            Período: {new Date(campeonato.startDate).toLocaleDateString('pt-BR')} a {new Date(campeonato.endDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}