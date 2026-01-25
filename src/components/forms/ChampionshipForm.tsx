// src/components/forms/ChampionshipForm.tsx
import React, { useState } from 'react';
import { Trophy, Users, Calendar, Building2, MapPin, Phone, X, Save } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../molecules/Button';
import { CustomSelect } from '../atoms/CustomSelect';
import { ImageUpload } from '../atoms/ImageUpload';
import { formatCapitalize, formatPhone } from '../../utils/formatters/inputFormatters';
import type { Championship } from '../../types/championship.types';

interface ChampionshipFormProps {
  onSubmit: (championship: Omit<Championship, 'id'>) => void;
  onCancel: () => void;
  initialData?: Championship;
}

export function ChampionshipForm({ onSubmit, onCancel, initialData }: ChampionshipFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    logo: string;
    organizer: string;
    local: string;
    phone: string;
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
    local: initialData?.local || '', // ✅ CORRIGIDO
    phone: initialData?.phone || '', // ✅ CORRIGIDO
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Seção Logo + Campos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
        
        {/* Logo Upload */}
        <div>
          <ImageUpload
            value={formData.logo}
            onChange={(imageData) => setFormData(prev => ({ ...prev, logo: imageData }))}
            label="Logo do Campeonato"
            placeholder="Adicionar Logo"
            size="lg"
            shape="square"
          />
        </div>

        {/* Campos: Nome, Organizador e Local */}
        <div className="space-y-4">
          {/* Nome do Campeonato */}
          <Input
            label="Nome do Campeonato"
            type="text"
            placeholder="Ex: Copa 2025"
            value={formData.name}
            onChange={(e) => {
              const formatted = formatCapitalize(e.target.value);
              setFormData(prev => ({ ...prev, name: formatted }));
            }}
            required
            leftIcon={Trophy}
          />

          {/* Organizador */}
          <Input
            label="Organizador"
            type="text"
            placeholder="Nome da entidade ou pessoa"
            value={formData.organizer}
            onChange={(e) => {
              const formatted = formatCapitalize(e.target.value);
              setFormData(prev => ({ ...prev, organizer: formatted }));
            }}
            required
            leftIcon={Building2}
          />

          {/* Local e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local */}
            <Input
              label="Local"
              type="text"
              placeholder="Ex: Estádio Municipal"
              value={formData.local}
              onChange={(e) => {
                const formatted = formatCapitalize(e.target.value);
                setFormData(prev => ({ ...prev, local: formatted }));
              }}
              required
              leftIcon={MapPin}
            />

            {/* Telefone */}
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
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200 pt-4"></div>

      {/* Form Grid - Demais Campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Categoria */}
        <CustomSelect
          label="Categoria"
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ 
            ...prev, 
            category: value as 'Masculino Livre' | 'Feminino Livre' | 'Veterano 35+' | 'Sub-13' | 'Sub-15'
          }))}
          options={['Masculino Livre', 'Feminino Livre', 'Veterano 35+', 'Sub-13', 'Sub-15']}
          placeholder="Selecione..."
          required
        />

        {/* Status */}
        <CustomSelect
          label="Status"
          value={formData.status}
          onChange={(value) => setFormData(prev => ({ 
            ...prev, 
            status: value as 'Agendado' | 'Em Andamento' | 'Finalizado' | 'Inativo' | 'Bloqueado'
          }))}
          options={['Agendado', 'Em Andamento', 'Finalizado', 'Inativo', 'Bloqueado']}
          required
        />

        {/* Formato */}
        <CustomSelect
          label="Formato"
          value={formData.format}
          onChange={(value) => setFormData(prev => ({ 
            ...prev, 
            format: value as 'Pontos Corridos' | 'Chaveamento'
          }))}
          options={['Pontos Corridos', 'Chaveamento']}
          required
        />

        {/* Número de Times */}
        <Input
          label="Nº de Times"
          type="number"
          placeholder="Ex: 16"
          value={formData.teams || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, teams: parseInt(e.target.value) || 0 }))}
          required
          min={2}
          leftIcon={Users}
        />

        {/* Data Início */}
        <Input
          label="Data de Início"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          required
          leftIcon={Calendar}
        />

        {/* Data Término */}
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

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          leftIcon={X}
          type="button"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="md"
          leftIcon={Save}
          type="submit"
          className="shadow-lg shadow-blue-200"
        >
          {initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}