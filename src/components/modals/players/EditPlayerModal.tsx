// ========================================
// src/components/modals/players/EditPlayerModal.tsx
// ========================================
import React from 'react';
import { CreatePlayerModal } from './CreatePlayerModal';
import type { Player } from '@/types/player.types';

interface EditPlayerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Player>) => void;
  teamOptions: string[];
}

export function EditPlayerModal({ 
  player, 
  isOpen, 
  onClose, 
  onUpdate,
  teamOptions
}: EditPlayerModalProps) {

  const handleSubmit = (data: Omit<Player, 'id'>) => {
    onUpdate(player.id, data);
  };

  return (
    <CreatePlayerModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={player}
      teamOptions={teamOptions}
    />
  );
}