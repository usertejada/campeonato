// src/components/carteirinhas/ModalCarteirinha.tsx

import React, { useState, useRef } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { Download, Printer, RotateCw } from 'lucide-react';
import { Carteirinha } from './Carteirinha';
import { teamService } from '@/services/teamService';
import { championshipService } from '@/services/championshipService';
import type { Player } from '@/types/player.types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ModalCarteirinhaProps {
  isOpen: boolean;
  onClose: () => void;
  jogador: Player;
}

export function ModalCarteirinha({ isOpen, onClose, jogador }: ModalCarteirinhaProps) {
  const [lado, setLado] = useState<'frente' | 'verso'>('frente');
  const [isProcessing, setIsProcessing] = useState(false);
  const frenteRef = useRef<HTMLDivElement>(null);
  const versoRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Busca dados do time e campeonato
  const time = teamService.getById(jogador.teamId);
  const campeonato = time ? championshipService.getById(time.championshipId) : null;

  if (!time || !campeonato) {
    return null;
  }

  const handleVirar = () => {
    setLado(lado === 'frente' ? 'verso' : 'frente');
  };

  const handleImprimir = () => {
    // Mostra a área de impressão com frente e verso lado a lado
    const printArea = printAreaRef.current;
    if (printArea) {
      printArea.style.display = 'block';
      
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        window.print();
        // Esconde a área de impressão após imprimir
        printArea.style.display = 'none';
      }, 100);
    }
  };

  const handleBaixar = async () => {
    if (!frenteRef.current || !versoRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Captura frente como imagem
      const canvasFrente = await html2canvas(frenteRef.current, {
        scale: 3, // Alta qualidade
        backgroundColor: null,
        logging: false,
      });

      // Captura verso como imagem
      const canvasVerso = await html2canvas(versoRef.current, {
        scale: 3, // Alta qualidade
        backgroundColor: null,
        logging: false,
      });

      // Cria PDF no formato A4 vertical (portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dimensões da carteirinha em mm (tamanho cartão de crédito padrão: 85.6mm x 53.98mm)
      const largura = 85.6;
      const altura = 53.98;
      
      // Posições para centralizar as duas carteirinhas lado a lado em A4 portrait (210mm largura)
      const espacoEntreCartoes = 10;
      const larguraTotal = (largura * 2) + espacoEntreCartoes;
      const margemEsquerda = (210 - larguraTotal) / 2; // Centraliza horizontalmente
      const margemSuperior = 50; // Margem superior

      // Adiciona frente (lado esquerdo)
      const imgFrente = canvasFrente.toDataURL('image/png');
      pdf.addImage(imgFrente, 'PNG', margemEsquerda, margemSuperior, largura, altura);

      // Adiciona verso (lado direito)
      const imgVerso = canvasVerso.toDataURL('image/png');
      pdf.addImage(imgVerso, 'PNG', margemEsquerda + largura + espacoEntreCartoes, margemSuperior, largura, altura);

      // Adiciona linhas guia de corte (opcionais)
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      
      // Linha guia ao redor da frente
      pdf.rect(margemEsquerda, margemSuperior, largura, altura);
      
      // Linha guia ao redor do verso
      pdf.rect(margemEsquerda + largura + espacoEntreCartoes, margemSuperior, largura, altura);

      // Adiciona texto de instrução
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Corte nas linhas pontilhadas, dobre ao meio e plastifique', 148.5, 200, { align: 'center' });

      // Baixa o PDF
      pdf.save(`carteirinha-${jogador.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o arquivo. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Carteirinha do Jogador"
        size="lg"
      >
        <div className="space-y-6">
          {/* Preview da Carteirinha */}
          <div className="flex justify-center items-center p-8 bg-gray-50 rounded-xl">
            <div className="transform transition-transform duration-500">
              <Carteirinha
                jogador={jogador}
                time={time}
                campeonato={campeonato}
                lado={lado}
              />
            </div>
          </div>

          {/* Informação do Lado */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Visualizando: <span className="font-semibold text-blue-600">
                {lado === 'frente' ? 'Frente' : 'Verso'}
              </span>
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={RotateCw}
              onClick={handleVirar}
            >
              Virar Carteirinha
            </Button>
            
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={Printer}
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
            
            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={Download}
              onClick={handleBaixar}
              disabled={isProcessing}
            >
              {isProcessing ? 'Gerando PDF...' : 'Baixar PDF'}
            </Button>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Instruções:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use "Virar Carteirinha" para visualizar frente e verso</li>
              <li>• "Imprimir" ou "Baixar PDF" mostra as duas faces lado a lado</li>
              <li>• Imprima em papel fotográfico ou papel comum (A4)</li>
              <li>• Corte nas linhas guia, dobre ao meio e plastifique</li>
              <li>• Tamanho final: 8,5cm x 5,5cm (tamanho cartão de crédito)</li>
            </ul>
          </div>

          {/* Botão Fechar */}
          <Button
            variant="cancel"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </Modal>

      {/* Área oculta para impressão (frente e verso lado a lado) */}
      <div 
        ref={printAreaRef}
        className="print-area"
        style={{ display: 'none' }}
      >
        <div className="flex justify-center items-center gap-4 p-8">
          <div ref={frenteRef}>
            <Carteirinha
              jogador={jogador}
              time={time}
              campeonato={campeonato}
              lado="frente"
            />
          </div>
          <div ref={versoRef}>
            <Carteirinha
              jogador={jogador}
              time={time}
              campeonato={campeonato}
              lado="verso"
            />
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Corte, dobre ao meio e plastifique
        </p>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        /* Força impressão de cores e backgrounds */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: 210mm 297mm; /* A4 portrait (retrato) - largura x altura */
            margin: 10mm;
          }
          
          /* Força orientação portrait em navegadores específicos */
          html, body {
            width: 210mm;
            height: 297mm;
          }
        }
      `}</style>
    </>
  );
}