// ========================================
// src/components/modals/CreateTeamModal.tsx
// ========================================
import React, { useState } from 'react';
import { Users, User, Mail, Phone, Calendar, Trophy, Save } from 'lucide-react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/molecules/Button';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { formatPhone } from '@/utils/formatters/inputFormatters';
import { teamService } from '@/services/teamService';
import type { Team } from '@/types/team.types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (team: Omit<Team, 'id'>) => void;
  initialData?: Team;
  championshipOptions: string[];
}

export function CreateTeamModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  championshipOptions
}: CreateTeamModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    logo: string;
    championshipName: string;
    championshipId: string;
    coach: string;
    email: string;
    phone: string;
    players: number;
    foundedYear: number;
    isActive: boolean;
  }>({
    name: initialData?.name || '',
    logo: initialData?.logo || '',
    championshipName: initialData?.championshipName || '',
    championshipId: initialData?.championshipId || '',
    coach: initialData?.coach || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    players: initialData?.players || 0,
    foundedYear: initialData?.foundedYear || new Date().getFullYear(),
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleChampionshipChange = (championshipName: string) => {
    const championshipId = teamService.getChampionshipIdByName(championshipName);
    setFormData(prev => ({ 
      ...prev, 
      championshipName,
      championshipId
    }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Time' : 'Novo Time'}
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
              shape="circle"
            />
          </div>

          {/* Basic Info Grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome do Time"
              type="text"
              placeholder="Ex: FC Barcelona"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              leftIcon={Trophy}
            />
            
            <CustomSelect
              label="Campeonato"
              value={formData.championshipName}
              onChange={handleChampionshipChange}
              options={championshipOptions.filter(c => c !== 'Todos os Campeonatos')}
              placeholder="Selecione o campeonato"
              required
            />
            
            <Input
              label="Técnico"
              type="text"
              placeholder="Nome do técnico"
              value={formData.coach}
              onChange={(e) => setFormData(prev => ({ ...prev, coach: e.target.value }))}
              required
              leftIcon={User}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="contato@time.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              leftIcon={Mail}
            />
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-gray-200" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Input
            label="Telefone"
            type="tel"
            placeholder="(99) 99999-9999"
            value={formData.phone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setFormData(prev => ({ ...prev, phone: formatted }));
            }}
            leftIcon={Phone}
          />

          <Input
            label="Nº de Jogadores"
            type="number"
            placeholder="0"
            value={formData.players || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, players: parseInt(e.target.value) || 0 }))}
            required
            min={0}
            leftIcon={Users}
          />

          <Input
            label="Ano de Fundação"
            type="number"
            placeholder={String(currentYear)}
            value={formData.foundedYear || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || currentYear }))}
            required
            min={1800}
            max={currentYear}
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