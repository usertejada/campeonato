// ====================================
// src/components/atoms/IOSStatusDot.tsx
// ====================================
import React from 'react';
import { Badge } from '@/components/atoms/Badge';

type StatusColor = 'green' | 'blue' | 'gray' | 'red' | 'yellow';

interface IOSStatusDotProps {
  label: string;
  color?: StatusColor;
}

const dotColors: Record<StatusColor, string> = {
  green: 'bg-green-500 shadow-[0_0_8px_rgb(34,197,94)]',
  blue: 'bg-blue-500 shadow-[0_0_8px_rgb(59,130,246)]',
  gray: 'bg-gray-500 shadow-[0_0_8px_rgb(107,114,128)]',
  red: 'bg-red-500 shadow-[0_0_8px_rgb(239,68,68)]',
  yellow: 'bg-yellow-500 shadow-[0_0_8px_rgb(234,179,8)]'
};

export function IOSStatusDot({ label, color = 'green' }: IOSStatusDotProps) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className={`w-2 h-2 rounded-full animate-pulse ${dotColors[color]}`} />
      <Badge variant="text" color={color} className="uppercase tracking-wider">
        {label}
      </Badge>
    </div>
  );
}