// src/components/molecules/SettingsDropdown.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuItem } from './DropdownMenu';

interface SettingsDropdownProps {
  id: string;
  items: DropdownMenuItem[];
  activeDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Componente reutilizável de dropdown com ícone de engrenagem (Settings)
 * Usa o DropdownMenu internamente com o ícone de Settings pré-configurado
 */
export function SettingsDropdown({
  id,
  items,
  activeDropdown,
  onToggleDropdown,
  position = 'top-right'
}: SettingsDropdownProps) {
  return (
    <DropdownMenu
      id={id}
      items={items}
      activeDropdown={activeDropdown}
      onToggleDropdown={onToggleDropdown}
      position={position}
      triggerIcon={Settings}
    />
  );
}