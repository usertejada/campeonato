// src/app/historico/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { CardHistorico } from '@/components/historico/CardHistorico'
import { useHistorico } from '@/hooks/useHistorico'
import { createClient } from '@/lib/supabase'
import { History, X, Filter } from 'lucide-react'

// ── Page ──────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [campeonatos,  setCampeonatos]  = useState<{ id: string; nome: string }[]>([])
  const [filtersOpen,  setFiltersOpen]  = useState(false)
  const [search,       setSearch]       = useState('')
  const [campeonatoId, setCampeonatoId] = useState('')
  const [dataInicio,   setDataInicio]   = useState('')
  const [dataFim,      setDataFim]      = useState('')

  const { jogos, loading, error } = useHistorico({
    search,
    campeonatoId,
    dataInicio,
    dataFim,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('campeonatos')
      .select('id, nome')
      .order('nome')
      .then(({ data }) => setCampeonatos(data ?? []))
  }, [])

  const hasActiveFilters = !!campeonatoId || !!dataInicio || !!dataFim

  function clearFilters() {
    setCampeonatoId('')
    setDataInicio('')
    setDataFim('')
    setSearch('')
  }

  const campeonatoOptions = [
    { value: '', label: 'Todos os campeonatos' },
    ...campeonatos.map(c => ({ value: c.id, label: c.nome })),
  ]

  return (
    <AppShell>

      {/* Header desktop */}
      <div className="hidden lg:block">
        <PageHeader
          title="Histórico de Jogos"
          subtitle="Todos os jogos finalizados do sistema"
        />
      </div>

      {/* Header mobile */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Histórico</h1>
        <p className="text-sm text-gray-500">Jogos finalizados</p>
      </div>

      {/* Busca + filtros */}
      <div className="flex items-center gap-2 mb-6">

        {/* Search mobile */}
        <div className="flex-1 lg:hidden">
          <SearchBar placeholder="Buscar por time..." onSearch={setSearch} size="full" />
        </div>

        {/* Search desktop */}
        <div className="hidden lg:block">
          <SearchBar placeholder="Buscar por time..." onSearch={setSearch} size="lg" />
        </div>

        {/* Filtros desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Select
            options={campeonatoOptions}
            value={campeonatoId}
            onChange={setCampeonatoId}
            placeholder="Todos os campeonatos"
            fullWidth={false}
            className="w-52"
          />
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">De:</label>
            <div className="w-44">
              <DateRangePicker
                singleDate
                singleDateTitle="Data de início"
                startDate={dataInicio}
                endDate=""
                onStartChange={setDataInicio}
                onEndChange={() => {}}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">Até:</label>
            <div className="w-44">
              <DateRangePicker
                singleDate
                singleDateTitle="Data de término"
                startDate={dataFim}
                endDate=""
                onStartChange={setDataFim}
                onEndChange={() => {}}
              />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors whitespace-nowrap"
            >
              <X size={14} /> Limpar
            </button>
          )}
        </div>

        {/* Botão filtros mobile */}
        <div className="lg:hidden shrink-0">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors relative ${
              hasActiveFilters
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
            }`}
          >
            <Filter size={18} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Filtros mobile colapsáveis */}
      {filtersOpen && (
        <div className="lg:hidden bg-white border border-gray-100 rounded-2xl p-4 mb-4 space-y-3 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtros</p>

          <Select
            options={campeonatoOptions}
            value={campeonatoId}
            onChange={setCampeonatoId}
            placeholder="Todos os campeonatos"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1 block">De:</label>
              <DateRangePicker
                singleDate
                singleDateTitle="Data de início"
                startDate={dataInicio}
                endDate=""
                onStartChange={setDataInicio}
                onEndChange={() => {}}
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1 block">Até:</label>
              <DateRangePicker
                singleDate
                singleDateTitle="Data de término"
                startDate={dataFim}
                endDate=""
                onStartChange={setDataFim}
                onEndChange={() => {}}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { clearFilters(); setFiltersOpen(false) }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Contador */}
      {!loading && !error && (
        <p className="text-xs text-gray-400 mb-4 font-medium">
          {jogos.length} {jogos.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400 text-sm">Carregando histórico...</div>
      )}

      {/* Erro */}
      {error && (
        <div className="text-center py-16 text-red-500 text-sm">Erro: {error}</div>
      )}

      {/* Vazio */}
      {!loading && !error && jogos.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {hasActiveFilters || search ? 'Nenhum resultado encontrado' : 'Nenhum jogo finalizado'}
          </h3>
          <p className="text-sm text-gray-400">
            {hasActiveFilters || search
              ? 'Tente ajustar os filtros de busca.'
              : 'Os jogos finalizados aparecerão aqui.'}
          </p>
          {(hasActiveFilters || search) && (
            <button onClick={clearFilters} className="mt-4 text-sm text-blue-600 hover:underline font-medium">
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Lista */}
      {!loading && !error && jogos.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {jogos.map(jogo => (
            <CardHistorico key={jogo.id} jogo={jogo} />
          ))}
        </div>
      )}

    </AppShell>
  )
}