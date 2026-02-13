// ========================================
// src/components/forms/CreateChampionshipModal.tsx
// ========================================
import React, { useState } from 'react';
import { Trophy, Users, Calendar, Building2, MapPin, Save } from 'lucide-react';
import { Modal } from '../molecules/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../molecules/Button';
import { CustomSelect } from '../atoms/CustomSelect';
import { ImageUpload } from '../atoms/ImageUpload';
import { PhoneInput } from '../atoms/PhoneInput';
import { formatPhoneByCode } from '@/config/countryConfig';
import type { Championship } from '../../types/championship.types';

interface CreateChampionshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (championship: Omit<Championship, 'id'>) => void;
  initialData?: Championship;
}

export function CreateChampionshipModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: CreateChampionshipModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    logo: string;
    organizer: string;
    local: string;
    phone: string;
    phoneCode: string;
    category: 'Masculino Livre' | 'Feminino Livre' | 'Veterano 35+' | 'Sub-13' | 'Sub-15';
    status: 'Agendado' | 'Em Andamento' | 'Finalizado' | 'Inativo' | 'Bloqueado';
    format: 'Pontos Corridos' | 'Chaveamento';
    teams: number;
    startDate: string;
    endDate: string;
  }>({
    name: initialData?.name || '',
    logo: initialData?.logo || '',
    organizer: initialData?.organizer || '',
    local: initialData?.local || '',
    phone: initialData?.phone || '',
    phoneCode: initialData?.phoneCode || '+55',
    category: initialData?.category || 'Masculino Livre',
    status: initialData?.status || 'Agendado',
    format: initialData?.format || 'Pontos Corridos',
    teams: initialData?.teams || 8,
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Campeonato' : 'Novo Campeonato'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Top Section: Logo & Main Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Logo Upload */}
          <div className="w-full sm:w-auto">
            <ImageUpload
              value={formData.logo}
              onChange={(imageData) => setFormData(prev => ({ ...prev, logo: imageData }))}
              label="Logo"
              placeholder="Adicionar Logo"
              size="lg"
              shape="square"
            />
          </div>

          {/* Basic Info Grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome do Campeonato"
              type="text"
              placeholder="Ex: Copa 2025"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              leftIcon={Trophy}
            />
            
            <Input
              label="Organizador"
              type="text"
              placeholder="Entidade ou pessoa"
              value={formData.organizer}
              onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
              required
              leftIcon={Building2}
            />
            
            <Input
              label="Local"
              type="text"
              placeholder="Estádio ou Ginásio"
              value={formData.local}
              onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
              required
              leftIcon={MapPin}
            />
            
            <PhoneInput
              label="Telefone"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneByCode(e.target.value, formData.phoneCode);
                setFormData(prev => ({ ...prev, phone: formatted }));
              }}
              phoneCode={formData.phoneCode}
              onPhoneCodeChange={(code) => {
                setFormData(prev => ({ ...prev, phoneCode: code, phone: '' }));
              }}
            />
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-gray-200" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <CustomSelect
            label="Categoria"
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              category: value as typeof formData.category
            }))}
            options={['Masculino Livre', 'Feminino Livre', 'Veterano 35+', 'Sub-13', 'Sub-15']}
            required
          />

          <CustomSelect
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              status: value as typeof formData.status
            }))}
            options={['Agendado', 'Em Andamento', 'Finalizado', 'Inativo', 'Bloqueado']}
            required
          />

          <CustomSelect
            label="Formato"
            value={formData.format}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              format: value as typeof formData.format
            }))}
            options={['Pontos Corridos', 'Chaveamento']}
            required
          />

          <Input
            label="Nº de Times"
            type="number"
            placeholder="8"
            value={formData.teams || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, teams: parseInt(e.target.value) || 0 }))}
            required
            min={2}
            leftIcon={Users}
          />

          <Input
            label="Data de Início"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
            leftIcon={Calendar}
          />

          <Input
            label="Data de Término"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
            min={formData.startDate}
            leftIcon={Calendar}
          />
        </div>

        {/* Footer Actions */}
        <footer className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            onClick={handleCancel}
            type="button"
            variant="cancel"
            size="md"
            className="px-5 py-2 rounded-xl text-[14px] font-medium"
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={Save}
            className="px-6 py-2 rounded-xl text-[14px] font-semibold"
          >
            {initialData ? 'Atualizar' : 'Salvar'}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}