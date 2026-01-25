// src/components/molecules/SearchInput.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { Icon } from '../atoms/Icon';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxWidth?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  className = '',
  maxWidth = 'max-w-md'
}: SearchInputProps) {
  return (
    <div className={`relative ${maxWidth} ${className}`}>
      <Icon 
        icon={Search} 
        size={20} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}