// src/pages/parametros/index.tsx

import React, { useState } from 'react';
import { Layout } from '@/components/organisms/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/molecules/PageHeader';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { GameCalendar } from '@/components/molecules/GameCalendar';
import { ModalMensagem } from '@/components/modals/ModalMensagem';
import { useParametrosJogos } from '@/hooks/entities/useParametrosJogos';
import { useChampionships } from '@/hooks/entities/useChampionships';
import { useConfiguracaoLocal } from '@/hooks/jogos/useConfiguracaoLocal';
import type { ConfiguracaoPartidas } from '@/types/parametros-jogos.types';

// Componentes extraídos
import { ConfiguracaoStatus } from '@/components/jogos/ConfiguracaoStatus';
import { CampeonatoCard } from '@/components/jogos/CampeonatoCard';
import { TempoJogoCard } from '@/components/jogos/TempoJogoCard';
import { LocaisCard } from '@/components/jogos/LocaisCard';
import { DatasJogosCard } from '@/components/jogos/DatasJogosCard';
import { ConfiguracaoPartidasCard } from '@/components/jogos/ConfiguracaoPartidasCard';

function ParametrosJogosContent() {
  // ========== HOOKS ==========
  const {
    parametros,
    parametrosCompletos,
    temposJogoPreset,
    calcularHorariosPartidas,
    selecionarCampeonato,
    removerCampeonato,
    adicionarLocal,
    removerLocal,
    editarLocal,
    selecionarTempoJogo,
    configurarPartidas,
    toggleDataSelecionada,
  } = useParametrosJogos();

  const { championships } = useChampionships();

  const {
    novoLocal,
    setNovoLocal,
    editandoLocalId,
    nomeEditando,
    setNomeEditando,
    iniciarEdicao,
    cancelarEdicao,
    limparNovoLocal,
  } = useConfiguracaoLocal();

  // ========== ESTADOS LOCAIS ==========
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [modalCalendarioAberto, setModalCalendarioAberto] = useState(false);

  // Estados para configuração de partidas
  const [horarioInicio, setHorarioInicio] = useState(
    parametros.configuracaoPartidas?.horarioInicio || ''
  );
  const [numeroPartidas, setNumeroPartidas] = useState(
    parametros.configuracaoPartidas?.numeroPartidas || 0
  );
  const [intervaloEntreJogos, setIntervaloEntreJogos] = useState(
    parametros.configuracaoPartidas?.intervaloEntreJogos || 0
  );

  // ========== HANDLERS ==========
  const handleSelecionarCampeonato = (championshipId: string) => {
    const championship = championships.find((c) => c.id === championshipId);
    if (championship) {
      selecionarCampeonato({
        id: championship.id,
        nome: championship.name,
        formato: championship.format,
        dataInicio: championship.startDate,
        dataFim: championship.endDate,
      });
    }
  };

  const handleAdicionarLocal = () => {
    if (novoLocal.trim()) {
      adicionarLocal(novoLocal);
      limparNovoLocal();
    }
  };

  const handleSalvarEdicao = () => {
    if (editandoLocalId && nomeEditando.trim()) {
      editarLocal(editandoLocalId, nomeEditando);
      cancelarEdicao();
    }
  };

  const handleSalvarConfiguracao = () => {
    if (horarioInicio && numeroPartidas > 0 && parametros.tempoJogo) {
      const config: ConfiguracaoPartidas = {
        horarioInicio,
        numeroPartidas,
        intervaloEntreJogos,
      };
      configurarPartidas(config);
      setMensagemSucesso('Configuração salva com sucesso!');
    }
  };

  // ========== VARIÁVEIS COMPUTADAS ==========
  const campeonatosAtivos = championships.filter(
    (c) => c.status === 'Em Andamento' || c.status === 'Agendado'
  );

  const isConfiguracaoCompleta = parametrosCompletos();
  const horariosCalculados = calcularHorariosPartidas();

  const temDatasParaCalendario =
    parametros.campeonato &&
    parametros.campeonato.dataInicio &&
    parametros.campeonato.dataFim;

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <PageHeader
          title="Parâmetros dos Jogos"
          subtitle="Configure os parâmetros para geração automática de jogos"
          titleClassName="text-blue-600"
        />
        <ConfiguracaoStatus isCompleto={isConfiguracaoCompleta} />
      </div>

      {/* Grid Principal - 2 COLUNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUNA 1: CAMPEONATO + TEMPO DE JOGO */}
        <div className="space-y-6">
          <CampeonatoCard
            campeonatoSelecionado={parametros.campeonato}
            campeonatosDisponiveis={campeonatosAtivos}
            onSelecionar={handleSelecionarCampeonato}
            onRemover={removerCampeonato}
          />

          <TempoJogoCard
            tempoSelecionado={parametros.tempoJogo}
            temposDisponiveis={temposJogoPreset}
            onSelecionar={selecionarTempoJogo}
          />
        </div>

        {/* COLUNA 2: LOCAIS + DATAS */}
        <div className="space-y-6">
          <LocaisCard
            locais={parametros.locais}
            novoLocal={novoLocal}
            editandoLocalId={editandoLocalId}
            nomeEditando={nomeEditando}
            onNovoLocalChange={setNovoLocal}
            onAdicionarLocal={handleAdicionarLocal}
            onIniciarEdicao={iniciarEdicao}
            onSalvarEdicao={handleSalvarEdicao}
            onCancelarEdicao={cancelarEdicao}
            onNomeEditandoChange={setNomeEditando}
            onRemoverLocal={removerLocal}
          />

          <DatasJogosCard
            datasSelecionadas={parametros.datasSelecionadas || []}
            temDatasParaCalendario={!!temDatasParaCalendario}
            onAbrirCalendario={() => setModalCalendarioAberto(true)}
            onRemoverData={toggleDataSelecionada}
          />
        </div>
      </div>

      {/* CONFIGURAÇÃO DE PARTIDAS (FULL WIDTH) */}
      <ConfiguracaoPartidasCard
        horarioInicio={horarioInicio}
        numeroPartidas={numeroPartidas}
        intervaloEntreJogos={intervaloEntreJogos}
        horariosCalculados={horariosCalculados}
        temTempoJogo={!!parametros.tempoJogo}
        onHorarioInicioChange={setHorarioInicio}
        onNumeroPartidasChange={setNumeroPartidas}
        onIntervaloEntreJogosChange={setIntervaloEntreJogos}
        onSalvar={handleSalvarConfiguracao}
      />

      {/* MODAL DO CALENDÁRIO */}
      {modalCalendarioAberto && temDatasParaCalendario && (
        <Modal
          isOpen={modalCalendarioAberto}
          onClose={() => setModalCalendarioAberto(false)}
          title="📅 Selecionar Datas dos Jogos"
          size="2xl"
        >
          <GameCalendar
            startDate={parametros.campeonato!.dataInicio!}
            endDate={parametros.campeonato!.dataFim!}
            selectedDates={parametros.datasSelecionadas || []}
            onDateToggle={toggleDataSelecionada}
          />

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalCalendarioAberto(false)}
            >
              Concluir
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL DE MENSAGEM */}
      {mensagemSucesso && (
        <ModalMensagem
          isOpen={true}
          onClose={() => setMensagemSucesso(null)}
          tipo="sucesso"
          mensagem={mensagemSucesso}
        />
      )}
    </div>
  );
}

export default function ParametrosJogosPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <ParametrosJogosContent />
      </Layout>
    </AuthProvider>
  );
}