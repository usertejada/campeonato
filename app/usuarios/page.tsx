// src/app/usuarios/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { FilterIconButton } from '@/components/ui/FilterIconButton'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase'
import { Plus, User, Mail, Shield, Users, Phone } from 'lucide-react'
import { FileUpload } from '@/components/ui/FileUpload'
import { PhoneInput } from '@/components/ui/PhoneInput'

interface Usuario {
  id: string
  nome: string
  email: string
  role: 'admin' | 'organizador' | 'tecnico'
  ativo: boolean
  telefone: string | null
  foto_url: string | null
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'admin',       label: 'Administrador' },
  { value: 'organizador', label: 'Organizador'   },
  { value: 'tecnico',     label: 'Técnico'       },
]

const filterOptions = [
  { label: 'Todos',        value: 'all'        },
  { label: 'Admin',        value: 'admin'      },
  { label: 'Organizador',  value: 'organizador'},
  { label: 'Técnico',      value: 'tecnico'    },
]

function getRoleLabel(role: string) {
  if (role === 'admin')       return 'Administrador'
  if (role === 'organizador') return 'Organizador'
  return 'Técnico'
}

function getRoleBadgeClass(role: string) {
  if (role === 'admin')       return 'bg-purple-100 text-purple-700'
  if (role === 'organizador') return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-orange-500', 'bg-pink-500', 'bg-indigo-500',
]

function getAvatarColor(id: string) {
  const idx = id.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

// ─── Modal de Form ─────────────────────────────────────────────────────────────

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { nome: string; email: string; role: string; senha?: string; telefone?: string; foto_url?: string | null }) => void
  inicial?: Usuario | null
  titulo?: string
  loading?: boolean
}

function UserFormModal({ isOpen, onClose, onSubmit, inicial, titulo = 'Novo Usuário', loading }: UserFormModalProps) {
  const [nome,     setNome]     = useState('')
  const [email,    setEmail]    = useState('')
  const [role,     setRole]     = useState('tecnico')
  const [senha,    setSenha]    = useState('')
  const [telefone, setTelefone] = useState('')
  const [telefoneCC, setTelefoneCC] = useState('+55')
  const [fotoUrl,  setFotoUrl]  = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && inicial) {
      setNome(inicial.nome); setEmail(inicial.email); setRole(inicial.role); setSenha('')
      setTelefone(inicial.telefone ?? ''); setFotoUrl(inicial.foto_url ?? null)
    }
    if (!isOpen) {
      setNome(''); setEmail(''); setRole('tecnico'); setSenha('')
      setTelefone(''); setTelefoneCC('+55'); setFotoUrl(null); setErrors({})
    }
  }, [isOpen, inicial])

  function validate() {
    const e: Record<string, string> = {}
    if (!nome.trim())              e.nome  = 'Nome obrigatório'
    if (!email.trim())             e.email = 'Email obrigatório'
    if (!inicial && !senha.trim()) e.senha = 'Senha obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({ nome, email, role, senha: senha || undefined, telefone, foto_url: fotoUrl })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>Salvar</Button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Foto de perfil */}
        <div className="flex justify-center">
          <FileUpload
            label="Foto de Perfil"
            value={fotoUrl}
            onChange={setFotoUrl}
            shape="circle"
            size="lg"
            placeholder="Adicionar foto"
            hint="Foto do usuário"
          />
        </div>

        <Input
          label="Nome completo"
          required
          icon={User}
          placeholder="Ex: João Silva"
          value={nome}
          onChange={e => setNome(e.target.value)}
          error={errors.nome}
        />
        <Input
          label="Email"
          required
          type="email"
          icon={Mail}
          placeholder="Ex: joao@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
        />
        <PhoneInput
          label="Telefone"
          countryCode={telefoneCC}
          onCountryCodeChange={setTelefoneCC}
          onPhoneChange={setTelefone}
          value={telefone}
        />
        <Select
          label="Perfil"
          required
          icon={Shield}
          options={ROLE_OPTIONS}
          value={role}
          onChange={setRole}
          placeholder="Selecione o perfil"
        />
        <Input
          label={inicial ? 'Nova senha (deixe em branco para não alterar)' : 'Senha'}
          required={!inicial}
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          error={errors.senha}
        />
      </div>
    </Modal>
  )
}

