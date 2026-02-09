// src/components/modals/ChampionshipDetailsModal.tsx
import React, { useMemo } from 'react';
import { Trophy, Calendar, Users, MapPin } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { IOSModal } from '@/components/iosreutilizavel/atoms/IOSModal';
import { IOSSection } from '@/components/iosreutilizavel/atoms/IOSSection';
import { IOSLabel } from '@/components/iosreutilizavel/atoms/IOSLabel';
import { IOSValue } from '@/components/iosreutilizavel/atoms/IOSValue';
import { IOSProgressBar } from '@/components/iosreutilizavel/molecules/IOSProgressBar';
import { IOSDateRange } from '@/components/iosreutilizavel/molecules/IOSDateRange';
import { IOSModalHeader } from '@/components/iosreutilizavel/molecules/IOSModalHeader';
import { formatDateCompact, calculateDaysDifference } from '../../utils/common/date.utils';
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
  
  // Calcula o progresso do campeonato
  const progress = useMemo(() => {
    const now = new Date();
    const start = new Date(championship.startDate);
    const end = new Date(championship.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  }, [championship.startDate, championship.endDate]);

  // Formata datas no estilo compacto (13 JAN)
  const formatDateIOS = (dateString: string) => {
    return formatDateCompact(dateString).toUpperCase().replace('/', ' ').replace('.', '');
  };

  const totalDays = calculateDaysDifference(championship.startDate, championship.endDate);

  // Cor do status
  const getStatusColor = (): 'green' | 'blue' | 'gray' | 'red' | 'yellow' => {
    const colors: Record<string, 'green' | 'blue' | 'gray' | 'red' | 'yellow'> = {
      'Em Andamento': 'green',
      'Agendado': 'blue',
      'Finalizado': 'gray',
      'Bloqueado': 'red',
      'Inativo': 'yellow'
    };
    return colors[championship.status] || 'gray';
  };

  // Logo component
  const logo = championship.logo && championship.logo.startsWith('data:image') ? (
    <img 
      src={championship.logo} 
      alt={championship.name} 
      className="w-8 h-8 object-cover rounded-lg"
    />
  ) : (
    <Icon icon={Trophy} size={32} className="text-blue-500" strokeWidth={2.2} />
  );

  return (
    <IOSModal isOpen={isOpen} onClose={onClose}>
      
      {/* Header */}
      <IOSModalHeader
        title={championship.name}
        subtitle={championship.organizer}
        logo={logo}
        status={championship.status}
        statusColor={getStatusColor()}
      />

      {/* Info Grid */}
      <IOSSection>
        <div className="grid grid-cols-2 gap-y-5">
          <div>
            <IOSLabel>Categoria</IOSLabel>
            <IOSValue icon={<Icon icon={Users} size={14} className="text-gray-400" />}>
              {championship.category}
            </IOSValue>
          </div>

          <div>
            <IOSLabel>Times</IOSLabel>
            <IOSValue>
              {championship.teams} Equipes
            </IOSValue>
          </div>

          <div className="col-span-2 border-t border-black/5 pt-4">
            <IOSLabel>Localização</IOSLabel>
            <IOSValue icon={<Icon icon={MapPin} size={14} className="text-gray-400" />}>
              {championship.local}
            </IOSValue>
          </div>
        </div>
      </IOSSection>

      {/* Cronograma */}
      <IOSSection>
        <IOSLabel icon={<Icon icon={Calendar} size={12} className="text-gray-400" />}>
          Período do Campeonato
        </IOSLabel>
        
        <IOSDateRange 
          startDate={formatDateIOS(championship.startDate)}
          endDate={formatDateIOS(championship.endDate)}
        />
        
        <IOSProgressBar 
          progress={progress}
          label={`DURAÇÃO: ${totalDays} DIAS`}
        />
      </IOSSection>

    </IOSModal>
  );
}