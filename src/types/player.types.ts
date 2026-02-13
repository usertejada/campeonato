// src/types/player.types.ts

export type DocumentType = 'rg' | 'cpf' | 'dni_colombia' | 'dni_peru';

export interface Player {
  id: string;
  name: string;
  photo: string;
  teamId: string;
  teamName: string;
  position: string;
  phone: string;
  phoneCode: string; // Código do país (ex: '+55', '+57', '+51')
  nationality: string;
  birthDate: string;
  documentPhoto: string;
  shirtNumber: number;
  isActive?: boolean;
  // Documentos de identificação
  rg?: string;
  cpf?: string;
  dni_colombia?: string;
  dni_peru?: string;
  documentType?: DocumentType; // Qual documento está ativo/selecionado
}