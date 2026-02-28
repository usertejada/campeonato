// src/app/jogos/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { StatusTabs } from '@/components/ui/StatusTabs'
import { StatsBar } from '@/components/ui/StatsBar'
import { createClient } from '@/lib/supabase'
import { Zap, Plus, CalendarDays, Calendar, Clock, Flag } from 'lucide-react'
import { JogoCard, type Jogo } from '@/components/jogos/JogoCard'
import { GerarJogosModal } from '@/components/jogos/GerarJogosModal'
import { FinalizarJogoModal } from '@/components/jogos/FinalizarJogoModal'
import { NovoJogoModal } from '@/components/jogos/NovoJogoModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

// ── Constants ─────────────────────────────────────────────────

const STATUS_FILTROS = [
  { label: 'Todos',      value: 'todos'        },
  { label: 'Agendados',  value: 'agendado'     },
  { label: 'Ao Vivo',    value: 'em_andamento' },
  { label: 'Cancelados', value: 'cancelado'    },
  { label: 'W.O.',       value: 'wo'           },
]

// ── Types ─────────────────────────────────────────────────────

interface GrupoData {
  dataLabel: string
  jogos: Jogo[]
}

interface GrupoRodada {
  rodada: number | null
  label: string
  grupos: GrupoData[]
}

// ── Helpers ───────────────────────────────────────────────────

