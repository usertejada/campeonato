// src/components/molecules/Button.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import type { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  mobileIconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  disabled = false,
  className = '',
  mobileIconOnly = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 active:scale-[0.97] shadow-md',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    cancel: 'text-gray-500 hover:bg-gray-200/50 border border-gray-200',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  // Classes especiais para mobile quando mobileIconOnly está ativo
  const mobileClasses = mobileIconOnly 
    ? 'sm:px-6 sm:py-2.5 sm:bg-blue-600 sm:text-white sm:hover:bg-blue-700 sm:border-blue-600 w-10 h-10 p-0 bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600'
    : '';

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${mobileIconOnly ? mobileClasses : `${variantClasses[variant]} ${sizeClasses[size]}`} ${widthClass} ${disabledClass} ${className}`}
    >
      {leftIcon && <Icon icon={leftIcon} size={18} />}
      {mobileIconOnly ? (
        <>
          <span className="sm:inline hidden">{children}</span>
        </>
      ) : (
        children
      )}
      {rightIcon && <Icon icon={rightIcon} size={18} />}
    </button>
  );
}