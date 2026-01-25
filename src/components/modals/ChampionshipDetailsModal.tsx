// src/components/modals/ChampionshipDetailsModal.tsx
import React from 'react';
import { X, Trophy, Users, Calendar, MapPin, Building2, Phone, Tag, Activity, Grid3x3 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { formatDate, calculateDaysDifference } from '../../utils/common/date.utils';
import type { Championship } from '../../types/championship.types';

interface ChampionshipDetailsModalProps {
  championship: Championship;
  isOpen: boolean;
  onClose: () => void;
}

export function ChampionshipDetailsModal({ 
  championship, 
  isOpen, 
  onClose 
}: ChampionshipDetailsModalProps) {
  
  if (!isOpen) return null;

  // Cores do status
  const getStatusColor = (status: string) => {
    const colors: Record<string, 'green' | 'blue' | 'gray' | 'red' | 'yellow'> = {
      'Em Andamento': 'green',
      'Agendado': 'blue',
      'Finalizado': 'gray',
      'Bloqueado': 'red',
      'Inativo': 'yellow'
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        
        {/* Header com fundo colorido */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-8 rounded-t-2xl">
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo e Título */}
          <div className="flex items-start gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-24 h-24 flex items-center justify-center">
              {championship.logo && championship.logo.startsWith('data:image') ? (
                <img 
                  src={championship.logo} 
                  alt={championship.name} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-5xl">{championship.logo || '🏆'}</span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="filled" color={getStatusColor(championship.status)}>
                  {championship.status.toUpperCase()}
                </Badge>
              </div>
              <h2 className="text-3xl font-bold mb-2">{championship.name}</h2>
              <p className="text-blue-100 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {championship.organizer}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          
          {/* Seção: Informações Gerais */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Informações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">Categoria</span>
                </div>
                <p className="text-gray-900 font-semibold ml-7">
                  {championship.category}
                </p>
              </div>

              {/* Formato */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <Grid3x3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Formato</span>
                </div>
                <p className="text-gray-900 font-semibold ml-7">
                  {championship.format}
                </p>
              </div>

              {/* Número de Times */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Times Inscritos</span>
                </div>
                <p className="text-gray-900 font-semibold ml-7">
                  {championship.teams} times
                </p>
              </div>

              {/* Local */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Local</span>
                </div>
                <p className="text-gray-900 font-semibold ml-7">
                  {championship.local}
                </p>
              </div>

              {/* Telefone */}
              {championship.phone && (
                <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                  <div className="flex items-center gap-3 text-gray-600 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Telefone de Contato</span>
                  </div>
                  <p className="text-gray-900 font-semibold ml-7">
                    {championship.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seção: Período */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Período do Campeonato
            </h3>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Data de Início */}
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase mb-1">
                    Início
                  </p>
                  <p className="text-gray-900 font-bold text-lg">
                    {formatDate(championship.startDate)}
                  </p>
                </div>

                {/* Data de Término */}
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase mb-1">
                    Término
                  </p>
                  <p className="text-gray-900 font-bold text-lg">
                    {formatDate(championship.endDate)}
                  </p>
                </div>

                {/* Duração */}
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase mb-1">
                    Duração
                  </p>
                  <p className="text-gray-900 font-bold text-lg">
                    {calculateDaysDifference(championship.startDate, championship.endDate)} dias
                  </p>
                </div>
              </div>

              {/* Timeline visual */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-2 bg-blue-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: championship.status === 'Finalizado' ? '100%' : 
                                 championship.status === 'Em Andamento' ? '50%' : '0%'
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                      <span className="text-xs text-gray-600 mt-2">Início</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg ${
                        championship.status === 'Finalizado' ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs text-gray-600 mt-2">Fim</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Fechar */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}