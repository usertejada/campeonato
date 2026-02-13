// src/hooks/jogos/useConfiguracaoLocal.ts

import { useState } from 'react';

export function useConfiguracaoLocal() {
  const [novoLocal, setNovoLocal] = useState('');
  const [editandoLocalId, setEditandoLocalId] = useState<string | null>(null);
  const [nomeEditando, setNomeEditando] = useState('');

  const iniciarEdicao = (id: string, nomeAtual: string) => {
    setEditandoLocalId(id);
    setNomeEditando(nomeAtual);
  };

  const cancelarEdicao = () => {
    setEditandoLocalId(null);
    setNomeEditando('');
  };

  const limparNovoLocal = () => {
    setNovoLocal('');
  };

  return {
    novoLocal,
    setNovoLocal,
    editandoLocalId,
    nomeEditando,
    setNomeEditando,
    iniciarEdicao,
    cancelarEdicao,
    limparNovoLocal,
  };
}