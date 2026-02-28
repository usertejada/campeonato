// src/components/historico/CardHistoricoVerso.tsx
import { RotateCcw } from 'lucide-react'
import type { JogoFinalizado, EventoJogo } from '@/hooks/useHistorico'

interface ColunaTimeProps {
  time: { id: string; nome: string; logo_url: string | null } | null
  gols: EventoJogo[]
  cartoes: EventoJogo[]
  accentColor: 'blue' | 'violet'
}

function ColunaTime({ time, gols, cartoes, accentColor }: ColunaTimeProps) {
  const nome = time?.nome ?? '—'
  const logoClasses = accentColor === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
  const minutoGolClass = accentColor === 'blue' ? 'bg-blue-400' : 'bg-violet-400'
  const temEventos = gols.length > 0 || cartoes.length > 0

  return (
    <div className="flex flex-col px-3 py-2.5 gap-2.5 min-w-0">
      {/* Nome do time */}
      <div className="flex items-center gap-1.5 min-w-0">
        {time?.logo_url ? (
          <img src={time.logo_url} alt={nome} className="w-5 h-5 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${logoClasses}`}>
            <span className="text-[7px] font-bold">{nome.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wide truncate">
          {nome}
        </span>
      </div>

      {/* Gols */}
      {gols.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">⚽ Gols</p>
          <div className="space-y-1">
            {gols.map(g => (
              <div key={g.id} className="flex items-center justify-between gap-1">
                <span className="text-[11px] text-gray-700 font-medium truncate">{g.jogador?.nome ?? '—'}</span>
                {g.minuto != null && (
                  <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shrink-0 ${minutoGolClass}`}>
                    {g.minuto}'
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cartões */}
      {cartoes.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cartões</p>
          <div className="space-y-1">
            {cartoes.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 truncate">
                  <span className="text-[10px] shrink-0">{c.tipo === 'amarelo' ? '🟡' : '🔴'}</span>
                  <span className="text-[11px] text-gray-700 font-medium truncate">{c.jogador?.nome ?? '—'}</span>
                </div>
                {c.minuto != null && (
                  <span className="text-[9px] font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded-full shrink-0">
                    {c.minuto}'
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!temEventos && (
        <p className="text-[10px] text-gray-300 italic">Sem eventos</p>
      )}
    </div>
  )
}

interface CardHistoricoVersoProps {
  jogo: JogoFinalizado
  onVoltar: () => void
}

export function CardHistoricoVerso({ jogo, onVoltar }: CardHistoricoVersoProps) {
  const idCasa = jogo.time_casa?.id
  const idFora = jogo.time_fora?.id

  const golsCasa    = jogo.eventos.filter(e => e.tipo === 'gol' && e.jogador?.time_id === idCasa)
  const golsFora    = jogo.eventos.filter(e => e.tipo === 'gol' && e.jogador?.time_id === idFora)
  const cartoesCasa = jogo.eventos.filter(e => (e.tipo === 'amarelo' || e.tipo === 'vermelho') && e.jogador?.time_id === idCasa)
  const cartoesFora = jogo.eventos.filter(e => (e.tipo === 'amarelo' || e.tipo === 'vermelho') && e.jogador?.time_id === idFora)

  return (
    <div
      className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-linear-to-r from-blue-500 to-violet-500 shrink-0">
        <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
          Detalhes da partida
        </span>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] font-medium transition-colors"
        >
          <RotateCcw size={11} />
          Voltar
        </button>
      </div>

      {/* Duas colunas */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="grid grid-cols-2 divide-x divide-gray-100 flex-1">
          <ColunaTime time={jogo.time_casa} gols={golsCasa} cartoes={cartoesCasa} accentColor="blue" />
          <ColunaTime time={jogo.time_fora} gols={golsFora} cartoes={cartoesFora} accentColor="violet" />
        </div>

        {/* Observações */}
        {jogo.observacoes && (
          <div className="px-3 pb-3 pt-2 border-t border-gray-100 shrink-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Observações</p>
            <p className="text-[11px] text-gray-600 bg-gray-50 rounded-lg p-2 leading-relaxed">
              {jogo.observacoes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}