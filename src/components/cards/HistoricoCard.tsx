// src/components/cards/HistoricoCard.tsx

import React from 'react';
import { Calendar, MapPin, Clock, Eye, FileText } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { SettingsDropdown } from '@/components/molecules/SettingsDropdown';
import type { DropdownMenuItem } from '@/components/molecules/DropdownMenu';
import type { Jogo } from '@/types/jogo.types';

interface HistoricoCardProps {
  jogo: Jogo;
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
}

export function HistoricoCard({ 
  jogo, 
  activeDropdown,
  onToggleDropdown,
}: HistoricoCardProps) {
  const [mostrarDetalhes, setMostrarDetalhes] = React.useState(false);

  // Formatar data
  const dataFormatada = new Date(jogo.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const diaSemana = new Date(jogo.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
  });

  // Itens do menu dropdown
  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Ver Detalhes',
      icon: Eye,
      onClick: () => setMostrarDetalhes(!mostrarDetalhes),
    },
    {
      label: 'Ver Relatório',
      icon: FileText,
      onClick: () => {
        // TODO: Abrir modal com relatório completo
        console.log('Ver relatório:', jogo.id);
      },
    },
  ];

  // Conta cartões por time
  const cartoesTimeCasa = jogo.cartoes?.filter(c => c.time === 'casa') || [];
  const cartoesTimeVisitante = jogo.cartoes?.filter(c => c.time === 'visitante') || [];
  const amarelosCasa = cartoesTimeCasa.filter(c => c.tipo === 'amarelo').length;
  const vermelhosCasa = cartoesTimeCasa.filter(c => c.tipo === 'vermelho').length;
  const amarelosVisitante = cartoesTimeVisitante.filter(c => c.tipo === 'amarelo').length;
  const vermelhosVisitante = cartoesTimeVisitante.filter(c => c.tipo === 'vermelho').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
      
      {/* Dropdown de ações */}
      <SettingsDropdown
        id={`historico-${jogo.id}`}
        items={menuItems}
        activeDropdown={activeDropdown}
        onToggleDropdown={onToggleDropdown}
        position="top-right"
      />

      {/* Header com status */}
      <div className="flex items-center mb-4">
        <Badge variant="filled" color="gray">
          Finalizado
        </Badge>
      </div>

      {/* Times e Placar */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-6">
          {/* Time Casa */}
          <div className="flex flex-col items-center flex-1">
            <img 
              src={jogo.timeCasa.escudo} 
              alt={`Escudo ${jogo.timeCasa.nome}`}
              className="w-16 h-16 object-contain mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/shields/default.svg';
              }}
            />
            <span className="font-semibold text-gray-900 text-center text-sm">
              {jogo.timeCasa.nome}
            </span>
            <span className="text-3xl font-bold text-blue-600 mt-2">
              {jogo.placarCasa}
            </span>
            {/* Cartões do time casa */}
            {(amarelosCasa > 0 || vermelhosCasa > 0) && (
              <div className="flex items-center gap-1 mt-2">
                {amarelosCasa > 0 && (
                  <span className="text-xs text-yellow-600 font-semibold">
                    🟨 {amarelosCasa}
                  </span>
                )}
                {vermelhosCasa > 0 && (
                  <span className="text-xs text-red-600 font-semibold">
                    🟥 {vermelhosCasa}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* X no meio */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-400 mb-2">X</span>
          </div>

          {/* Time Visitante */}
          <div className="flex flex-col items-center flex-1">
            <img 
              src={jogo.timeVisitante.escudo} 
              alt={`Escudo ${jogo.timeVisitante.nome}`}
              className="w-16 h-16 object-contain mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/shields/default.svg';
              }}
            />
            <span className="font-semibold text-gray-900 text-center text-sm">
              {jogo.timeVisitante.nome}
            </span>
            <span className="text-3xl font-bold text-blue-600 mt-2">
              {jogo.placarVisitante}
            </span>
            {/* Cartões do time visitante */}
            {(amarelosVisitante > 0 || vermelhosVisitante > 0) && (
              <div className="flex items-center gap-1 mt-2">
                {amarelosVisitante > 0 && (
                  <span className="text-xs text-yellow-600 font-semibold">
                    🟨 {amarelosVisitante}
                  </span>
                )}
                {vermelhosVisitante > 0 && (
                  <span className="text-xs text-red-600 font-semibold">
                    🟥 {vermelhosVisitante}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        {/* Data e Horário */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="capitalize">{diaSemana}</span>
          <span>{dataFormatada}</span>
          <Clock className="w-4 h-4 text-blue-500 ml-2" />
          <span>{jogo.horario}</span>
        </div>

        {/* Local */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-green-500" />
          <span>{jogo.estadio}</span>
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {mostrarDetalhes && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          
          {/* Gols do Time Casa */}
          {jogo.golsCasa && jogo.golsCasa.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                ⚽ Gols de {jogo.timeCasa.nome}
              </h4>
              <div className="space-y-1">
                {jogo.golsCasa.map((gol, index) => (
                  <div key={index} className="text-xs text-gray-600 pl-4">
                    • {gol.jogador} {gol.minuto && `(${gol.minuto}')`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gols do Time Visitante */}
          {jogo.golsVisitante && jogo.golsVisitante.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                ⚽ Gols de {jogo.timeVisitante.nome}
              </h4>
              <div className="space-y-1">
                {jogo.golsVisitante.map((gol, index) => (
                  <div key={index} className="text-xs text-gray-600 pl-4">
                    • {gol.jogador} {gol.minuto && `(${gol.minuto}')`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cartões */}
          {jogo.cartoes && jogo.cartoes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Cartões
              </h4>
              <div className="space-y-1">
                {jogo.cartoes.map((cartao, index) => (
                  <div key={index} className="text-xs text-gray-600 pl-4 flex items-center gap-2">
                    <span>{cartao.tipo === 'amarelo' ? '🟨' : '🟥'}</span>
                    <span>{cartao.jogador}</span>
                    <span className="text-gray-400">
                      ({cartao.time === 'casa' ? jogo.timeCasa.nome : jogo.timeVisitante.nome})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relatório */}
          {jogo.relatorioArbitro && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Relatório da Partida
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {jogo.relatorioArbitro}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botão para expandir/recolher */}
      <button
        onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
        className="w-full mt-3 pt-3 border-t border-gray-100 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {mostrarDetalhes ? 'Ocultar detalhes ▲' : 'Ver detalhes ▼'}
      </button>
    </div>
  );
}