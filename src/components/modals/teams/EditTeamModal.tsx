// ========================================
// src/components/modals/EditTeamModal.tsx
// ========================================
import React from 'react';
import { CreateTeamModal } from './CreateTeamModal';
import type { Team } from '@/types/team.types';

interface EditTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Team>) => void;
  championshipOptions: string[];
}

export function EditTeamModal({ 
  team, 
  isOpen, 
  onClose, 
  onUpdate,
  championshipOptions
}: EditTeamModalProps) {

  const handleSubmit = (data: Omit<Team, 'id'>) => {
    onUpdate(team.id, data);
  };

  return (
    <CreateTeamModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={team}
      championshipOptions={championshipOptions}
    />
  );
}