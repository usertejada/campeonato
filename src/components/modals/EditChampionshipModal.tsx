// src/components/modals/EditChampionshipModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { ChampionshipForm } from '../forms/ChampionshipForm';
import type { Championship } from '../../types/championship.types';

interface EditChampionshipModalProps {
  championship: Championship;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Championship>) => void;
}

export function EditChampionshipModal({ 
  championship, 
  isOpen, 
  onClose, 
  onUpdate 
}: EditChampionshipModalProps) {
  
  if (!isOpen) return null;

  const handleSubmit = (data: Omit<Championship, 'id'>) => {
    onUpdate(championship.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Editar Campeonato</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <ChampionshipForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={championship}
          />
        </div>
      </div>
    </div>
  );
}