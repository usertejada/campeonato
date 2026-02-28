// src/components/times/TimeFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { FileUpload } from '@/components/ui/FileUpload'
import { Users, MapPin, Calendar, Hash, Save, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { TimeInsert } from '@/types/time'

interface TimeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TimeInsert & { tecnico_id?: string | null }) => void
  inicial?: Partial<TimeInsert & { tecnico_id?: string | null }>
  campeonatos: { id: string; nome: string }[]
  titulo: string
  isTecnico?: boolean
}

export function TimeFormModal({
  isOpen, onClose, onSubmit, inicial, campeonatos, titulo, isTecnico = false
}: TimeFormModalProps) {
  const [form, setForm] = useState<TimeInsert & { tecnico_id: string | null }>({
    nome:                 '',
    logo_url:             null,
    cidade:               '',
    campeonato_id:        null,
    ano_fundacao:         null,
    quantidade_jogadores: null,
    tecnico_id:           null,
  })

  const [erroCampeonato, setErroCampeonato] = useState(false)
  const [usuarios, setUsuarios] = useState<{ id: string; nome: string }[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)

  // Busca usuários do Supabase ao abrir o modal
  useEffect(() => {
    if (!isOpen) return

    async function fetchUsuarios() {
      setLoadingUsuarios(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('id, nome')
        // Remova o filtro abaixo se quiser listar todos os usuários
        .eq('role', 'tecnico')
        .eq('ativo', true)
        .order('nome')
      setUsuarios(data ?? [])
      setLoadingUsuarios(false)
    }

    fetchUsuarios()
  }, [isOpen])

  useEffect(() => {
    setForm({
      nome:                 inicial?.nome                 ?? '',
      logo_url:             inicial?.logo_url             ?? null,
      cidade:               inicial?.cidade               ?? '',
      campeonato_id:        inicial?.campeonato_id        ?? null,
      ano_fundacao:         inicial?.ano_fundacao         ?? null,
      quantidade_jogadores: inicial?.quantidade_jogadores ?? null,
      tecnico_id:           inicial?.tecnico_id           ?? null,
    })
    setErroCampeonato(false)
  }, [isOpen])

  const set = (key: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const campeonatoOptions = [
    { value: '', label: 'Selecione um campeonato' },
    ...campeonatos.map(c => ({ value: c.id, label: c.nome })),
  ]

  const usuarioOptions = [
    { value: '', label: loadingUsuarios ? 'Carregando...' : 'Nenhum (opcional)' },
    ...usuarios.map(u => ({ value: u.id, label: u.nome })),
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isTecnico && !form.campeonato_id) {
      setErroCampeonato(true)
      return
    }

    setErroCampeonato(false)
    onSubmit({ ...form })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titulo} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Logo + Nome + Cidade */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <FileUpload
            label="Escudo"
            value={form.logo_url}
            onChange={(val) => set('logo_url', val)}
            shape="square"
            size="md"
            placeholder="Adicionar escudo"
            hint="PNG, JPG até 5MB"
          />
          <div className="flex-1 w-full space-y-3">
            <Input
              label="Nome do Time"
              type="text"
              placeholder="Ex: Flamengo FC"
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              required
              icon={Users}
              iconPosition="left"
            />

            {/* Seleção de usuário cadastrado no Supabase */}
          <Select
            label="Técnico Responsável"
            options={usuarioOptions}
            value={form.tecnico_id ?? ''}
            onChange={(v) => set('tecnico_id', v || null)}
            icon={User}
          />

            
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Campo campeonato — só para admin/organizador */}
          {!isTecnico && (
            <div>
              <Select
                label="Campeonato *"
                options={campeonatoOptions}
                value={form.campeonato_id ?? ''}
                onChange={(v) => {
                  set('campeonato_id', v || null)
                  setErroCampeonato(false)
                }}
              />
              {erroCampeonato && (
                <p className="text-red-500 text-xs mt-1">Selecione um campeonato.</p>
              )}
            </div>
          )}

          <Input
            label="Ano de Fundação"
            type="number"
            placeholder={`Ex: ${new Date().getFullYear()}`}
            value={form.ano_fundacao?.toString() ?? ''}
            onChange={(e) => set('ano_fundacao', e.target.value ? parseInt(e.target.value) : null)}
            icon={Calendar}
            iconPosition="left"
            min={1800}
            max={new Date().getFullYear()}
          />

          <Input
            label="Quantidade de Jogadores"
            type="number"
            placeholder="Ex: 22"
            value={form.quantidade_jogadores?.toString() ?? ''}
            onChange={(e) => set('quantidade_jogadores', e.target.value ? parseInt(e.target.value) : null)}
            icon={Hash}
            iconPosition="left"
            min={1}
          />

          <Input
              label="Cidade"
              type="text"
              placeholder="Ex: Rio de Janeiro"
              value={form.cidade ?? ''}
              onChange={(e) => set('cidade', e.target.value)}
              icon={MapPin}
              iconPosition="left"
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onClose} type="button" variant="ghost" size="md" fullWidth={false}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" icon={Save} fullWidth={false}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}