function formatarDataLabel(dataHora: string | null): string {
  if (!dataHora) return 'Sem data definida'
  return new Date(dataHora).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function construirGrupos(filtrado: Jogo[]): GrupoRodada[] {
  const comRodada = filtrado.filter(j => j.rodada !== null && j.rodada !== undefined)
  const semRodada = filtrado.filter(j => j.rodada === null || j.rodada === undefined)

  // Agrupa com rodada → por número de rodada → por data
  const rodadaMap = new Map<number, Jogo[]>()
  for (const jogo of comRodada) {
    const r = jogo.rodada as number
    if (!rodadaMap.has(r)) rodadaMap.set(r, [])
    rodadaMap.get(r)!.push(jogo)
  }

  const gruposComRodada: GrupoRodada[] = Array.from(rodadaMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([rodada, jogos]) => {
      const dataMap = new Map<string, Jogo[]>()
      for (const jogo of jogos) {
        const chave = formatarDataLabel(jogo.data_hora)
        if (!dataMap.has(chave)) dataMap.set(chave, [])
        dataMap.get(chave)!.push(jogo)
      }
      return {
        rodada,
        label: `${rodada}ª Rodada`,
        grupos: Array.from(dataMap.entries()).map(([dataLabel, jogos]) => ({ dataLabel, jogos })),
      }
    })

  // Jogos sem rodada → agrupados só por data (sem título de rodada)
  const gruposSemRodada: GrupoRodada[] = []
  if (semRodada.length > 0) {
    const dataMap = new Map<string, Jogo[]>()
    for (const jogo of semRodada) {
      const chave = formatarDataLabel(jogo.data_hora)
      if (!dataMap.has(chave)) dataMap.set(chave, [])
      dataMap.get(chave)!.push(jogo)
    }
    gruposSemRodada.push({
      rodada: null,
      label: '',
      grupos: Array.from(dataMap.entries()).map(([dataLabel, jogos]) => ({ dataLabel, jogos })),
    })
  }

  // Rodadas numeradas primeiro, sem rodada por último
  return [...gruposComRodada, ...gruposSemRodada]
}

// ── Page ──────────────────────────────────────────────────────

export default function JogosPage() {
  const [jogos,            setJogos]            = useState<Jogo[]>([])
  const [loading,          setLoading]          = useState(true)
  const [userRole,         setUserRole]         = useState<string | null>(null)
  const [search,           setSearch]           = useState('')
  const [statusFiltro,     setStatusFiltro]     = useState('todos')
  const [campeonatoFiltro, setCampeonatoFiltro] = useState('')
  const [campeonatos,      setCampeonatos]      = useState<{ id: string; nome: string }[]>([])

  const [modalGerar,       setModalGerar]       = useState(false)
  const [modalNovo,        setModalNovo]        = useState(false)
  const [modalFinalizar,   setModalFinalizar]   = useState(false)
  const [modalCancelar,    setModalCancelar]    = useState(false)
  const [jogoSelecionado,  setJogoSelecionado]  = useState<Jogo | null>(null)
  const [actionLoading,    setActionLoading]    = useState(false)

  async function fetchJogos() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('jogos')
      .select(`
        id, campeonato_id, time_casa_id, time_fora_id,
        data_hora, local, rodada, placar_casa, placar_fora,
        finalizado, wo, observacoes, status,
        tempo_primeiro, tempo_segundo, intervalo,
        cartoes_amarelos_casa, cartoes_amarelos_fora,
        cartoes_vermelhos_casa, cartoes_vermelhos_fora,
        created_at, updated_at,
        time_casa:times!jogos_time_casa_id_fkey(nome, logo_url),
        time_fora:times!jogos_time_fora_id_fkey(nome, logo_url),
        campeonato:campeonatos(nome)
      `)
      .or('finalizado.eq.false,wo.eq.true')
      .neq('status', 'finalizado')
      .neq('status', 'cancelado')
      .order('rodada',    { ascending: true, nullsFirst: false })
      .order('data_hora', { ascending: true })

    const normalizado = (data ?? []).map((j: any) => ({
      ...j,
      time_casa:  Array.isArray(j.time_casa)  ? j.time_casa[0]  ?? null : j.time_casa,
      time_fora:  Array.isArray(j.time_fora)  ? j.time_fora[0]  ?? null : j.time_fora,
      campeonato: Array.isArray(j.campeonato) ? j.campeonato[0] ?? null : j.campeonato,
    }))

    setJogos(normalizado)
    setLoading(false)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setUserRole(profile?.role ?? null)
    })
    supabase.from('campeonatos').select('id, nome').order('nome').then(({ data }) => setCampeonatos(data ?? []))
    fetchJogos()
  }, [])

  const canManage = userRole === 'admin' || userRole === 'organizador'

  const filtrado = useMemo(() => {
    let lista = jogos
    if (statusFiltro === 'wo') {
      lista = lista.filter(j => j.wo)
    } else if (statusFiltro !== 'todos') {
      lista = lista.filter(j => j.status === statusFiltro)
    }
    if (campeonatoFiltro) lista = lista.filter(j => j.campeonato_id === campeonatoFiltro)
    if (search) {
      const q = search.toLowerCase()
      lista = lista.filter(j =>
        j.time_casa?.nome?.toLowerCase().includes(q) ||
        j.time_fora?.nome?.toLowerCase().includes(q) ||
        j.local?.toLowerCase().includes(q) ||
        j.campeonato?.nome?.toLowerCase().includes(q)
      )
    }
    return lista
  }, [jogos, statusFiltro, campeonatoFiltro, search])

  const gruposFinais = useMemo(() => construirGrupos(filtrado), [filtrado])

  async function handleCancelar() {
    if (!jogoSelecionado) return
    setActionLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('jogos').update({ status: 'cancelado' }).eq('id', jogoSelecionado.id)
      setModalCancelar(false)
      setJogoSelecionado(null)
      fetchJogos()
    } finally {
      setActionLoading(false)
    }
  }

  const campeonatoOptions = [
    { value: '', label: 'Todos os campeonatos' },
    ...campeonatos.map(c => ({ value: c.id, label: c.nome })),
  ]

  return (
    <AppShell onAdd={canManage ? () => setModalNovo(true) : undefined}>
      <PageHeader
        title="Jogos"
        subtitle="Gerencie partidas e resultados"
        action={canManage ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setModalNovo(true)} className="hidden lg:flex">
              Novo Jogo
            </Button>
            <Button variant="primary" size="sm" icon={Zap} onClick={() => setModalGerar(true)}>
              <span className="hidden lg:inline">Gerar Automático</span>
            </Button>
          </div>
        ) : undefined}
      />

      {/* Stats rápidas */}
      <StatsBar
        stats={[
          { label: 'Total',      value: jogos.length,                                          icon: CalendarDays, iconBg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
          { label: 'Agendados',  value: jogos.filter(j => j.status === 'agendado').length,     icon: Calendar,     iconBg: 'bg-violet-50', iconColor: 'text-violet-500' },
          { label: 'Ao Vivo',    value: jogos.filter(j => j.status === 'em_andamento').length, icon: Zap,          iconBg: 'bg-red-50',    iconColor: 'text-red-500'    },
          { label: 'Cancelados', value: jogos.filter(j => j.status === 'cancelado').length,    icon: Clock,        iconBg: 'bg-gray-100',  iconColor: 'text-gray-400'   },
        ]}
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={setSearch} placeholder="Buscar por time, local, campeonato..." size="full" />
        </div>
        <Select
          options={campeonatoOptions}
          value={campeonatoFiltro}
          onChange={setCampeonatoFiltro}
          placeholder="Todos os campeonatos"
          fullWidth={false}
          className="sm:w-56"
        />
        <StatusTabs
          tabs={STATUS_FILTROS}
          value={statusFiltro}
          onChange={setStatusFiltro}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">Carregando jogos...</div>
      )}

      {/* Vazio */}
      {!loading && filtrado.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <CalendarDays size={40} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Nenhum jogo encontrado</h3>
          <p className="text-sm text-gray-500 mb-4">
            {search ? `Nenhum resultado para "${search}"` : 'Comece gerando jogos automaticamente.'}
          </p>
          {canManage && !search && (
            <div className="flex gap-2 justify-center">
              <Button variant="outline" icon={Plus} onClick={() => setModalNovo(true)} className="hidden lg:flex">
                Novo Jogo
              </Button>
              <Button variant="primary" icon={Zap} onClick={() => setModalGerar(true)}>
                <span className="hidden lg:inline">Gerar Automático</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lista agrupada por Rodada → Data */}
      {!loading && filtrado.length > 0 && (
        <div className="space-y-10">
          {gruposFinais.map((grupoRodada, ri) => (
            <div key={grupoRodada.rodada ?? `sem-${ri}`}>

              {/* ── Título da Rodada (só quando tem número) ── */}
              {grupoRodada.rodada !== null && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold shrink-0">
                    <Flag size={13} />
                    {grupoRodada.label}
                  </div>
                  <div className="flex-1 h-px bg-emerald-100" />
                  <span className="text-xs text-gray-400 shrink-0">
                    {grupoRodada.grupos.reduce((acc, g) => acc + g.jogos.length, 0)} jogo
                    {grupoRodada.grupos.reduce((acc, g) => acc + g.jogos.length, 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* ── Sub-grupos por data ── */}
              <div className={`space-y-6 ${grupoRodada.rodada !== null ? 'pl-4 border-l-2 border-emerald-100' : ''}`}>
                {grupoRodada.grupos.map(grupoData => (
                  <div key={grupoData.dataLabel}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-semibold text-gray-600 capitalize">
                        {grupoData.dataLabel}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 shrink-0">
                        {grupoData.jogos.length} jogo{grupoData.jogos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grupoData.jogos.map(jogo => (
                        <JogoCard
                          key={jogo.id}
                          jogo={jogo}
                          canManage={canManage}
                          onFinalizar={j => { setJogoSelecionado(j); setModalFinalizar(true) }}
                          onEditar={j => { setJogoSelecionado(j); setModalNovo(true) }}
                          onCancelar={j => { setJogoSelecionado(j); setModalCancelar(true) }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <GerarJogosModal
        isOpen={modalGerar}
        onClose={() => setModalGerar(false)}
        onGerado={fetchJogos}
      />

      <FinalizarJogoModal
        isOpen={modalFinalizar}
        onClose={() => { setModalFinalizar(false); setJogoSelecionado(null) }}
        jogo={jogoSelecionado}
        onFinalizado={fetchJogos}
      />

      <NovoJogoModal
        isOpen={modalNovo}
        onClose={() => { setModalNovo(false); setJogoSelecionado(null) }}
        onSalvo={fetchJogos}
      />

      <ConfirmModal
        isOpen={modalCancelar}
        onClose={() => { setModalCancelar(false); setJogoSelecionado(null) }}
        onConfirm={handleCancelar}
        type="excluir"
        titulo="Cancelar jogo?"
        descricao={`${jogoSelecionado?.time_casa?.nome ?? ''} vs ${jogoSelecionado?.time_fora?.nome ?? ''} será marcado como cancelado.`}
        loading={actionLoading}
      />
    </AppShell>
  )
}