// ─── Página ────────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
  const [usuarios,      setUsuarios]      = useState<Usuario[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [roleFiltro,    setRoleFiltro]    = useState('all')
  const [actionLoading, setActionLoading] = useState(false)

  const [selecionado,       setSelecionado]       = useState<Usuario | null>(null)
  const [modalCriarOpen,    setModalCriarOpen]    = useState(false)
  const [modalEditarOpen,   setModalEditarOpen]   = useState(false)
  const [modalExcluirOpen,  setModalExcluirOpen]  = useState(false)
  const [modalBloquearOpen, setModalBloquearOpen] = useState(false)

  async function fetchUsuarios() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, email, role, ativo, telefone, foto_url, created_at')
      .order('nome')
    setUsuarios(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchUsuarios() }, [])

  const filtrado = useMemo(() => {
    let lista = usuarios
    if (roleFiltro !== 'all') lista = lista.filter(u => u.role === roleFiltro)
    if (search) {
      const q = search.toLowerCase()
      lista = lista.filter(u =>
        u.nome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    }
    return lista
  }, [usuarios, search, roleFiltro])

  async function handleCriar(data: { nome: string; email: string; role: string; senha?: string; telefone?: string; foto_url?: string | null }) {
    setActionLoading(true)
    try {
      const res = await fetch('/api/usuarios/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    data.email,
          senha:    data.senha,
          nome:     data.nome,
          role:     data.role,
          telefone: data.telefone ?? null,
          foto_url: data.foto_url ?? null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setModalCriarOpen(false)
      fetchUsuarios()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleEditar(data: { nome: string; email: string; role: string; senha?: string; telefone?: string; foto_url?: string | null }) {
    if (!selecionado) return
    setActionLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('profiles').update({
        nome:     data.nome,
        email:    data.email,
        role:     data.role,
        telefone: data.telefone ?? null,
        foto_url: data.foto_url ?? null,
      }).eq('id', selecionado.id)

      setModalEditarOpen(false)
      setSelecionado(null)
      fetchUsuarios()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleExcluir() {
    if (!selecionado) return
    setActionLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('profiles').delete().eq('id', selecionado.id)
      setModalExcluirOpen(false)
      setSelecionado(null)
      fetchUsuarios()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleBloquear() {
    if (!selecionado) return
    setActionLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('profiles')
        .update({ ativo: !selecionado.ativo })
        .eq('id', selecionado.id)
      setModalBloquearOpen(false)
      setSelecionado(null)
      fetchUsuarios()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  return (
    <AppShell>

      {/* Header desktop */}
      <div className="hidden lg:block">
        <PageHeader
          title="Usuários"
          subtitle={`${usuarios.length} usuários cadastrados`}
          action={
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Novo Usuário
            </Button>
          }
        />
      </div>

      {/* Header mobile */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Usuários</h1>
        <p className="text-sm text-gray-500">{usuarios.length} cadastrados</p>
      </div>

      {/* Search + Filtro */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex-1 lg:hidden">
          <SearchBar placeholder="Buscar usuários..." onSearch={setSearch} size="full" />
        </div>
        <div className="hidden lg:block">
          <SearchBar placeholder="Buscar por nome ou email..." onSearch={setSearch} size="lg" />
        </div>
        <div className="lg:hidden shrink-0">
          <FilterIconButton options={filterOptions} onSelect={setRoleFiltro} />
        </div>
        <div className="hidden lg:block shrink-0">
          <FilterDropdown options={filterOptions} onSelect={setRoleFiltro} placeholder="Todos" />
        </div>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Carregando usuários...</div>}

      {!loading && filtrado.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {search ? 'Nenhum resultado' : 'Nenhum usuário cadastrado'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {search ? `Nenhum usuário encontrado para "${search}"` : 'Comece cadastrando o primeiro usuário.'}
          </p>
          {!search && (
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Novo Usuário
            </Button>
          )}
        </div>
      )}

      {!loading && filtrado.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header tabela */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Usuário</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Perfil</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Status</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ações</span>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-gray-50">
            {filtrado.map(usuario => (
              <div
                key={usuario.id}
                className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors items-center"
              >
                {/* Avatar + Nome */}
                <div className="flex items-center gap-3 min-w-0">
                  {usuario.foto_url ? (
                    <img src={usuario.foto_url} alt={usuario.nome} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={`w-9 h-9 ${getAvatarColor(usuario.id)} rounded-full flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{getInitials(usuario.nome)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate">{usuario.nome}</span>
                </div>

                {/* Email */}
                <span className="text-sm text-gray-500 truncate">{usuario.email}</span>

                {/* Role badge */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${getRoleBadgeClass(usuario.role)}`}>
                  {getRoleLabel(usuario.role)}
                </span>

                {/* Status */}
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    usuario.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${usuario.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
                    {usuario.ativo ? 'Ativo' : 'Bloqueado'}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelecionado(usuario); setModalEditarOpen(true) }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelecionado(usuario); setModalBloquearOpen(true) }}
                    className={usuario.ativo ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                  >
                    {usuario.ativo ? 'Bloquear' : 'Ativar'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelecionado(usuario); setModalExcluirOpen(true) }}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modais ──────────────────────────────────────── */}

      <UserFormModal
        isOpen={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSubmit={handleCriar}
        titulo="Novo Usuário"
        loading={actionLoading}
      />

      <UserFormModal
        isOpen={modalEditarOpen}
        onClose={() => { setModalEditarOpen(false); setSelecionado(null) }}
        onSubmit={handleEditar}
        inicial={selecionado}
        titulo="Editar Usuário"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={modalBloquearOpen}
        onClose={() => { setModalBloquearOpen(false); setSelecionado(null) }}
        onConfirm={handleBloquear}
        type={selecionado?.ativo ? 'bloquear' : 'desbloquear'}
        titulo={selecionado?.ativo
          ? `Bloquear "${selecionado?.nome}"?`
          : `Ativar "${selecionado?.nome}"?`}
        descricao={selecionado?.ativo
          ? 'O usuário não conseguirá mais acessar o sistema.'
          : 'O usuário voltará a ter acesso ao sistema.'}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={modalExcluirOpen}
        onClose={() => { setModalExcluirOpen(false); setSelecionado(null) }}
        onConfirm={handleExcluir}
        type="excluir"
        titulo={`Excluir "${selecionado?.nome}"?`}
        descricao="Essa ação é permanente e não pode ser desfeita."
        loading={actionLoading}
      />

    </AppShell>
  )
}