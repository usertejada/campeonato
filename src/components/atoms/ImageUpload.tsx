// src/components/atoms/ImageUpload.tsx
import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Icon } from './Icon';

interface ImageUploadProps {
  value?: string;
  onChange: (imageData: string) => void;
  label?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Adicionar Imagem',
  size = 'md',
  shape = 'square',
  className = ''
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const shapeClasses = {
    square: 'rounded-xl',
    circle: 'rounded-full'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Label opcional acima do upload */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <input
        type="file"
        id={inputId}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={() => document.getElementById(inputId)?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]}
          border-2 border-dashed 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          flex items-center justify-center 
          overflow-hidden 
          hover:border-blue-400 
          transition-all 
          cursor-pointer
          relative
          group
          p-0.5
        `}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg" 
            />
            {/* Botão de remover */}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              type="button"
            >
              <Icon icon={X} size={16} />
            </button>
          </>
        ) : (
          <div className="text-center p-2">
            <Icon icon={Camera} size={32} className="text-gray-400 mx-auto mb-1" />
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              {placeholder}
            </p>
          </div>
        )}
      </div>
      
      {!preview && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Clique ou arraste uma imagem
        </p>
      )}
    </div>
  );
}