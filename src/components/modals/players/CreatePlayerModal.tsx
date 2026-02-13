// ========================================
// src/components/modals/players/CreatePlayerModal.tsx
// ========================================
import React, { useState } from 'react';
import { User, Phone, Calendar, Save, Shield, Hash, Globe, FileText } from 'lucide-react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/molecules/Button';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Checkbox } from '@/components/atoms/Checkbox';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';
import { formatPhone } from '@/utils/formatters/inputFormatters';
import { formatCPF, formatRG, validateCPF, validateRG, getDocumentErrorMessage } from '@/utils/validators/documentValidators';
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
    rg: string;
    cpf: string;
    documentType: 'rg' | 'cpf';
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
    rg: initialData?.rg || '',
    cpf: initialData?.cpf || '',
    documentType: initialData?.documentType || 'cpf',
  });

  // Estados para erros de validação
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [rgError, setRgError] = useState<string | null>(null);

  // Handler para mudança de CPF
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    
    // Valida em tempo real
    if (formatted.length >= 14) {
      const error = getDocumentErrorMessage('cpf', formatted);
      setCpfError(error);
    } else {
      setCpfError(null);
    }
  };

  // Handler para mudança de RG
  const handleRGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRG(e.target.value);
    setFormData(prev => ({ ...prev, rg: formatted }));
    
    // Valida em tempo real
    if (formatted.length >= 10) {
      const error = getDocumentErrorMessage('rg', formatted);
      setRgError(error);
    } else {
      setRgError(null);
    }
  };

  // Handler para checkbox do CPF
  const handleCPFCheckboxChange = (checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        documentType: 'cpf',
        rg: '' // Limpa RG quando seleciona CPF
      }));
      setRgError(null);
    }
  };

  // Handler para checkbox do RG
  const handleRGCheckboxChange = (checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        documentType: 'rg',
        cpf: '' // Limpa CPF quando seleciona RG
      }));
      setCpfError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: pelo menos um documento deve estar preenchido
    if (!formData.cpf && !formData.rg) {
      alert('Por favor, preencha pelo menos um documento (CPF ou RG)');
      return;
    }
    
    // Validação do documento ativo
    if (formData.documentType === 'cpf' && formData.cpf) {
      if (!validateCPF(formData.cpf)) {
        setCpfError('CPF inválido');
        return;
      }
    }
    
    if (formData.documentType === 'rg' && formData.rg) {
      if (!validateRG(formData.rg)) {
        setRgError('RG inválido');
        return;
      }
    }
    
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
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-medium text-gray-700">Foto 3x4</span>
                <InfoTooltip 
                  message="A foto deve ser recente, com fundo branco ou claro, mostrando apenas o rosto e ombros do jogador. Aceita formatos: PNG, JPG e JPEG."
                  position="right"
                />
              </div>
              <ImageUpload
                value={formData.photo}
                onChange={(imageData) => setFormData(prev => ({ ...prev, photo: imageData }))}
                placeholder="Adicionar Foto"
                size="lg"
                shape="square"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-medium text-gray-700">Documento</span>
                <InfoTooltip 
                  message="Anexe uma imagem contendo a frente E o verso do documento (RG ou CPF) na mesma foto. Aceita apenas imagens: PNG, JPG e JPEG. Não aceita PDF."
                  position="left"
                />
              </div>
              <ImageUpload
                value={formData.documentPhoto}
                onChange={(imageData) => setFormData(prev => ({ ...prev, documentPhoto: imageData }))}
                placeholder="RG / CPF"
                size="lg"
                shape="square"
              />
            </div>
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

        {/* Divisor */}
        <div className="h-px bg-gray-200" />

        {/* Documentos - RG e CPF com Checkboxes */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Documentos de Identificação
            <span className="text-red-400 ml-1">*</span>
          </h3>
          <p className="text-xs text-gray-500">Selecione e preencha pelo menos um documento</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CPF */}
            <div className="space-y-2">
              <Checkbox
                label="CPF"
                checked={formData.documentType === 'cpf'}
                onChange={handleCPFCheckboxChange}
                size="md"
              />
              <Input
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleCPFChange}
                disabled={formData.documentType !== 'cpf'}
                leftIcon={FileText}
                error={cpfError || undefined}
              />
            </div>

            {/* RG */}
            <div className="space-y-2">
              <Checkbox
                label="RG"
                checked={formData.documentType === 'rg'}
                onChange={handleRGCheckboxChange}
                size="md"
              />
              <Input
                type="text"
                placeholder="00.000.000-0"
                value={formData.rg}
                onChange={handleRGChange}
                disabled={formData.documentType !== 'rg'}
                leftIcon={FileText}
                error={rgError || undefined}
              />
            </div>
          </div>
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