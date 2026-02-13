// src/types/team.types.ts

export interface Team {
  id: string;
  name: string;
  logo: string;
  championshipId: string;
  championshipName: string;
  coach?: string;
  email?: string;
  phone?: string;
  phoneCode?: string; // Código do país (ex: '+55', '+57', '+51')
  players?: number;
  foundedYear?: number;
  isActive?: boolean; // Para o toggle de ativar/desativar
}