// src/components/molecules/Button.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import type { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps {
  children?: React.ReactNode;
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

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Se mobileIconOnly está ativo, aplicamos estilos especiais
  if (mobileIconOnly) {
    // Estilos para desktop baseados no variant
    const desktopVariantClasses: Record<ButtonVariant, string> = {
      primary: 'sm:bg-blue-600 sm:text-white sm:hover:bg-blue-700 sm:border-blue-600',
      secondary: 'sm:bg-gray-200 sm:text-gray-900 sm:hover:bg-gray-300 sm:border-gray-200',
      outline: 'sm:border-gray-300 sm:text-gray-700 sm:hover:bg-gray-50 sm:bg-white',
      ghost: 'sm:text-gray-700 sm:hover:bg-gray-100 sm:bg-transparent',
      cancel: 'sm:text-gray-500 sm:hover:bg-gray-200/50 sm:border-gray-200 sm:bg-white',
    };

    const desktopSizeClasses: Record<ButtonSize, string> = {
      sm: 'sm:px-3 sm:py-1.5',
      md: 'sm:px-4 sm:py-2',
      lg: 'sm:px-6 sm:py-3',
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseClasses}
          w-10 h-10 p-0 
          bg-white text-blue-600 hover:bg-blue-50 
          border-2 border-blue-600 rounded-lg
          sm:w-auto sm:h-auto
          ${desktopSizeClasses[size]}
          ${desktopVariantClasses[variant]}
          ${widthClass}
          ${disabledClass}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      >
        {leftIcon && <Icon icon={leftIcon} size={18} />}
        {children && <span className="hidden sm:inline">{children}</span>}
        {rightIcon && <Icon icon={rightIcon} size={18} />}
      </button>
    );
  }

  // Comportamento normal do botão
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {leftIcon && <Icon icon={leftIcon} size={18} />}
      {children}
      {rightIcon && <Icon icon={rightIcon} size={18} />}
    </button>
  );
}