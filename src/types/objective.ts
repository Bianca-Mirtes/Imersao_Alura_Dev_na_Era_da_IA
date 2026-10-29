export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Objective {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export type FilterStatus = 'todos' | ObjectiveStatus;
export type SortOption = 'prazo_asc' | 'prazo_desc' | 'recentes' | 'alfabetica';
