// src/components/molecules/EmptyState.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon icon={icon} size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          leftIcon={actionIcon}
          variant="primary"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}