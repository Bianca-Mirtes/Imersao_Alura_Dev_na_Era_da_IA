import { Objective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
export const INITIAL_SAMPLE_OBJECTIVES: Objective[] = [
  {
    id: 'sample-1',
    title: 'Compreender a sintaxe básica de JavaScript',
    description: 'Estudar variáveis (let, const), tipos primitivos e operadores lógicos com anotações práticas.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Revisar conceitos fundamentais de HTML & CSS',
    description: 'Montar uma página simples de perfil pessoal aplicando tags semânticas e flexbox.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Organizar espaço e horário fixo de estudo',
    description: 'Definir 45 minutos diários pelo método Pomodoro e eliminar distrações no ambiente.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos gravados no localStorage.
   * Se for o primeiro acesso, inicializa com exemplos práticos.
   */
  getObjectives(): Objective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com exemplos úteis para o estudante iniciante
        this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
        return INITIAL_SAMPLE_OBJECTIVES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: Objective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo.
   */
  addObjective(formData: ObjectiveFormData): Objective {
    const objectives = this.getObjectives();
    const now = new Date().toISOString();
    const newObjective: Objective = {
      id: 'obj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newObjective, ...objectives];
    this.saveObjectives(updated);
    return newObjective;
  },

  /**
   * Atualiza os dados de um objetivo existente.
   */
  updateObjective(id: string, updates: Partial<ObjectiveFormData>): Objective | null {
    const objectives = this.getObjectives();
    const index = objectives.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const existing = objectives[index];
    const updatedObjective: Objective = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    objectives[index] = updatedObjective;
    this.saveObjectives(objectives);
    return updatedObjective;
  },

  /**
   * Exclui um objetivo de estudo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const objectives = this.getObjectives();
    const filtered = objectives.filter((item) => item.id !== id);
    if (filtered.length !== objectives.length) {
      this.saveObjectives(filtered);
      return true;
    }
    return false;
  },

  /**
   * Restaura os objetivos para a lista de exemplos de estudos.
   */
  resetToSampleData(): Objective[] {
    this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
    return INITIAL_SAMPLE_OBJECTIVES;
  },

  /**
   * Limpa todos os dados armazenados.
   */
  clearAll(): void {
    this.saveObjectives([]);
  },
};
