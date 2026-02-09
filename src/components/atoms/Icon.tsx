// src/components/atoms/Icon.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ 
  icon: LucideIconComponent, 
  size = 20, 
  className = '', 
  strokeWidth = 2 
}: IconProps) {
  return <LucideIconComponent size={size} strokeWidth={strokeWidth} className={className} />;
}