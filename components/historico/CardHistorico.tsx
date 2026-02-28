// src/components/historico/CardHistorico.tsx
'use client'

import { useState } from 'react'
import { CardHistoricoFrente } from './CardHistoricoFrente'
import { CardHistoricoVerso }  from './CardHistoricoVerso'
import type { JogoFinalizado } from '@/hooks/useHistorico'

interface CardHistoricoProps {
  jogo: JogoFinalizado
}

export function CardHistorico({ jogo }: CardHistoricoProps) {
  const [virado, setVirado] = useState(false)

  const temDetalhes = jogo.eventos.length > 0 || !!jogo.observacoes

  return (
    <div className="w-full" style={{ perspective: '1000px', height: '220px' }}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: virado ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <CardHistoricoFrente
          jogo={jogo}
          temDetalhes={temDetalhes}
          onVerDetalhes={() => setVirado(true)}
        />
        <CardHistoricoVerso
          jogo={jogo}
          onVoltar={() => setVirado(false)}
        />
      </div>
    </div>
  )
}