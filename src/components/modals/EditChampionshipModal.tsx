// ========================================
// src/components/modals/EditChampionshipModal.tsx
// ========================================
import React from 'react';
import { CreateChampionshipModal } from '@/components/modals/CreateChampionshipModal';
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

  const handleSubmit = (data: Omit<Championship, 'id'>) => {
    onUpdate(championship.id, data);
  };

  return (
    <CreateChampionshipModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={championship}
    />
  );
}