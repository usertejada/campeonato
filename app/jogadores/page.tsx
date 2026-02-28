// src/app/jogadores/page.tsx
'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { Users, Plus } from 'lucide-react'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { FilterIconButton } from '@/components/ui/FilterIconButton'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { JogadorFormModal } from '@/components/jogadores/JogadorFormModal'
import { JogadorDetailsModal } from '@/components/jogadores/JogadorDetailsModal'
import { useJogadores } from '@/hooks/useJogadores'
import { JogadoresTable } from '@/components/jogadores/JogadorTable'
import type { Jogador } from '@/types/jogadores'

// ── Constants ─────────────────────────────────────────────────

const filterOptions = [
  { label: 'Todos',    value: 'all'      },
  { label: 'Goleiro',  value: 'Goleiro'  },
  { label: 'Zagueiro', value: 'Zagueiro' },
  { label: 'Lateral',  value: 'Lateral'  },
  { label: 'Volante',  value: 'Volante'  },
  { label: 'Meia',     value: 'Meia'     },
  { label: 'Atacante', value: 'Atacante' },
]

// ── Page ──────────────────────────────────────────────────────

export default function JogadoresPage() {
  const {
    jogadores,
    times,
    timeSelecionado,
    userRole,
    loading,
    actionLoading,
    search,        setSearch,
    page,          setPage,
    posicaoFiltro, setPosicaoFiltro,
    filtrado,
    paginado,
    totalPages,
    PAGE_SIZE,
    modalCriarOpen,   setModalCriarOpen,
    modalEditarOpen,  setModalEditarOpen,
    modalExcluirOpen, setModalExcluirOpen,
    jogadorSelecionado, setJogadorSelecionado,
    handleCriar,
    handleEditar,
    handleExcluir,
  } = useJogadores()

  const isTecnico = userRole === 'tecnico'

  // ── Estado do modal de detalhes ──
  const [jogadorDetalhe, setJogadorDetalhe] = useState<Jogador | null>(null)

  return (
    <AppShell onAdd={() => setModalCriarOpen(true)}>
      {/* Header desktop */}
      <div className="hidden lg:block">
        <PageHeader
          title="Jogadores"
          subtitle={`${jogadores.length} jogadores cadastrados`}
          action={
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)}>
              Novo Jogador
            </Button>
          }
        />
      </div>

      {/* Header mobile */}
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900">Jogadores</h1>
        <p className="text-sm text-gray-500">{jogadores.length} cadastrados</p>
      </div>

      {/* Busca + Filtro */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex-1 lg:hidden">
          <SearchBar placeholder="Buscar jogadores..." onSearch={setSearch} size="full" />
        </div>
        <div className="hidden lg:block">
          <SearchBar placeholder="Buscar por nome, time ou posição..." onSearch={setSearch} size="lg" />
        </div>
        <div className="lg:hidden shrink-0">
          <FilterIconButton options={filterOptions} onSelect={setPosicaoFiltro} />
        </div>
        <div className="hidden lg:block shrink-0">
          <FilterDropdown options={filterOptions} onSelect={setPosicaoFiltro} placeholder="Todos" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Carregando jogadores...</div>
      )}

      {/* Vazio */}
      {!loading && filtrado.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {search ? 'Nenhum resultado' : 'Nenhum jogador cadastrado'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {search
              ? `Nenhum jogador encontrado para "${search}"`
              : 'Comece adicionando o primeiro jogador.'}
          </p>
          {!search && (
            <Button variant="primary" icon={Plus} onClick={() => setModalCriarOpen(true)} className="hidden lg:flex">
              Novo Jogador
            </Button>
          )}
        </div>
      )}

      {/* Tabela */}
      {!loading && paginado.length > 0 && (
        <JogadoresTable
          paginado={paginado}
          filtrado={filtrado}
          isTecnico={isTecnico}
          page={page}
          totalPages={totalPages}
          PAGE_SIZE={PAGE_SIZE}
          onAdicionar={() => setModalCriarOpen(true)}
          onDetalhes={jogador => setJogadorDetalhe(jogador)}
          onEditar={jogador => { setJogadorSelecionado(jogador); setModalEditarOpen(true) }}
          onExcluir={jogador => { setJogadorSelecionado(jogador); setModalExcluirOpen(true) }}
          onTransferir={jogador => console.log('transferir', jogador.id)}
          onPageChange={setPage}
        />
      )}

      {/* Modal Detalhes */}
      {jogadorDetalhe && (
        <JogadorDetailsModal
          jogador={jogadorDetalhe}
          isOpen={!!jogadorDetalhe}
          onClose={() => setJogadorDetalhe(null)}
        />
      )}

      {/* Modal Criar */}
      <JogadorFormModal
        isOpen={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSubmit={handleCriar}
        timeId={timeSelecionado}
        times={times}
        titulo="Novo Jogador"
      />

      {/* Modal Editar */}
      <JogadorFormModal
        isOpen={modalEditarOpen}
        onClose={() => { setModalEditarOpen(false); setJogadorSelecionado(null) }}
        onSubmit={handleEditar}
        timeId={jogadorSelecionado?.time_id ?? timeSelecionado}
        times={times}
        inicial={jogadorSelecionado ? {
          nome:            jogadorSelecionado.nome,
          foto_url:        jogadorSelecionado.foto_url,
          foto_documento:  jogadorSelecionado.foto_documento,
          posicao:         jogadorSelecionado.posicao         ?? '',
          numero_camisa:   jogadorSelecionado.numero_camisa   ?? undefined,
          data_nascimento: jogadorSelecionado.data_nascimento ?? '',
          nacionalidade:   jogadorSelecionado.nacionalidade   ?? 'BR',
          telefone:        jogadorSelecionado.telefone        ?? '',
          doc_tipo:        jogadorSelecionado.doc_tipo        ?? 'cpf',
          doc_numero:      jogadorSelecionado.doc_numero      ?? '',
        } : undefined}
        titulo="Editar Jogador"
      />

      {/* Modal Excluir */}
      <ConfirmModal
        isOpen={modalExcluirOpen}
        onClose={() => { setModalExcluirOpen(false); setJogadorSelecionado(null) }}
        onConfirm={handleExcluir}
        type="excluir"
        titulo={`Excluir "${jogadorSelecionado?.nome}"?`}
        descricao="Essa ação é permanente e não pode ser desfeita."
        loading={actionLoading}
      />
    </AppShell>
  )
}