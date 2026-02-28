'use client'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { FilterIconButton } from '@/components/ui/FilterIconButton'
import ClassificacaoTable from '@/components/classificacao/ClassificacaoTable'
import { useCampeonatos } from '@/hooks/useCampeonatos'
import { useState, useMemo, useEffect } from 'react'
import { Trophy, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { CampeonatoFase } from '@/types/campeonato'
import { FASE_LABEL } from '@/types/campeonato'

export default function ClassificacaoPage() {
  const [search, setSearch]               = useState('')
  const [campeonatoId, setCampeonatoId]   = useState('')
  const [userRole, setUserRole]           = useState<string | null>(null)

  // Dados da fase atual do campeonato selecionado
  const [faseAtual, setFaseAtual]                     = useState<CampeonatoFase>('grupos')
  const [numeroClassificados, setNumeroClassificados] = useState(0)

  const { campeonatos, loading: loadingCamp, refetch: refetchCampeonatos } = useCampeonatos()

  // Carrega role do usuário
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setUserRole(profile?.role ?? null)
    })
  }, [])

  // Quando campeonato muda, carrega fase_atual e numero_classificados
  useEffect(() => {
    if (!campeonatoId) {
      setFaseAtual('grupos')
      setNumeroClassificados(0)
      return
    }
    const supabase = createClient()
    supabase
      .from('campeonatos')
      .select('fase_atual, numero_classificados')
      .eq('id', campeonatoId)
      .single()
      .then(({ data }) => {
        setFaseAtual((data?.fase_atual as CampeonatoFase) ?? 'grupos')
        setNumeroClassificados(data?.numero_classificados ?? 0)
      })
  }, [campeonatoId])

  const filterOptions = useMemo(() => [
    { label: 'Todos', value: '' },
    ...campeonatos.map(c => ({ label: c.nome, value: c.id })),
  ], [campeonatos])

  const campeonatoSelecionado = campeonatos.find(c => c.id === campeonatoId) ?? null
  const canManage = userRole === 'admin' || userRole === 'organizador'

  // Ao avançar de fase, recarrega dados do campeonato
  function handleFaseAvancou() {
    if (!campeonatoId) return
    const supabase = createClient()
    supabase
      .from('campeonatos')
      .select('fase_atual, numero_classificados')
      .eq('id', campeonatoId)
      .single()
      .then(({ data }) => {
        setFaseAtual((data?.fase_atual as CampeonatoFase) ?? 'grupos')
        setNumeroClassificados(data?.numero_classificados ?? 0)
      })
  }

  return (
    <AppShell>

      {/* Desktop: header */}
      <div className="hidden lg:block">
        <PageHeader
          title="Classificação"
          subtitle="Acompanhe a classificação dos campeonatos"
        />
      </div>

      {/* Mobile: título */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Classificação</h1>
        <p className="text-sm text-gray-500">Acompanhe a classificação dos campeonatos</p>
      </div>

      {/* Search + Filtro */}
      <div className="flex items-center justify-between gap-2 mb-8">
        <div className="flex-1 lg:hidden">
          <SearchBar className="text-gray-500" placeholder="Buscar time..." onSearch={setSearch} size="full" />
        </div>
        <div className="hidden lg:block">
          <SearchBar className="text-gray-500" placeholder="Buscar time..." onSearch={setSearch} size="lg" />
        </div>
        <div className="lg:hidden shrink-0">
          <FilterIconButton options={filterOptions} onSelect={setCampeonatoId} />
        </div>
        <div className="hidden lg:block shrink-0">
          <FilterDropdown
            options={filterOptions}
            onSelect={setCampeonatoId}
            placeholder={loadingCamp ? 'Carregando...' : 'Todos os campeonatos'}
          />
        </div>
      </div>

      {/* Estado vazio */}
      {!campeonatoId && (
        <div className="bg-white rounded-2xl ring-1 ring-black/5 flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
            <Trophy size={26} className="text-violet-400" />
          </div>
          <p className="text-base font-semibold text-slate-700">Selecione um campeonato</p>
          <p className="text-sm text-slate-400">Use o filtro acima para escolher um campeonato</p>
        </div>
      )}

      {/* Tabela */}
      {campeonatoId && (
        <div className="flex flex-col gap-4">

          {/* Info do campeonato */}
          {campeonatoSelecionado && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-violet-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {campeonatoSelecionado.nome}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{campeonatoSelecionado.organizador}</span>
              </div>

              {/* Badge da fase atual */}
              {faseAtual && faseAtual !== 'grupos' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-100 rounded-full">
                  <Flag size={11} className="text-violet-600" />
                  <span className="text-[11px] font-bold text-violet-700">
                    {FASE_LABEL[faseAtual]}
                  </span>
                </div>
              )}

              {/* Badge classificados */}
              {numeroClassificados > 0 && faseAtual === 'grupos' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                  <span className="text-[11px] font-medium text-gray-500">
                    Top {numeroClassificados} avançam
                  </span>
                </div>
              )}
            </div>
          )}

          <ClassificacaoTable
            campeonatoId={campeonatoId}
            search={search}
            faseAtual={faseAtual}
            numeroClassificados={numeroClassificados}
            canManage={canManage}
            onFaseAvancou={handleFaseAvancou}
          />
        </div>
      )}

    </AppShell>
  )
}