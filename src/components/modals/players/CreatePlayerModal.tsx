// ========================================
// src/components/modals/players/CreatePlayerModal.tsx
// ========================================
import React, { useState, useEffect } from 'react';
import { User, Calendar, Save, Hash, FileText } from 'lucide-react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/molecules/Button';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Checkbox } from '@/components/atoms/Checkbox';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';
import { PhoneInput } from '@/components/atoms/PhoneInput';
import { formatCPF, formatRG, validateCPF, validateRG, getDocumentErrorMessage } from '@/utils/validators/documentValidators';
import { formatPhoneByCode } from '@/config/countryConfig';
import { playerService } from '@/services/playerService';
import type { Player, DocumentType } from '@/types/player.types';
import { 
  getDocumentsByNationality, 
  getDefaultDocumentType,
  formatDocumentValue,
  getDocumentError,
  type DocumentConfig
} from '@/config/documentConfig';

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
    phoneCode: string;
    nationality: string;
    birthDate: string;
    documentPhoto: string;
    shirtNumber: number;
    isActive: boolean;
    rg: string;
    cpf: string;
    dni_colombia: string;
    dni_peru: string;
    documentType: DocumentType | null;
  }>({
    name: initialData?.name || '',
    photo: initialData?.photo || '',
    teamName: initialData?.teamName || '',
    teamId: initialData?.teamId || '',
    position: initialData?.position || '',
    phone: initialData?.phone || '',
    phoneCode: initialData?.phoneCode || '+55',
    nationality: initialData?.nationality || 'Brasileiro',
    birthDate: initialData?.birthDate || '',
    documentPhoto: initialData?.documentPhoto || '',
    shirtNumber: initialData?.shirtNumber || 0,
    isActive: initialData?.isActive ?? true,
    rg: initialData?.rg || '',
    cpf: initialData?.cpf || '',
    dni_colombia: initialData?.dni_colombia || '',
    dni_peru: initialData?.dni_peru || '',
    documentType: initialData?.documentType || 'cpf',
  });

  // Documentos disponíveis baseados na nacionalidade
  const [availableDocuments, setAvailableDocuments] = useState<DocumentConfig[]>([]);
  
  // Estados para erros de validação
  const [documentErrors, setDocumentErrors] = useState<Record<string, string | null>>({});

  // Atualiza documentos disponíveis quando a nacionalidade muda
  useEffect(() => {
    if (formData.nationality) {
      const documents = getDocumentsByNationality(formData.nationality);
      setAvailableDocuments(documents);
      
      // Se não há documento selecionado ou o documento atual não é válido para a nova nacionalidade
      const currentDocTypeValid = documents.some(doc => doc.type === formData.documentType);
      
      if (!formData.documentType || !currentDocTypeValid) {
        const defaultDocType = getDefaultDocumentType(formData.nationality);
        setFormData(prev => ({ 
          ...prev, 
          documentType: defaultDocType,
          // Limpa todos os documentos ao mudar de nacionalidade
          rg: '',
          cpf: '',
          dni_colombia: '',
          dni_peru: '',
        }));
        setDocumentErrors({});
      }
    }
  }, [formData.nationality]);

  // Handler genérico para mudança de documento
  const handleDocumentChange = (docType: DocumentType, value: string) => {
    let formattedValue = value;

    // Aplica formatação específica
    if (docType === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (docType === 'rg') {
      formattedValue = formatRG(value);
    } else {
      formattedValue = formatDocumentValue(docType, value);
    }

    setFormData(prev => ({ ...prev, [docType]: formattedValue }));

    // Valida em tempo real
    let error: string | null = null;
    
    if (docType === 'cpf' && formattedValue.length >= 14) {
      error = getDocumentErrorMessage('cpf', formattedValue);
    } else if (docType === 'rg' && formattedValue.length >= 10) {
      error = getDocumentErrorMessage('rg', formattedValue);
    } else if (formattedValue) {
      error = getDocumentError(docType, formattedValue);
    }

    setDocumentErrors(prev => ({ ...prev, [docType]: error }));
  };

  // Handler para checkbox do documento
  const handleDocumentCheckboxChange = (docType: DocumentType, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        documentType: docType,
      }));
      
      // Limpa erros de outros documentos
      const newErrors = { ...documentErrors };
      availableDocuments.forEach(doc => {
        if (doc.type !== docType) {
          newErrors[doc.type] = null;
        }
      });
      setDocumentErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: pelo menos um documento deve estar preenchido
    const hasDocument = availableDocuments.some(doc => {
      const value = formData[doc.type as keyof typeof formData];
      return value && typeof value === 'string' && value.trim() !== '';
    });

    if (!hasDocument) {
      alert('Por favor, preencha pelo menos um documento');
      return;
    }
    
    // Validação do documento ativo
    if (formData.documentType) {
      const documentValue = formData[formData.documentType];
      
      if (formData.documentType === 'cpf' && documentValue) {
        if (!validateCPF(documentValue)) {
          setDocumentErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
          return;
        }
      }
      
      if (formData.documentType === 'rg' && documentValue) {
        if (!validateRG(documentValue)) {
          setDocumentErrors(prev => ({ ...prev, rg: 'RG inválido' }));
          return;
        }
      }

      if (formData.documentType === 'dni_colombia' && documentValue) {
        const error = getDocumentError('dni_colombia', documentValue);
        if (error) {
          setDocumentErrors(prev => ({ ...prev, dni_colombia: error }));
          return;
        }
      }

      if (formData.documentType === 'dni_peru' && documentValue) {
        const error = getDocumentError('dni_peru', documentValue);
        if (error) {
          setDocumentErrors(prev => ({ ...prev, dni_peru: error }));
          return;
        }
      }
    }
    
    onSubmit(formData as Omit<Player, 'id'>);
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
          
          <PhoneInput
            label="Telefone"
            value={formData.phone}
            onChange={(e) => {
              const formatted = formatPhoneByCode(e.target.value, formData.phoneCode);
              setFormData(prev => ({ ...prev, phone: formatted }));
            }}
            phoneCode={formData.phoneCode}
            onPhoneCodeChange={(code) => {
              // Ao mudar o código do país, limpa o telefone para reformatar
              setFormData(prev => ({ ...prev, phoneCode: code, phone: '' }));
            }}
            required
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

        {/* Documentos - Dinâmicos baseados na nacionalidade */}
        {availableDocuments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Documentos de Identificação
              <span className="text-red-400 ml-1">*</span>
            </h3>
            <p className="text-xs text-gray-500">Selecione e preencha pelo menos um documento</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableDocuments.map((doc) => (
                <div key={doc.type} className="space-y-2">
                  <Checkbox
                    label={doc.label}
                    checked={formData.documentType === doc.type}
                    onChange={(checked) => handleDocumentCheckboxChange(doc.type, checked)}
                    size="md"
                  />
                  <Input
                    type="text"
                    placeholder={doc.placeholder}
                    value={formData[doc.type] || ''}
                    onChange={(e) => handleDocumentChange(doc.type, e.target.value)}
                    disabled={formData.documentType !== doc.type}
                    leftIcon={FileText}
                    error={documentErrors[doc.type] || undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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