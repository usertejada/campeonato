// src/components/historico/CardHistoricoFrente.tsx
import { Trophy, AlertTriangle } from 'lucide-react'
import type { JogoFinalizado } from '@/hooks/useHistorico'

function TeamLogo({ logo_url, nome }: { logo_url?: string | null; nome: string }) {
  return logo_url ? (
    <img src={logo_url} alt={nome} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-100 shadow-sm">
      <span className="text-xs font-bold text-blue-700">{nome.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

function CartaoBadge({ amarelos, vermelhos }: { amarelos: number; vermelhos: number }) {
  if (amarelos === 0 && vermelhos === 0) return null
  return (
    <div className="flex items-center gap-1">
      {amarelos > 0 && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
          🟡 {amarelos}
        </span>
      )}
      {vermelhos > 0 && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
          🔴 {vermelhos}
        </span>
      )}
    </div>
  )
}

interface CardHistoricoFrenteProps {
  jogo: JogoFinalizado
  temDetalhes: boolean
  onVerDetalhes: () => void
}

export function CardHistoricoFrente({ jogo, temDetalhes, onVerDetalhes }: CardHistoricoFrenteProps) {
  const nomeCasa = jogo.time_casa?.nome ?? 'Time Casa'
  const nomeFora = jogo.time_fora?.nome ?? 'Time Fora'

  const vencedor =
    jogo.wo ? null :
    jogo.placar_casa > jogo.placar_fora ? 'casa' :
    jogo.placar_fora > jogo.placar_casa ? 'fora' : 'empate'

  const dataFormatada = jogo.data_hora
    ? new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'

  return (
    <div
      className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <Trophy size={12} className="text-blue-500" />
          <span className="text-[11px] font-semibold text-blue-600 truncate max-w-45">
            {jogo.campeonato?.nome ?? 'Campeonato'}
          </span>
        </div>
        <span className="text-[11px] text-gray-500">{dataFormatada}</span>
      </div>

      {/* Placar */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Time Casa */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <TeamLogo logo_url={jogo.time_casa?.logo_url} nome={nomeCasa} />
            <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-1">{nomeCasa}</span>
            <CartaoBadge amarelos={jogo.cartoes_amarelos_casa} vermelhos={jogo.cartoes_vermelhos_casa} />
          </div>

          {/* Placar central */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-black tabular-nums ${vencedor === 'casa' ? 'text-blue-600' : 'text-gray-800'}`}>
                {jogo.placar_casa}
              </span>
              <span className="text-xl text-gray-300 font-light">×</span>
              <span className={`text-3xl font-black tabular-nums ${vencedor === 'fora' ? 'text-blue-600' : 'text-gray-800'}`}>
                {jogo.placar_fora}
              </span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              vencedor === 'empate' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'
            }`}>
              {jogo.wo ? 'W.O.' : vencedor === 'empate' ? 'Empate' : 'Finalizado'}
            </span>
          </div>

          {/* Time Fora */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <TeamLogo logo_url={jogo.time_fora?.logo_url} nome={nomeFora} />
            <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-1">{nomeFora}</span>
            <CartaoBadge amarelos={jogo.cartoes_amarelos_fora} vermelhos={jogo.cartoes_vermelhos_fora} />
          </div>
        </div>

        {/* W.O. banner — abaixo do placar */}
        {jogo.wo && (
          <div className="flex items-center justify-center gap-1 mt-3 text-xs font-bold text-orange-500 bg-orange-50 border border-orange-100 rounded-lg py-1">
            <AlertTriangle size={12} /> W.O. — Jogo não realizado
          </div>
        )}
      </div>

      {/* Badge ver detalhes */}
      {temDetalhes && (
        <div className="shrink-0 flex justify-center pb-3">
          <button
            onClick={onVerDetalhes}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
          >
            Ver detalhes <span className="text-blue-400">→</span>
          </button>
        </div>
      )}
    </div>
  )
}