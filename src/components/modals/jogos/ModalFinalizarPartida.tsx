// src/components/modals/jogos/ModalFinalizarPartida.tsx

import React from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { AlertMessage } from '@/components/molecules/AlertMessage';
import { CheckCircle } from 'lucide-react';
import { HeaderTimes } from '@/components/historico/HeaderTimes';
import { SecaoPlacar } from '@/components/historico/SecaoPlacar';
import { ListaGols } from '@/components/historico/ListaGols';
import { SecaoCartoes } from '@/components/historico/SecaoCartoes';
import { CampoRelatorio } from '@/components/historico/CampoRelatorio';
import { useFinalizarPartida } from '@/hooks/historico/useFinalizarPartida';
import type { Jogo, FinalizarJogoData } from '@/types/jogo.types';

interface ModalFinalizarPartidaProps {
  isOpen: boolean;
  onClose: () => void;
  jogo: Jogo | null;
  onFinalizar: (jogoId: string, dados: FinalizarJogoData) => void;
}

export function ModalFinalizarPartida({
  isOpen,
  onClose,
  jogo,
  onFinalizar,
}: ModalFinalizarPartidaProps) {
  const {
    placarCasa,
    placarVisitante,
    golsCasa,
    golsVisitante,
    cartoes,
    relatorioArbitro,
    erro,
    jogadoresTimeCasa,
    jogadoresTimeVisitante,
    setPlacarCasa,
    setPlacarVisitante,
    setRelatorioArbitro,
    setErro,
    atualizarGolCasa,
    atualizarGolVisitante,
    adicionarCartao,
    atualizarCartao,
    removerCartao,
    validarDados,
  } = useFinalizarPartida(isOpen, jogo);

  const handleFinalizar = () => {
    if (!jogo) return;

    const erroValidacao = validarDados();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const dados: FinalizarJogoData = {
      placarCasa,
      placarVisitante,
      golsCasa,
      golsVisitante,
      cartoes,
      relatorioArbitro,
    };

    onFinalizar(jogo.id, dados);
    onClose();
  };

  if (!jogo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalizar Partida"
      size="2xl"
    >
      <div className="space-y-6">
        
        {/* Header com os times */}
        <HeaderTimes jogo={jogo} />

        {/* Placar */}
        <SecaoPlacar
          jogo={jogo}
          placarCasa={placarCasa}
          placarVisitante={placarVisitante}
          onPlacarCasaChange={setPlacarCasa}
          onPlacarVisitanteChange={setPlacarVisitante}
        />

        {/* Gols do Time Casa */}
        <ListaGols
          titulo={`Gols de ${jogo.timeCasa.nome}`}
          gols={golsCasa}
          jogadores={jogadoresTimeCasa}
          onAtualizarGol={atualizarGolCasa}
        />

        {/* Gols do Time Visitante */}
        <ListaGols
          titulo={`Gols de ${jogo.timeVisitante.nome}`}
          gols={golsVisitante}
          jogadores={jogadoresTimeVisitante}
          onAtualizarGol={atualizarGolVisitante}
        />

        {/* Cartões */}
        <SecaoCartoes
          jogo={jogo}
          cartoes={cartoes}
          jogadoresTimeCasa={jogadoresTimeCasa}
          jogadoresTimeVisitante={jogadoresTimeVisitante}
          onAdicionarCartao={adicionarCartao}
          onAtualizarCartao={atualizarCartao}
          onRemoverCartao={removerCartao}
        />

        {/* Relatório */}
        <CampoRelatorio
          valor={relatorioArbitro}
          onChange={setRelatorioArbitro}
        />

        {/* Mensagem de Erro */}
        {erro && (
          <AlertMessage
            type="error"
            title="Atenção"
            message={erro}
            onClose={() => setErro('')}
          />
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="cancel"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={CheckCircle}
            onClick={handleFinalizar}
          >
            Finalizar Partida
          </Button>
        </div>
      </div>
    </Modal>
  );
}