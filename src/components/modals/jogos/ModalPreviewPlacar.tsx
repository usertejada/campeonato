// src/components/modals/jogos/ModalPreviewPlacar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Share2, Loader2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/molecules/Button';
import { Icon } from '@/components/atoms/Icon';
import type { Jogo } from '@/types/jogo.types';

interface ModalPreviewPlacarProps {
  jogos: Jogo[];
  onClose: () => void;
}

type QualidadeType = 'normal' | 'alta' | 'ultra';

export function ModalPreviewPlacar({ jogos, onClose }: ModalPreviewPlacarProps) {
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [qualidade, setQualidade] = useState<QualidadeType>('alta');

  const previewRef = useRef<HTMLDivElement>(null);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getScale = () => {
    switch (qualidade) {
      case 'normal':
        return 2;
      case 'alta':
        return 3;
      case 'ultra':
        return 4;
      default:
        return 3;
    }
  };

  const handleBaixarPNG = async () => {
    if (!previewRef.current || jogos.length === 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: getScale(),
        cacheBust: true,
        backgroundColor: '#1e3a8a',
      });

      const link = document.createElement('a');
      link.download = `placar-jogos-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarImagem = async () => {
    if (!previewRef.current || jogos.length === 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#1e3a8a',
      });

      const blob = await (await fetch(dataUrl)).blob();

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar imagem. Tente o download.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompartilhar = async () => {
    if (!previewRef.current || jogos.length === 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'placar-jogos.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Placar dos Jogos',
          text: `Confira o placar de ${jogos.length} jogos!`,
        });
      } else {
        await handleBaixarPNG();
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-6 border-b border-gray-200 bg-linear-to-r from-blue-600 to-blue-700">
          <div>
            <h2 className="text-base md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-3xl">⚽</span>
              Preview do Placar
            </h2>
            <p className="text-blue-100 text-xs md:text-sm mt-0.5 md:mt-1">
              {jogos.length} jogo{jogos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-blue-800/50 rounded-lg transition-colors text-white"
            aria-label="Fechar"
          >
            <Icon icon={X} size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Preview Area */}
          {jogos.length > 0 ? (
            <div className="flex justify-center">
              <div
                ref={previewRef}
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
                className="rounded-2xl shadow-2xl p-4 md:p-8 inline-block"
              >
                {/* Header do Preview */}
                <div className="text-center mb-4 md:mb-8">
                  <div className="flex items-center justify-center gap-2 md:gap-4 mb-1 md:mb-2">
                    <span className="text-2xl md:text-5xl">⚽</span>
                    <h1 className="text-xl md:text-4xl font-bold text-white tracking-wide">
                      PLACAR DOS JOGOS
                    </h1>
                  </div>
                  <p className="text-white/90 text-xs md:text-lg">
                    {new Date().toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Grid de Jogos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {jogos.map((jogo) => (
                    <div
                      key={jogo.id}
                      className="bg-white/95 rounded-xl p-3 md:p-4 shadow-lg w-full max-w-70 mx-auto"
                    >
                      {/* Status Badge */}
                      <div className="mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            jogo.status === 'finalizado'
                              ? 'bg-gray-200 text-gray-700'
                              : jogo.status === 'ao-vivo'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {jogo.status === 'finalizado'
                            ? 'FINALIZADO'
                            : jogo.status === 'ao-vivo'
                            ? 'AO VIVO'
                            : 'AGENDADO'}
                        </span>
                      </div>

                      {/* Confronto */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {/* Time Casa */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-200">
                            <img
                              src={jogo.timeCasa.escudo}
                              alt={jogo.timeCasa.nome}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="36" font-size="32">⚽</text></svg>';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">
                              {jogo.timeCasa.nome.length > 12
                                ? jogo.timeCasa.nome.substring(0, 12) + '...'
                                : jogo.timeCasa.nome}
                            </p>
                          </div>
                        </div>

                        {/* Placar */}
                        <div className="flex flex-col items-center">
                          {jogo.placarCasa !== null && jogo.placarVisitante !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-bold text-gray-900">
                                {jogo.placarCasa}
                              </span>
                              <span className="text-2xl font-bold text-gray-400">x</span>
                              <span className="text-3xl font-bold text-gray-900">
                                {jogo.placarVisitante}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-gray-400">VS</span>
                          )}
                        </div>

                        {/* Time Visitante */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-200">
                            <img
                              src={jogo.timeVisitante.escudo}
                              alt={jogo.timeVisitante.nome}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="36" font-size="32">⚽</text></svg>';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">
                              {jogo.timeVisitante.nome.length > 12
                                ? jogo.timeVisitante.nome.substring(0, 12) + '...'
                                : jogo.timeVisitante.nome}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="pt-3 border-t border-gray-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 text-xs">
                          <span>📍</span>
                          <span className="font-medium truncate">{jogo.estadio}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 text-xs">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium">
                              {new Date(jogo.data).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            <span className="font-medium">{jogo.horario}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 md:mt-8 text-center text-white/70 text-xs md:text-sm">
                  Gerado em {new Date().toLocaleString('pt-BR')} • Sistema de Placar de Jogos
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum jogo disponível para visualizar</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-gray-200 bg-white flex flex-wrap gap-3 justify-between items-center">
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Dica:</span> Use ESC para fechar
            </div>

            {/* Seletor de Qualidade */}
            <select
              value={qualidade}
              onChange={(e) => setQualidade(e.target.value as QualidadeType)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="normal">Normal (2x)</option>
              <option value="alta">Alta (3x)</option>
              <option value="ultra">Ultra (4x)</option>
            </select>
          </div>

          {/* Mobile: apenas ícones */}
          <div className="flex md:hidden gap-2 w-full justify-around">
            <button
              onClick={onClose}
              disabled={loading}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Fechar"
            >
              <Icon icon={X} size={20} />
            </button>

            <button
              onClick={handleCopiarImagem}
              disabled={loading || jogos.length === 0}
              className={`p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 ${
                copiado ? 'bg-green-50' : ''
              }`}
              title="Copiar"
            >
              {copiado ? (
                <Icon icon={Check} size={20} className="text-green-600" />
              ) : (
                <Icon icon={Copy} size={20} />
              )}
            </button>

            <button
              onClick={handleCompartilhar}
              disabled={loading || jogos.length === 0}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Compartilhar"
            >
              <Icon icon={Share2} size={20} />
            </button>

            <button
              onClick={handleBaixarPNG}
              disabled={loading || jogos.length === 0}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              title="Baixar"
            >
              {loading ? (
                <Icon icon={Loader2} size={20} className="text-white animate-spin" />
              ) : (
                <Icon icon={Download} size={20} className="text-white" />
              )}
            </button>
          </div>

          {/* Desktop: botões com texto */}
          <div className="hidden md:flex gap-3">
            <Button variant="cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>

            <Button
              variant="outline"
              leftIcon={copiado ? Check : Copy}
              onClick={handleCopiarImagem}
              disabled={loading || jogos.length === 0}
              className={copiado ? 'border-green-500 text-green-600' : ''}
            >
              {copiado ? 'Copiado!' : 'Copiar'}
            </Button>

            <Button
              variant="outline"
              leftIcon={Share2}
              onClick={handleCompartilhar}
              disabled={loading || jogos.length === 0}
            >
              Compartilhar
            </Button>

            <Button
              variant="primary"
              leftIcon={loading ? Loader2 : Download}
              onClick={handleBaixarPNG}
              disabled={loading || jogos.length === 0}
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <>
                  <Icon icon={Loader2} size={18} className="animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Baixar PNG
                  <span className="ml-2 text-xs opacity-75">
                    ({qualidade === 'normal' ? '2x' : qualidade === 'alta' ? '3x' : '4x'})
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}