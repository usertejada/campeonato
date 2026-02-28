'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { FilterIconButton } from '@/components/ui/FilterIconButton'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { CardTime } from '@/components/times/CardTime'
import { TabelaTimesTecnico } from '@/components/times/TabelaTimesTecnico'
import { TimeFormModal } from '@/components/times/TimeFormModal'
import { TimeDetailsModal } from '@/components/times/TimeDetailsModal'
import { JogadorFormModal, type JogadorInsert } from '@/components/jogadores/JogadorFormModal'
import { useTimes } from '@/hooks/useTimes'
import { createTime, updateTime, deleteTime, toggleAprovarTime } from '@/services/time.service'
import { createClient } from '@/lib/supabase'
import { Plus, Users } from 'lucide-react'
import type { Time, TimeInsert } from '@/types/time'

const filterOptionsAdmin = [
  { label: 'Todos',     value: 'all'      },
  { label: 'Aprovados', value: 'aprovado' },
  { label: 'Pendentes', value: 'pendente' },
]

const filterOptionsTecnico = [
  { label: 'Todos',           value: 'all'            },
  { label: 'Cartão Amarelo',  value: 'cartao_amarelo' },
  { label: 'Cartão Vermelho', value: 'cartao_vermelho'},
]

export default function TimesPage() {
  const [campeonatos,   setCampeonatos]   = useState<{ id: string; nome: string }[]>([])
  const [selecionado,   setSelecionado]   = useState<Time | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [userRole,      setUserRole]      = useState<string | null>(null)
  const [userId,        setUserId]        = useState<string | null>(null)

  const [modalCriarOpen,          setModalCriarOpen]          = useState(false)
  const [modalEditarOpen,         setModalEditarOpen]         = useState(false)
  const [modalDetalhesOpen,       setModalDetalhesOpen]       = useState(false)
  const [modalAprovarOpen,        setModalAprovarOpen]        = useState(false)
  const [modalExcluirOpen,        setModalExcluirOpen]        = useState(false)
  const [modalJogadorOpen,        setModalJogadorOpen]        = useState(false)
  const [timeParaJogador,         setTimeParaJogador]         = useState<Time | null>(null)

  const { times, loading, error, search, setSearch, setStatus, refetch } = useTimes()
  const [timesParaSelect, setTimesParaSelect] = useState<{ id: string; nome: string; logo_url: string | null }[]>([])

  const isTecnico = userRole === 'tecnico'
  const filterOptions = isTecnico ? filterOptionsTecnico : filterOptionsAdmin

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('campeonatos')
      .select('id, nome')
      .order('nome')
      .then(({ data }) => setCampeonatos(data ?? []))

    supabase
      .from('times')
      .select('id, nome, logo_url')
      .order('nome')
      .then(({ data }) => setTimesParaSelect(data ?? []))

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setUserRole(profile?.role ?? null)
    })
  }, [])

  function podeAprovar(time: Time): boolean {
    if (userRole === 'admin') return true
    if (userRole === 'organizador' && time.campeonato?.admin_id === userId) return true
    return false
  }

  // ─── Handlers ─────────────────────────────────────────────

  async function handleCriar(data: TimeInsert) {
    try {
      await createTime(data)
      setModalCriarOpen(false)
      refetch()
    } catch (err) { console.error(err) }
  }

  async function handleEditar(data: TimeInsert) {
    if (!selecionado) return
    try {
      await updateTime(selecionado.id, data)
      setModalEditarOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error(err) }
  }

  async function handleAprovar() {
    if (!selecionado) return
    setActionLoading(true)
    try {
      await toggleAprovarTime(selecionado.id, selecionado.aprovado)
      setModalAprovarOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleExcluir() {
    if (!selecionado) return
    setActionLoading(true)
    try {
      await deleteTime(selecionado.id)
      setModalExcluirOpen(false)
      setSelecionado(null)
      refetch()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleAdicionarJogador(data: JogadorInsert) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('jogadores').insert(data)
      if (error) throw new Error(error.message)
      setModalJogadorOpen(false)
      // Reabre detalhes para atualizar lista
      if (timeParaJogador) setModalDetalhesOpen(true)
    } catch (err) { console.error(err) }
  }

  function abrirDetalhes(t: Time) { setSelecionado(t); setModalDetalhesOpen(true) }
  function abrirEditar(t: Time)   { setSelecionado(t); setModalEditarOpen(true) }
  function abrirAprovar(t: Time)  { setSelecionado(t); setModalAprovarOpen(true) }
  function abrirExcluir(t: Time)  { setSelecionado(t); setModalExcluirOpen(true) }
  function abrirAdicionarJogador(t: Time) {
    setTimeParaJogador(t)
    setSelecionado(t)
    setModalDetalhesOpen(false)
    setModalJogadorOpen(true)
  }

  // ─── Render ───────────────────────────────────────────────

  return (
    <AppShell onAdd={() => setModalCriarOpen(true)}>

      {/* Header desktop */}
      <div className="hidden lg:block">
        <PageHeader
          title="Times"
          subtitle={isTecnico ? 'Gerencie seus times' : 'Gerencie todos os times do sistema'}
          action={
            <div className="flex items-center gap-3">
              <Button variant="outline" icon={Users} onClick={() => setModalJogadorOpen(true)}>
                Novo Jogador
              </Button>
              <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
                Novo Time
              </Button>
            </div>
          }
        />
      </div>

      {/* Header mobile */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Times</h1>
        <p className="text-sm text-gray-500">
          {isTecnico ? 'Gerencie seus times' : 'Gerencie todos os times'}
        </p>
      </div>

      {/* Search + Filtro */}
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex-1 lg:hidden">
          <SearchBar
            placeholder={isTecnico ? 'Buscar jogadores...' : 'Buscar times...'}
            onSearch={setSearch}
            size="full"
          />
        </div>
        <div className="hidden lg:block">
          <SearchBar
            placeholder={isTecnico ? 'Buscar jogadores...' : 'Buscar times...'}
            onSearch={setSearch}
            size="lg"
          />
        </div>
        <div className="lg:hidden shrink-0">
          <FilterIconButton options={filterOptions} onSelect={(v) => setStatus(v as any)} />
        </div>
        <div className="hidden lg:block shrink-0">
          <FilterDropdown options={filterOptions} onSelect={(v) => setStatus(v as any)} placeholder="Todos" />
        </div>
      </div>

      {/* Estados */}
      {loading && <div className="text-center py-12 text-gray-500">Carregando times...</div>}
      {error   && <div className="text-center py-12 text-red-500">Erro: {error}</div>}

      {/* Vazio */}
      {!loading && !error && times.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? 'Nenhum time encontrado' : 'Nenhum time cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {search ? `Nenhum resultado para "${search}"` : 'Comece cadastrando o primeiro time'}
          </p>
          {!search && (
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Novo Time
            </Button>
          )}
        </div>
      )}

      {/* Técnico → tabela */}
      {!loading && !error && times.length > 0 && isTecnico && (
        <TabelaTimesTecnico
          times={times}
          onDetalhes={abrirDetalhes}
          onEditar={abrirEditar}
          onExcluir={abrirExcluir}
          onAdicionarJogador={abrirAdicionarJogador}
          onEditarJogador={(jogador) => console.log('editar jogador', jogador)}
          onExcluirJogador={(jogador) => console.log('excluir jogador', jogador)}
        />
      )}

      {/* Admin/Organizador → cards */}
      {!loading && !error && times.length > 0 && !isTecnico && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {times.map(time => (
            <CardTime
              key={time.id}
              time={time}
              podeAprovar={podeAprovar(time)}
              onDetalhes={() => abrirDetalhes(time)}
              onEditar={() => abrirEditar(time)}
              onAprovar={() => abrirAprovar(time)}
              onExcluir={() => abrirExcluir(time)}
            />
          ))}
        </div>
      )}

      {/* ── Modais ─────────────────────────────────────── */}

      <TimeFormModal
        isOpen={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSubmit={handleCriar}
        campeonatos={campeonatos}
        titulo="Novo Time"
        isTecnico={isTecnico}
      />

      {selecionado && (
        <TimeFormModal
          isOpen={modalEditarOpen}
          onClose={() => { setModalEditarOpen(false); setSelecionado(null) }}
          onSubmit={handleEditar}
          inicial={selecionado}
          campeonatos={campeonatos}
          titulo="Editar Time"
          isTecnico={isTecnico}
        />
      )}

      {selecionado && (
        <TimeDetailsModal
          time={selecionado}
          isOpen={modalDetalhesOpen}
          onClose={() => { setModalDetalhesOpen(false); setSelecionado(null) }}
          isTecnico={isTecnico}
          onAdicionarJogador={() => abrirAdicionarJogador(selecionado)}
        />
      )}

      {/* Modal adicionar jogador */}
      <JogadorFormModal
        isOpen={modalJogadorOpen}
        onClose={() => { setModalJogadorOpen(false); setTimeParaJogador(null) }}
        onSubmit={handleAdicionarJogador}
        timeId={timeParaJogador?.id ?? selecionado?.id ?? ''}
        times={timesParaSelect}
      />

      <ConfirmModal
        isOpen={modalAprovarOpen}
        onClose={() => { setModalAprovarOpen(false); setSelecionado(null) }}
        onConfirm={handleAprovar}
        type={selecionado?.aprovado ? 'bloquear' : 'desbloquear'}
        titulo={selecionado?.aprovado
          ? `Reprovar "${selecionado?.nome}"?`
          : `Aprovar "${selecionado?.nome}"?`}
        descricao={selecionado?.aprovado
          ? 'O time voltará para pendente.'
          : 'O time será marcado como aprovado.'}
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