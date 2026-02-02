// ========================================
// src/components/modals/players/CreatePlayerModal.tsx
// ========================================
import React, { useState } from 'react';
import { User, Phone, Calendar, Save, Shield, Hash, Globe } from 'lucide-react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/molecules/Button';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { formatPhone } from '@/utils/formatters/inputFormatters';
import { playerService } from '@/services/playerService';
import type { Player } from '@/types/player.types';

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (player: Omit<Player, 'id'>) => void;
  initialData?: Player;
  teamOptions: string[];
}

export function CreatePlayerModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  teamOptions
}: CreatePlayerModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    photo: string;
    teamName: string;
    teamId: string;
    position: string;
    phone: string;
    nationality: string;
    birthDate: string;
    documentPhoto: string;
    shirtNumber: number;
    isActive: boolean;
  }>({
    name: initialData?.name || '',
    photo: initialData?.photo || '',
    teamName: initialData?.teamName || '',
    teamId: initialData?.teamId || '',
    position: initialData?.position || '',
    phone: initialData?.phone || '',
    nationality: initialData?.nationality || '',
    birthDate: initialData?.birthDate || '',
    documentPhoto: initialData?.documentPhoto || '',
    shirtNumber: initialData?.shirtNumber || 0,
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

  const handleTeamChange = (teamName: string) => {
    const teamId = playerService.getTeamIdByName(teamName);
    setFormData(prev => ({ 
      ...prev, 
      teamName,
      teamId
    }));
  };

  // Opções de posição
  const positionOptions = [
    'Goleiro',
    'Zagueiro',
    'Lateral Direito',
    'Lateral Esquerdo',
    'Volante',
    'Meia',
    'Atacante'
  ];

  // Opções de nacionalidade
  const nationalityOptions = [
    'Brasileiro',
    'Colombiano',
    'Peruano'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Jogador' : 'Novo Jogador'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nome do Jogador - Topo */}
        <div className="w-full">
          <Input
            label="Nome do Jogador"
            type="text"
            placeholder="Ex: João Silva"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            leftIcon={User}
          />
        </div>

        {/* Seção: Fotos & Time/Posição */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          
          {/* Fotos - 3x4 e Documento */}
          <div className="w-full sm:w-auto flex gap-4">
            <ImageUpload
              value={formData.photo}
              onChange={(imageData) => setFormData(prev => ({ ...prev, photo: imageData }))}
              label="Foto 3x4"
              placeholder="Adicionar Foto"
              size="lg"
              shape="square"
            />
            
            <ImageUpload
              value={formData.documentPhoto}
              onChange={(imageData) => setFormData(prev => ({ ...prev, documentPhoto: imageData }))}
              label="Documento"
              placeholder="RG / CPF"
              size="lg"
              shape="square"
            />
          </div>

          {/* Time e Posição (Empilhados) */}
          <div className="flex-1 w-full space-y-4">
            <CustomSelect
              label="Time"
              value={formData.teamName}
              onChange={handleTeamChange}
              options={teamOptions.filter(t => t !== 'Todos os Times')}
              placeholder="Selecione o time"
              required
            />
            
            <CustomSelect
              label="Posição"
              value={formData.position}
              onChange={(position) => setFormData(prev => ({ ...prev, position }))}
              options={positionOptions}
              placeholder="Selecione a posição"
              required
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
            required
            leftIcon={Phone}
          />

          <CustomSelect
            label="Nacionalidade"
            value={formData.nationality}
            onChange={(nationality) => setFormData(prev => ({ ...prev, nationality }))}
            options={nationalityOptions}
            placeholder="Selecione a nacionalidade"
            required
          />

          <Input
            label="Data de Nascimento"
            type="date"
            placeholder=""
            value={formData.birthDate}
            onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
            required
            leftIcon={Calendar}
          />

          <Input
            label="Número da Camisa"
            type="number"
            placeholder="Ex: 10"
            value={formData.shirtNumber || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, shirtNumber: parseInt(e.target.value) || 0 }))}
            required
            min={1}
            max={99}
            leftIcon={Hash}
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