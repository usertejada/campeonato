// src/components/modals/PlayerDetailsModal.tsx
import React, { useMemo, useState } from 'react';
import { Mail, Phone, Calendar, MapPin, Shield, Hash, User, Download, Trophy, Award, Eye, FileText, X } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { Modal } from '@/components/molecules/Modal';
import { Badge } from '@/components/atoms/Badge';
import { Tooltip } from '@/components/atoms/Tooltip';
import { playerStatsService } from '@/services/playerStatsService';
import type { Player } from '@/types/player.types';

interface PlayerDetailsModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerDetailsModal({
  player,
  isOpen,
  onClose,
}: PlayerDetailsModalProps) {

  // Estado para controlar visualização do documento
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Calcula estatísticas do jogador
  const stats = useMemo(() => {
    return playerStatsService.calcularEstatisticas(player.id);
  }, [player.id]);

  // Cor do status baseada em isActive
  const statusColor = player.isActive ? 'green' : 'gray';
  const statusLabel = player.isActive ? 'Ativo' : 'Inativo';

  // Foto do jogador - verifica se é URL de imagem, base64 ou iniciais
  const isImageUrl = player.photo && (
    player.photo.startsWith('data:image') || 
    player.photo.startsWith('http') || 
    player.photo.startsWith('/')
  );

  // Formatar data de nascimento
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Detalhes do Jogador"
      size="2xl"
    >
      {/* Header com Foto e Nome */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-gray-200">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          {isImageUrl ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover rounded-full border-2 sm:border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-2 sm:border-4 border-white shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">{player.photo}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{player.name}</h3>
          <div className="flex items-center justify-between mt-1 sm:mt-1.5">
            <p className="text-xs sm:text-sm text-gray-600">{player.position}</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${player.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`text-xs sm:text-sm font-medium ${player.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 3 Colunas: Time, Camisa e Posição */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">Informações do Time</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Time */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
              <Icon icon={Shield} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">Time</span>
            </div>
            {/* Mobile: com truncate e tooltip */}
            <div className="sm:hidden flex items-start gap-1">
              <Tooltip content={player.teamName}>
                <p className="text-xs font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
                  {player.teamName}
                </p>
              </Tooltip>
              <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Desktop: sem truncate, sem tooltip */}
            <p className="hidden sm:block text-sm font-semibold text-gray-900">
              {player.teamName}
            </p>
          </div>

          {/* Camisa */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
              <Icon icon={Hash} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">Camisa</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-900">Nº {player.shirtNumber}</p>
          </div>

          {/* Posição */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
              <Icon icon={User} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">Posição</span>
            </div>
            {/* Mobile: com truncate e tooltip */}
            <div className="sm:hidden flex items-start gap-1">
              <Tooltip content={player.position}>
                <p className="text-xs font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
                  {player.position}
                </p>
              </Tooltip>
              <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Desktop: sem truncate, sem tooltip */}
            <p className="hidden sm:block text-sm font-semibold text-gray-900">
              {player.position}
            </p>
          </div>
        </div>
      </div>

      {/* Grid 3 Colunas: Dados Pessoais + Contato */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">Dados Pessoais</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Data de Nascimento */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
              <Icon icon={Calendar} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">Nascimento</span>
            </div>
            <p className="text-[11px] sm:text-sm font-semibold text-gray-900">{formatDate(player.birthDate)}</p>
          </div>

          {/* Nacionalidade */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
              <Icon icon={MapPin} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium">Nacionalidade</span>
            </div>
            {/* Mobile: com truncate e tooltip */}
            <div className="sm:hidden flex items-start gap-1">
              <Tooltip content={player.nationality}>
                <p className="text-xs font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
                  {player.nationality}
                </p>
              </Tooltip>
              <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Desktop: sem truncate, sem tooltip */}
            <p className="hidden sm:block text-sm font-semibold text-gray-900">
              {player.nationality}
            </p>
          </div>

          {/* Contato */}
          {player.phone && (
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 flex flex-col">
              <div className="flex items-center gap-1 sm:gap-2 text-gray-500 mb-1">
                <Icon icon={Phone} size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-medium">Contato</span>
              </div>
              {/* Mobile: com truncate e tooltip */}
              <div className="sm:hidden flex items-start gap-1">
                <Tooltip content={player.phone}>
                  <p className="text-[11px] font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
                    {player.phone}
                  </p>
                </Tooltip>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Desktop: sem truncate, sem tooltip */}
            <p className="hidden sm:block text-sm font-semibold text-gray-900">
              {player.phone}
            </p>
          </div>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">Estatísticas</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Gols */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-2.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <p className="text-xl sm:text-2xl font-black text-green-700">{stats.totalGols}</p>
            </div>
            <p className="text-[9px] sm:text-[10px] text-green-600 font-semibold uppercase tracking-wide">
              Gols
            </p>
          </div>

          {/* Cartões Amarelos */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-2.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="w-2.5 h-3.5 sm:w-3 sm:h-4 bg-yellow-400 rounded-sm shadow-sm"></div>
              <p className="text-xl sm:text-2xl font-black text-yellow-700">{stats.cartoesAmarelos}</p>
            </div>
            <p className="text-[9px] sm:text-[10px] text-yellow-600 font-semibold uppercase tracking-wide">
              Amarelos
            </p>
          </div>

          {/* Cartões Vermelhos */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-2.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="w-2.5 h-3.5 sm:w-3 sm:h-4 bg-red-500 rounded-sm shadow-sm"></div>
              <p className="text-xl sm:text-2xl font-black text-red-700">{stats.cartoesVermelhos}</p>
            </div>
            <p className="text-[9px] sm:text-[10px] text-red-600 font-semibold uppercase tracking-wide">
              Vermelhos
            </p>
          </div>
        </div>

        {/* Documento e RG/CPF */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Documento com Foto */}
          {player.documentPhoto && (
            <button
              onClick={() => setShowDocumentModal(true)}
              className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 sm:p-3 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-semibold text-purple-900">Documento</span>
                </div>
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </button>
          )}

          {/* Documento (RG ou CPF) */}
          {player.documentType && (player.rg || player.cpf) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                    {player.documentType.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Tooltip content={player.documentType === 'cpf' ? player.cpf || '' : player.rg || ''}>
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-mono text-gray-700 truncate">
                          {player.documentType === 'cpf' ? player.cpf : player.rg}
                        </span>
                        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização do Documento */}
      {showDocumentModal && player.documentPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDocumentModal(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            {/* Botão fechar */}
            <button
              onClick={() => setShowDocumentModal(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Botão baixar */}
            <a
              href={player.documentPhoto}
              download="documento-jogador.jpg"
              className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-5 h-5 text-gray-700" />
            </a>

            {/* Imagem do documento */}
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={player.documentPhoto}
                alt="Documento do jogador"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

    </Modal>
  );
}