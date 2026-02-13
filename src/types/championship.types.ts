// src/types/championship.types.ts

export interface Championship {
  id: string;
  name: string;
  logo: string;
  organizer: string;
  local: string;
  phone?: string;
  phoneCode?: string; // Código do país (ex: '+55', '+57', '+51')
  category: 'Masculino Livre' | 'Feminino Livre' | 'Veterano 35+' | 'Sub-13' | 'Sub-15';
  status: 'Agendado' | 'Em Andamento' | 'Finalizado' | 'Inativo' | 'Bloqueado';
  format: 'Pontos Corridos' | 'Chaveamento';
  teams: number;
  startDate: string;
  endDate: string;
}

export type ChampionshipStatus = Championship['status'];
export type ChampionshipCategory = Championship['category'];
export type ChampionshipFormat = Championship['format'];