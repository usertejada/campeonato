// src/types/player.types.ts

export interface Player {
  id: string;
  name: string;
  photo: string;
  teamId: string;
  teamName: string;
  position: string;
  phone: string;
  nationality: string;
  birthDate: string;
  documentPhoto: string;
  shirtNumber: number;
  isActive?: boolean;
  // Documentos de identificação
  rg?: string;
  cpf?: string;
  documentType?: 'rg' | 'cpf'; // Qual documento está ativo/selecionado
}