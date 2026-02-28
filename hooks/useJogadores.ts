// src/hooks/useJogadores.ts

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import type { Jogador, Time, JogadorInsert } from '@/types/jogadores'
import {
  fetchJogadores,
  fetchTimes,
  criarJogador,
  editarJogador,
  excluirJogador,
} from '@/services/jogadores.service'

export type { Jogador, Time }

const PAGE_SIZE = 20

export function useJogadores() {
  // ── Data ────────────────────────────────────────────────────
  const [jogadores,          setJogadores]          = useState<Jogador[]>([])
  const [times,              setTimes]              = useState<Time[]>([])
  const [timeSelecionado,    setTimeSelecionado]    = useState<string>('')

  // ── Auth ────────────────────────────────────────────────────
  const [userRole,           setUserRole]           = useState<string | null>(null)
  const [userId,             setUserId]             = useState<string | null>(null)

  // ── UI state ────────────────────────────────────────────────
  const [loading,            setLoading]            = useState(true)
  const [actionLoading,      setActionLoading]      = useState(false)
  const [search,             setSearch]             = useState('')
  const [page,               setPage]               = useState(1)
  const [posicaoFiltro,      setPosicaoFiltro]      = useState('all')

  // ── Modals ───────────────────────────────────────────────────
  const [modalCriarOpen,     setModalCriarOpen]     = useState(false)
  const [modalEditarOpen,    setModalEditarOpen]    = useState(false)
  const [modalExcluirOpen,   setModalExcluirOpen]   = useState(false)
  const [jogadorSelecionado, setJogadorSelecionado] = useState<Jogador | null>(null)

  // ── Init ─────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role ?? null
      setUserRole(role)

      if (role) {
        setLoading(true)
        fetchJogadores(role, user.id).then(data => {
          setJogadores(data)
          setLoading(false)
        })
      }
    })

    fetchTimes().then(data => {
      setTimes(data)
      if (data.length > 0) setTimeSelecionado(data[0].id)
    })
  }, [])

  // ── Recarrega lista ──────────────────────────────────────────
  async function recarregar(role: string, uid: string) {
    setLoading(true)
    const data = await fetchJogadores(role, uid)
    setJogadores(data)
    setLoading(false)
  }

  // ── Filtro + paginação ───────────────────────────────────────
  const filtrado = useMemo(() => {
    let lista = jogadores
    if (posicaoFiltro !== 'all') lista = lista.filter(j => j.posicao === posicaoFiltro)
    if (search) {
      const q = search.toLowerCase()
      lista = lista.filter(j =>
        j.nome.toLowerCase().includes(q) ||
        j.time?.nome?.toLowerCase().includes(q) ||
        j.posicao?.toLowerCase().includes(q),
      )
    }
    return lista
  }, [jogadores, search, posicaoFiltro])

  const totalPages = Math.ceil(filtrado.length / PAGE_SIZE)
  const paginado   = filtrado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, posicaoFiltro])

  // ── Handlers CRUD ────────────────────────────────────────────
  async function handleCriar(data: JogadorInsert) {
    setActionLoading(true)
    try {
      await criarJogador(data)
      setModalCriarOpen(false)
      if (userRole && userId) await recarregar(userRole, userId)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleEditar(data: JogadorInsert) {
    if (!jogadorSelecionado) return
    setActionLoading(true)
    try {
      const { count } = await editarJogador(jogadorSelecionado.id, data)

      if (count === 0) {
        console.error('[EDITAR] PROBLEMA: Update executou mas 0 linhas foram alteradas! Provável bloqueio de RLS.')
        alert('Erro: sem permissão para editar. Verifique as políticas RLS no Supabase.')
        return
      }

      console.log('[EDITAR] Update OK! Linhas alteradas:', count)

      setModalEditarOpen(false)
      setJogadorSelecionado(null)

      // Atualiza localmente sem precisar de novo fetch (evita RLS no select)
      setJogadores(prev =>
        prev.map(j => j.id === jogadorSelecionado.id ? { ...j, ...data } : j),
      )
    } catch (err) {
      console.error('[EDITAR] Erro geral:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleExcluir() {
    if (!jogadorSelecionado) return
    setActionLoading(true)
    try {
      await excluirJogador(jogadorSelecionado.id)
      setModalExcluirOpen(false)
      setJogadorSelecionado(null)
      if (userRole && userId) await recarregar(userRole, userId)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  return {
    // data
    jogadores,
    times,
    timeSelecionado,
    // auth
    userRole,
    // ui
    loading,
    actionLoading,
    search,        setSearch,
    page,          setPage,
    posicaoFiltro, setPosicaoFiltro,
    // filtro + paginação
    filtrado,
    paginado,
    totalPages,
    PAGE_SIZE,
    // modals
    modalCriarOpen,   setModalCriarOpen,
    modalEditarOpen,  setModalEditarOpen,
    modalExcluirOpen, setModalExcluirOpen,
    jogadorSelecionado, setJogadorSelecionado,
    // handlers
    handleCriar,
    handleEditar,
    handleExcluir,
  }
}