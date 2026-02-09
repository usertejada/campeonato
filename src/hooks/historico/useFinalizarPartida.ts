// src/hooks/historico/useFinalizarPartida.ts

import { useState, useEffect, useMemo } from 'react';
import { playerService } from '@/services/playerService';
import type { Gol, Cartao, Jogo } from '@/types/jogo.types';
import type { Player } from '@/types/player.types';

export function useFinalizarPartida(isOpen: boolean, jogo: Jogo | null) {
  const [placarCasa, setPlacarCasa] = useState<number>(0);
  const [placarVisitante, setPlacarVisitante] = useState<number>(0);
  const [golsCasa, setGolsCasa] = useState<Gol[]>([]);
  const [golsVisitante, setGolsVisitante] = useState<Gol[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [relatorioArbitro, setRelatorioArbitro] = useState('');
  const [erro, setErro] = useState('');

  // Busca jogadores dos times
  const jogadoresTimeCasa = useMemo(() => {
    if (!jogo) return [];
    const todosJogadores = playerService.getAll();
    return todosJogadores.filter(
      (player) => player.teamName === jogo.timeCasa.nome && player.isActive
    );
  }, [jogo]);

  const jogadoresTimeVisitante = useMemo(() => {
    if (!jogo) return [];
    const todosJogadores = playerService.getAll();
    return todosJogadores.filter(
      (player) => player.teamName === jogo.timeVisitante.nome && player.isActive
    );
  }, [jogo]);

  // Reseta o formulário quando o modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setPlacarCasa(0);
      setPlacarVisitante(0);
      setGolsCasa([]);
      setGolsVisitante([]);
      setCartoes([]);
      setRelatorioArbitro('');
      setErro('');
    }
  }, [isOpen]);

  // Atualiza gols do time casa baseado no placar
  useEffect(() => {
    if (placarCasa > golsCasa.length) {
      const novosGols = Array(placarCasa - golsCasa.length)
        .fill(null)
        .map(() => ({ jogador: '', minuto: undefined }));
      setGolsCasa([...golsCasa, ...novosGols]);
    } else if (placarCasa < golsCasa.length) {
      setGolsCasa(golsCasa.slice(0, placarCasa));
    }
  }, [placarCasa]);

  // Atualiza gols do time visitante baseado no placar
  useEffect(() => {
    if (placarVisitante > golsVisitante.length) {
      const novosGols = Array(placarVisitante - golsVisitante.length)
        .fill(null)
        .map(() => ({ jogador: '', minuto: undefined }));
      setGolsVisitante([...golsVisitante, ...novosGols]);
    } else if (placarVisitante < golsVisitante.length) {
      setGolsVisitante(golsVisitante.slice(0, placarVisitante));
    }
  }, [placarVisitante]);

  // Funções para manipular gols
  const atualizarGolCasa = (index: number, campo: 'jogador' | 'minuto', valor: string | number) => {
    const novosGols = [...golsCasa];
    if (campo === 'jogador') {
      novosGols[index] = { ...novosGols[index], jogador: valor as string };
    } else {
      novosGols[index] = { ...novosGols[index], minuto: valor ? Number(valor) : undefined };
    }
    setGolsCasa(novosGols);
  };

  const atualizarGolVisitante = (index: number, campo: 'jogador' | 'minuto', valor: string | number) => {
    const novosGols = [...golsVisitante];
    if (campo === 'jogador') {
      novosGols[index] = { ...novosGols[index], jogador: valor as string };
    } else {
      novosGols[index] = { ...novosGols[index], minuto: valor ? Number(valor) : undefined };
    }
    setGolsVisitante(novosGols);
  };

  // Funções para manipular cartões
  const adicionarCartao = (tipo: 'amarelo' | 'vermelho') => {
    setCartoes([...cartoes, { jogador: '', time: 'casa', tipo }]);
  };

  const atualizarCartao = (index: number, campo: 'jogador' | 'time', valor: string) => {
    const novosCartoes = [...cartoes];
    if (campo === 'jogador') {
      novosCartoes[index] = { ...novosCartoes[index], jogador: valor };
    } else {
      novosCartoes[index] = { ...novosCartoes[index], time: valor as 'casa' | 'visitante' };
    }
    setCartoes(novosCartoes);
  };

  const removerCartao = (index: number) => {
    setCartoes(cartoes.filter((_, i) => i !== index));
  };

  // Validação
  const validarDados = (): string | null => {
    const golsCasaInvalidos = golsCasa.some(gol => !gol.jogador.trim());
    const golsVisitanteInvalidos = golsVisitante.some(gol => !gol.jogador.trim());

    if (golsCasaInvalidos || golsVisitanteInvalidos) {
      return 'Por favor, selecione os jogadores que fizeram os gols';
    }

    const cartoesInvalidos = cartoes.some(cartao => !cartao.jogador.trim());
    if (cartoesInvalidos) {
      return 'Por favor, selecione os jogadores que receberam cartões';
    }

    if (!relatorioArbitro.trim()) {
      return 'Por favor, adicione um relatório da partida';
    }

    return null;
  };

  return {
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
  };
}