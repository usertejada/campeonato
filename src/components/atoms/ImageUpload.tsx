// ========================================
// src/components/atoms/ImageUpload.tsx
// ========================================
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
  placeholder = 'Adicionar Logo',
  size = 'md',
  shape = 'square',
  className = ''
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-32 h-32'
  };

  const shapeClasses = {
    square: 'rounded-2xl',
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
    <div className={`flex flex-col ${className}`}>
      {/* Label iOS Style */}
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
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
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          flex items-center justify-center 
          overflow-hidden 
          hover:bg-gray-100 
          transition-all 
          cursor-pointer
          relative
          group
        `}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              type="button"
            >
              <Icon icon={X} size={14} />
            </button>
          </>
        ) : (
          <div className="text-center px-2">
            <Icon icon={Camera} size={22} className="text-gray-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] text-gray-400 text-center leading-tight">
              {placeholder}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}