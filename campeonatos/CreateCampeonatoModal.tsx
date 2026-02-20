// src/components/campeonatos/CreateCampeonatoModal.tsx
'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FileUpload } from '@/components/ui/FileUpload'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { Trophy, Building2, MapPin, Users, Save, Hash } from 'lucide-react'
import type { CampeonatoInsert } from '@/types/campeonato'

interface CreateCampeonatoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CampeonatoInsert) => void
}

const categoriaOptions = [
  { value: 'Masculino Livre', label: 'Masculino Livre' },
  { value: 'Feminino Livre',  label: 'Feminino Livre' },
  { value: 'Veterano 35+',    label: 'Veterano 35+' },
  { value: 'Sub-13',          label: 'Sub-13' },
  { value: 'Sub-15',          label: 'Sub-15' },
  { value: 'Sub-17',          label: 'Sub-17' },
  { value: 'Sub-20',          label: 'Sub-20' },
]

const statusOptions = [
  { value: 'agendado',    label: 'Agendado' },
  { value: 'ativo',       label: 'Ativo' },
  { value: 'finalizado',  label: 'Finalizado' },
  { value: 'inativo',     label: 'Inativo' },
]

const formatoOptions = [
  { value: 'Pontos Corridos',    label: 'Pontos Corridos' },
  { value: 'Mata-Mata',          label: 'Mata-Mata' },
  { value: 'Grupos + Mata-Mata', label: 'Grupos + Mata-Mata' },
]

export function CreateCampeonatoModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCampeonatoModalProps) {
  const [formData, setFormData] = useState({
    logo: '' as string | null,
    nome: '',
    organizador: '',
    local: '',
    telefone: '',
    codigoPais: '+55',
    categoria: 'Masculino Livre',
    status: 'agendado',
    formato: 'Pontos Corridos',
    numeroTimes: 8,
    dataInicio: '',
    dataTermino: '',
    anoCriacao: '',
  })

  const set = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.dataInicio || !formData.dataTermino) return

    // Mapeia camelCase do form → snake_case do Supabase
    const payload: CampeonatoInsert = {
      nome: formData.nome,
      organizador: formData.organizador,
      local: formData.local,
      logo_url: formData.logo || null,
      categoria: formData.categoria,
      status: formData.status as CampeonatoInsert['status'],
      formato: formData.formato,
      numero_times: formData.numeroTimes,
      data_inicio: formData.dataInicio,
      data_termino: formData.dataTermino,
      telefone: formData.telefone || null,
      phone_code: formData.codigoPais || null,
      ano_criacao: formData.anoCriacao ? parseInt(formData.anoCriacao) : null,
    }

    onSubmit(payload)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Campeonato" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Seção 1: Logo + Campos principais */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">

          <div className="w-full sm:w-auto">
            <FileUpload
              label="Logo"
              value={formData.logo}
              onChange={(val) => set('logo', val)}
              shape="square"
              size="md"
              placeholder="Adicionar logo"
              hint="PNG, JPG até 5MB"
              fullWidthOnMobile
            />
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome do Campeonato"
              type="text"
              placeholder="Ex: Copa 2025"
              value={formData.nome}
              onChange={(e) => set('nome', e.target.value)}
              required
              icon={Trophy}
              iconPosition="left"
            />

            <Input
              label="Organizador"
              type="text"
              placeholder="Entidade ou pessoa"
              value={formData.organizador}
              onChange={(e) => set('organizador', e.target.value)}
              required
              icon={Building2}
              iconPosition="left"
            />

            <Input
              label="Local"
              type="text"
              placeholder="Estádio ou Ginásio"
              value={formData.local}
              onChange={(e) => set('local', e.target.value)}
              required
              icon={MapPin}
              iconPosition="left"
            />

            <Select
              label="Categoria"
              options={categoriaOptions}
              value={formData.categoria}
              onChange={(v) => set('categoria', v)}
              required
            />
          </div>
        </div>

        {/* Linha divisória */}
        <div className="h-px bg-gray-200" />

        {/* Seção 2: Detalhes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <PhoneInput
            label="Telefone"
            value={formData.telefone}
            countryCode={formData.codigoPais}
            onCountryCodeChange={(code) => set('codigoPais', code)}
            onPhoneChange={(phone) => set('telefone', phone)}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(v) => set('status', v)}
            required
          />

          <Select
            label="Formato"
            options={formatoOptions}
            value={formData.formato}
            onChange={(v) => set('formato', v)}
            required
          />

          <Input
            label="Nº de Times"
            type="number"
            placeholder="8"
            value={formData.numeroTimes.toString()}
            onChange={(e) => set('numeroTimes', parseInt(e.target.value) || 0)}
            required
            min={2}
            icon={Users}
            iconPosition="left"
          />

          <DateRangePicker
            label="Período do Campeonato"
            startDate={formData.dataInicio}
            endDate={formData.dataTermino}
            onStartChange={(v) => set('dataInicio', v)}
            onEndChange={(v) => set('dataTermino', v)}
            required
          />

          <Input
            label="Ano de Fundação"
            type="number"
            placeholder={`Ex: ${new Date().getFullYear()}`}
            value={formData.anoCriacao}
            onChange={(e) => set('anoCriacao', e.target.value)}
            icon={Hash}
            iconPosition="left"
            min={1800}
            max={new Date().getFullYear()}
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            type="button"
            variant="ghost"
            size="md"
            fullWidth={false}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            fullWidth={false}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}