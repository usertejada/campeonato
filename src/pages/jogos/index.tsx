// src/pages/jogos/index.tsx

import React from 'react';
import { Plus, Zap, Calendar, Image, Settings, Trophy } from 'lucide-react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/organisms/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { Button } from '@/components/molecules/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { FilterBar } from '@/components/organisms/FilterBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { AlertMessage } from '@/components/molecules/AlertMessage';
import { InfoCard } from '@/components/molecules/InfoCard';
import { ModalAvisoParametros } from '@/components/modals/jogos/ModalAvisoParametros';
import { ModalFinalizarPartida } from '@/components/modals/jogos/ModalFinalizarPartida';
import { JogosCard } from '@/components/cards/JogosCard';
import { RodadaHeader } from '@/components/jogos/RodadaHeader';
import { useJogos } from '@/hooks/entities/useJogos';
import { useParametrosJogos } from '@/hooks/entities/useParametrosJogos';
import { useTeams } from '@/hooks/entities/useTeams';
import { formatRodadaDate, getRodadaLabel } from '@/utils/common/date.utils';
import type { Jogo } from '@/types/jogo.types';

function JogosContent() {
  const router = useRouter();
  
  const {
    filteredJogos,
    searchTerm,
    statusFilter,
    statusOptions,
    setSearchTerm,
    setStatusFilter,
    handleGerarAutomatico,
    handleAdicionarManual,
    handleFinalizarJogo,
  } = useJogos();

  const { parametros, parametrosCompletos } = useParametrosJogos();
  const { teams } = useTeams();

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [isAvisoModalOpen, setIsAvisoModalOpen] = React.useState(false);
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = React.useState(false);
  const [jogoSelecionado, setJogoSelecionado] = React.useState<Jogo | null>(null);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [mensagemGeracao, setMensagemGeracao] = React.useState<{
    tipo: 'sucesso' | 'erro';
    texto: string;
  } | null>(null);

  // Filtra apenas jogos NÃO finalizados para esta página
  const jogosAtivos = React.useMemo(() => {
    return filteredJogos.filter(jogo => jogo.status !== 'finalizado');
  }, [filteredJogos]);

  // Pega os primeiros 9 jogos para o banner
  const jogosBanner = jogosAtivos.slice(0, 9);

  // Agrupa jogos por data para exibir em rodadas
  const jogosPorRodada = React.useMemo(() => {
    const grupos: Record<string, typeof jogosAtivos> = {};
    
    jogosAtivos.forEach((jogo) => {
      if (!grupos[jogo.data]) {
        grupos[jogo.data] = [];
      }
      grupos[jogo.data].push(jogo);
    });

    // Converte para array e ordena por data
    return Object.entries(grupos)
      .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
      .map(([data, jogos]) => ({
        data,
        jogos: jogos.sort((a, b) => a.horario.localeCompare(b.horario)),
      }));
  }, [jogosAtivos]);

  // Verifica se os parâmetros estão completos
  const parametrosOk = parametrosCompletos();

  // Handler para o botão Gerar
  const handleClickGerar = () => {
    if (!parametrosOk) {
      setIsAvisoModalOpen(true);
      return;
    }

    const resultado = handleGerarAutomatico(teams, parametros);
    setMensagemGeracao({
      tipo: resultado.sucesso ? 'sucesso' : 'erro',
      texto: resultado.mensagem,
    });
  };

  // Handler para o botão Adicionar
  const handleClickAdicionar = () => {
    if (!parametrosOk) {
      setIsAvisoModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  // Handler para o botão Banner
  const handleClickBanner = () => {
    setIsPreviewModalOpen(true);
  };

  // Handler para finalizar jogo
  const handleClickFinalizarJogo = (jogo: Jogo) => {
    setJogoSelecionado(jogo);
    setIsFinalizarModalOpen(true);
  };

  // Handler para adiar jogo
  const handleAdiarJogo = (jogoId: string) => {
    console.log('Adiar jogo:', jogoId);
    // TODO: Implementar modal de adiamento
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Jogos"
        subtitle="Gerencie e acompanhe todos os jogos"
        titleClassName="text-blue-600"
        action={
          <div className="flex gap-3">
            <Button
              className="gap-1"
              variant={parametrosOk ? 'outline' : 'primary'}
              size="md"
              leftIcon={Settings}
              onClick={() => router.push('/parametros')}
              mobileIconOnly
            >
              Parâmetros
            </Button>

            <Button
              className="gap-1"
              variant="outline"
              size="md"
              leftIcon={Zap}
              onClick={handleClickGerar}
              mobileIconOnly
              disabled={!parametrosOk}
            >
              Gerar
            </Button>

            <Button
              className="gap-1"
              variant="outline"
              size="md"
              leftIcon={Plus}
              onClick={handleClickAdicionar}
              mobileIconOnly
              disabled={!parametrosOk}
            >
              Adicionar
            </Button>

            {jogosBanner.length > 0 && (
              <Button
                className="gap-1"
                variant="primary"
                size="md"
                leftIcon={Image}
                onClick={handleClickBanner}
                mobileIconOnly
              >
                Banner ({jogosBanner.length})
              </Button>
            )}
          </div>
        }
      />

      {/* Mensagem de resultado da geração */}
      {mensagemGeracao && (
        <AlertMessage
          type={mensagemGeracao.tipo === 'sucesso' ? 'success' : 'error'}
          title={mensagemGeracao.tipo === 'sucesso' ? 'Sucesso!' : 'Erro'}
          message={mensagemGeracao.texto}
          onClose={() => setMensagemGeracao(null)}
        />
      )}

      {/* Aviso sobre parâmetros não configurados */}
      {!parametrosOk && (
        <AlertMessage
          type="warning"
          title="Configure os Parâmetros"
          message="Configure os parâmetros dos jogos para habilitar a geração automática e outras funcionalidades."
          actionLabel="Configurar Agora"
          onAction={() => router.push('/parametros')}
        />
      )}

      {/* Info do Campeonato Selecionado */}
      {parametrosOk && parametros.campeonato && (
        <InfoCard
          icon={Trophy}
          title={parametros.campeonato.nome}
          description={`Formato: ${parametros.campeonato.formato}`}
          variant="blue"
        />
      )}

      {/* Filtros e Busca */}
      <FilterBar
        className="text-gray-500"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar jogos, times, estádios..."
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            label: 'Status',
          },
        ]}
      />

      {/* Lista de Jogos ou Empty State */}
      {jogosAtivos.length > 0 ? (
        <div className="space-y-8">
          {jogosPorRodada.map((rodada, index) => {
            const primeiroJogo = rodada.jogos[0];
            
            return (
              <div key={rodada.data}>
                {/* Header da Rodada */}
                <RodadaHeader
                  titulo={getRodadaLabel(index + 1)}
                  data={formatRodadaDate(rodada.data)}
                  local={primeiroJogo.estadio}
                  horario={`A partir das ${primeiroJogo.horario}`}
                  className="mb-4"
                />

                {/* Grid de Jogos da Rodada */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rodada.jogos.map((jogo) => (
                    <JogosCard
                      key={jogo.id}
                      jogo={jogo}
                      activeDropdown={activeDropdown}
                      onToggleDropdown={setActiveDropdown}
                      onFinalizarJogo={() => handleClickFinalizarJogo(jogo)}
                      onAdiarJogo={handleAdiarJogo}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={searchTerm ? 'Nenhum jogo encontrado' : 'Nenhum jogo disponível'}
          description={
            searchTerm
              ? 'Tente buscar por outro time ou estádio'
              : parametrosOk
              ? 'Comece gerando jogos automaticamente ou adicione manualmente'
              : 'Configure os parâmetros dos jogos para começar'
          }
          actionLabel={parametrosOk ? 'Gerar Jogos Automático' : 'Configurar Parâmetros'}
          actionIcon={parametrosOk ? Zap : Settings}
          onAction={parametrosOk ? handleClickGerar : () => router.push('/parametros')}
        />
      )}

      {/* Modal de Aviso */}
      <ModalAvisoParametros
        isOpen={isAvisoModalOpen}
        onClose={() => setIsAvisoModalOpen(false)}
      />

      {/* Modal de Finalizar Partida */}
      <ModalFinalizarPartida
        isOpen={isFinalizarModalOpen}
        onClose={() => {
          setIsFinalizarModalOpen(false);
          setJogoSelecionado(null);
        }}
        jogo={jogoSelecionado}
        onFinalizar={handleFinalizarJogo}
      />
    </div>
  );
}

export default function JogosPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <JogosContent />
      </Layout>
    </AuthProvider>
  );
}