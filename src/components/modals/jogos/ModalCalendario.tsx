// src/components/modals/ModalCalendario.tsx

import React from 'react';
import { X } from 'lucide-react';
import { GameCalendar } from '@/components/molecules/GameCalendar';

interface ModalCalendarioProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  selectedDates: string[];
  onDateToggle: (date: string) => void;
}

export function ModalCalendario({
  isOpen,
  onClose,
  startDate,
  endDate,
  selectedDates,
  onDateToggle,
}: ModalCalendarioProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            📅 Selecionar Datas dos Jogos
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <GameCalendar
            startDate={startDate}
            endDate={endDate}
            selectedDates={selectedDates}
            onDateToggle={onDateToggle}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}