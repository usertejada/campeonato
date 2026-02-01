// src/types/team.types.ts

export interface Team {
  id: string;
  name: string;
  logo: string;
  championshipId: string;
  championshipName: string;
  coach: string;
  email: string;
  phone?: string;
  players: number;
  foundedYear: number;
  isActive?: boolean; // Para o toggle de ativar/desativar
}