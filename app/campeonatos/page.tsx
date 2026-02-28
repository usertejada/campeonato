'use client'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { FilterIconButton } from '@/components/ui/FilterIconButton'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import CardCampeonatos from '@/campeonatos/CardCampeonatos'
import { CampeonatoDetailsModal } from '@/campeonatos/CampeonatoDetailsModal'
import { CreateCampeonatoModal } from '@/campeonatos/CreateCampeonatoModal'
import { EditCampeonatoModal } from '@/campeonatos/EditCampeonatoModal'
import { useCampeonatos } from '@/hooks/useCampeonatos'
import { createCampeonato, updateCampeonato, deleteCampeonato } from '@/services/campeonato.service'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { Campeonato, CampeonatoInsert } from '@/types/campeonato'

const filterOptions = [
  { label: 'Todos',      value: 'all'        },
  { label: 'Agendado',   value: 'agendado'   },
  { label: 'Ativo',      value: 'ativo'      },
  { label: 'Finalizado', value: 'finalizado' },
  { label: 'Inativo',    value: 'inativo'    },
]

function toModalProps(c: Campeonato) {
  return {
    id:          c.id,
    nome:        c.nome,
    organizador: c.organizador,
    local:       c.local,
    logo:        c.logo_url,
    categoria:   c.categoria,
    status:      c.status,
    formato:     c.formato,
    numeroTimes: c.numero_times,
    dataInicio:  c.data_inicio,
    dataTermino: c.data_termino,
    anoCriacao:  c.ano_criacao?.toString(),
    telefone:    c.telefone,
    phoneCode:   c.phone_code,
  }
}

export default function CampeonatosPage() {
  const [modalCriarOpen,    setModalCriarOpen]    = useState(false)
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false)
  const [modalEditarOpen,   setModalEditarOpen]   = useState(false)
  const [modalExcluirOpen,  setModalExcluirOpen]  = useState(false)
  const [modalBloquearOpen, setModalBloquearOpen] = useState(false)

  const [selecionado,   setSelecionado]   = useState<Campeonato | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const { campeonatos, loading, error, search, setSearch, setStatusFiltro, refetch } = useCampeonatos()

  async function handleCriar(data: CampeonatoInsert) {
    try {
      await createCampeonato(data)
      setModalCriarOpen(false)
      refetch()
    } catch (err) { console.error('Erro ao criar:', err) }
  }

  async function handleEditar(id: string, data: Partial<CampeonatoInsert>) {
    try {
      await updateCampeonato(id, data)
      setModalEditarOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error('Erro ao editar:', err) }
  }

  async function handleToggleBloquear() {
    if (!selecionado) return
    setActionLoading(true)
    const novoStatus = selecionado.status === 'inativo' ? 'ativo' : 'inativo'
    try {
      await updateCampeonato(selecionado.id, { status: novoStatus })
      setModalBloquearOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error('Erro:', err) }
    finally { setActionLoading(false) }
  }

  async function handleExcluir() {
    if (!selecionado) return
    setActionLoading(true)
    try {
      await deleteCampeonato(selecionado.id)
      setModalExcluirOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error('Erro:', err) }
    finally { setActionLoading(false) }
  }

  function abrirDetalhes(c: Campeonato) { setSelecionado(c); setModalDetalhesOpen(true) }
  function abrirEditar(c: Campeonato)   { setSelecionado(c); setModalEditarOpen(true)   }
  function abrirExcluir(c: Campeonato)  { setSelecionado(c); setModalExcluirOpen(true)  }
  function abrirBloquear(c: Campeonato) { setSelecionado(c); setModalBloquearOpen(true) }

  const tipoModalBloquear = selecionado?.status === 'inativo' ? 'desbloquear' : 'bloquear'

  return (
    <AppShell onAdd={() => setModalCriarOpen(true)}>

      {/* Desktop: header com botão */}
      <div className="hidden lg:block">
        <PageHeader
          title="Campeonatos"
          subtitle="Gerencie todos os campeonatos do sistema"
          action={
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Novo Campeonato
            </Button>
          }
        />
      </div>

      {/* Mobile: título */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Campeonatos</h1>
        <p className="text-sm text-gray-500">Gerencie todos os campeonatos</p>
      </div>

      {/* Search + Filtro */}
      <div className="flex items-center justify-between gap-2 mb-8">

        {/* Mobile: search full width */}
        <div className="flex-1 lg:hidden">
          <SearchBar
            className="text-gray-500"
            placeholder="Buscar campeonatos..."
            onSearch={setSearch}
            size="full"
          />
        </div>

        {/* Desktop: search tamanho lg */}
        <div className="hidden lg:block">
          <SearchBar
            className="text-gray-500"
            placeholder="Buscar campeonatos..."
            onSearch={setSearch}
            size="lg"
          />
        </div>

        {/* Mobile: só ícone */}
        <div className="lg:hidden shrink-0">
          <FilterIconButton
            options={filterOptions}
            onSelect={(v) => setStatusFiltro(v as any)}
          />
        </div>

        {/* Desktop: dropdown completo */}
        <div className="hidden lg:block shrink-0">
          <FilterDropdown
            options={filterOptions}
            onSelect={(v) => setStatusFiltro(v as any)}
            placeholder="Todos"
          />
        </div>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Carregando campeonatos...</div>}
      {error   && <div className="text-center py-12 text-red-500">Erro ao carregar: {error}</div>}

      {!loading && !error && campeonatos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? 'Nenhum campeonato encontrado' : 'Nenhum campeonato cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {search ? `Nenhum resultado para "${search}"` : 'Comece criando seu primeiro campeonato'}
          </p>
          {!search && (
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Criar Campeonato
            </Button>
          )}
        </div>
      )}

      {!loading && !error && campeonatos.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campeonatos.map((campeonato) => (
            <CardCampeonatos
              key={campeonato.id}
              {...campeonato}
              logo={campeonato.logo_url}
              numeroTimes={campeonato.numero_times}
              dataInicio={campeonato.data_inicio}
              dataTermino={campeonato.data_termino}
              onClick={() => abrirDetalhes(campeonato)}
              onDetalhes={() => abrirDetalhes(campeonato)}
              onEditar={() => abrirEditar(campeonato)}
              onBloquear={() => abrirBloquear(campeonato)}
              onExcluir={() => abrirExcluir(campeonato)}
            />
          ))}
        </div>
      )}

      {/* ── Modais ───────────────────────────────────────── */}
      <CreateCampeonatoModal
        isOpen={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSubmit={handleCriar}
      />

      {selecionado && (
        <CampeonatoDetailsModal
          campeonato={toModalProps(selecionado)}
          isOpen={modalDetalhesOpen}
          onClose={() => { setModalDetalhesOpen(false); setSelecionado(null) }}
        />
      )}

      {selecionado && (
        <EditCampeonatoModal
          isOpen={modalEditarOpen}
          onClose={() => { setModalEditarOpen(false); setSelecionado(null) }}
          onSubmit={handleEditar}
          campeonato={selecionado}
        />
      )}

      <ConfirmModal
        isOpen={modalBloquearOpen}
        onClose={() => { setModalBloquearOpen(false); setSelecionado(null) }}
        onConfirm={handleToggleBloquear}
        type={tipoModalBloquear}
        titulo={tipoModalBloquear === 'desbloquear' ? `Desbloquear "${selecionado?.nome}"?` : `Bloquear "${selecionado?.nome}"?`}
        descricao={tipoModalBloquear === 'desbloquear' ? 'O campeonato voltará ao status ativo.' : 'O campeonato será marcado como inativo.'}
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