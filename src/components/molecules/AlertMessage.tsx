// src/components/molecules/AlertMessage.tsx
import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { Button } from './Button';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700',
  },
};

export function AlertMessage({
  type,
  title,
  message,
  onClose,
  actionLabel,
  onAction,
}: AlertMessageProps) {
  const config = alertConfig[type];

  return (
    <div className={`rounded-xl p-4 border-2 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon icon={config.icon} size={20} className={`${config.iconColor} mt-0.5`} />
        
        <div className="flex-1">
          <p className={`font-semibold ${config.titleColor}`}>{title}</p>
          <p className={`text-sm mt-1 ${config.messageColor}`}>{message}</p>
          
          {actionLabel && onAction && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={config.icon}
              onClick={onAction}
              className="mt-3"
            >
              {actionLabel}
            </Button>
          )}
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={X}
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          />
        )}
      </div>
    </div>
  );
}