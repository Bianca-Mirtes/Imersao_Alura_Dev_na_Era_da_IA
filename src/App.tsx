import React, { useState, useEffect, useMemo } from 'react';
import { Objective, ObjectiveFormData, ObjectiveStatus, FilterStatus } from './types/objective';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { ObjectiveStats } from './components/ObjectiveStats';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Check, Info, Lightbulb, Plus, RotateCcw } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais de Formulário e Confirmação
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<Objective | null>(null);

  // Notificação / Feedback visual
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Carrega dados iniciais do localStorage
  useEffect(() => {
    const data = storageService.getObjectives();
    setObjectives(data);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cadastrar ou Editar Objetivo
  const handleSaveObjective = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      storageService.updateObjective(editingObjective.id, formData);
      showToast('Objetivo atualizado com sucesso!');
    } else {
      storageService.addObjective(formData);
      showToast('Novo objetivo de estudo cadastrado!');
    }

    setObjectives(storageService.getObjectives());
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Abrir modal para novo
  const handleOpenNewModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para edição
  const handleEditRequest = (objective: Objective) => {
    setEditingObjective(objective);
    setIsFormModalOpen(true);
  };

  // Solicitar exclusão (abre confirmação)
  const handleDeleteRequest = (objective: Objective) => {
    setDeletingObjective(objective);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;
    storageService.deleteObjective(deletingObjective.id);
    setObjectives(storageService.getObjectives());
    showToast('Objetivo excluído com sucesso.', 'info');
    setDeletingObjective(null);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDeletingObjective(null);
  };

  // Alterar status diretamente no card
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    storageService.updateObjective(id, { status: newStatus });
    setObjectives(storageService.getObjectives());

    if (newStatus === 'concluido') {
      showToast('Parabéns pela conclusão de mais uma meta! 🎉');
    } else {
      showToast('Status do objetivo atualizado.');
    }
  };

  // Restaurar exemplos de estudos
  const handleResetSamples = () => {
    const samples = storageService.resetToSampleData();
    setObjectives(samples);
    showToast('Exemplos de estudo carregados com sucesso.');
  };

  // Filtragem e busca
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      // Filtro de status
      if (currentFilter !== 'todos' && item.status !== currentFilter) {
        return false;
      }
      // Filtro de busca textual
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [objectives, currentFilter, searchTerm]);

  // Contagens para os botões de filtro
  const counts = useMemo(() => {
    return {
      todos: objectives.length,
      nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
      em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
      concluido: objectives.filter((o) => o.status === 'concluido').length,
    };
  }, [objectives]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Toast de Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg animate-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Info className="w-4 h-4 text-indigo-300" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <Header totalCount={objectives.length} onOpenNewModal={handleOpenNewModal} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Painel de Quantidade e Métricas de Objetivos Cadastrados */}
        <ObjectiveStats
          objectives={objectives}
          activeFilter={currentFilter}
          onFilterSelect={(status) => setCurrentFilter(status)}
        />

        {/* Barra de Filtros e Busca (exibida quando há objetivos cadastrados) */}
        {objectives.length > 0 && (
          <FilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            counts={counts}
          />
        )}

        {/* Área de Listagem ou Empty States */}
        {objectives.length === 0 ? (
          <EmptyState
            type="no-data"
            onAddClick={handleOpenNewModal}
            onResetSamples={handleResetSamples}
          />
        ) : filteredObjectives.length === 0 ? (
          <EmptyState
            type="no-filter-match"
            onAddClick={handleOpenNewModal}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchTerm('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredObjectives.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                onEdit={handleEditRequest}
                onDeleteRequest={handleDeleteRequest}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Dica Pedagógica para Estudantes Iniciantes */}
        {objectives.length > 0 && (
          <div className="mt-12 bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-slate-900 block mb-0.5">
                Dica pedagógica para iniciantes:
              </span>
              <p className="leading-relaxed">
                Divida temas complexos em objetivos de 2 a 5 dias. Ter prazos visíveis e marcar cada etapa como
                <strong> Concluído</strong> estimula a dopamina natural e reduz a procrastinação nos estudos.
              </p>
            </div>
            <button
              onClick={handleResetSamples}
              className="text-slate-400 hover:text-indigo-600 p-1 text-[11px] whitespace-nowrap hidden sm:inline-flex items-center gap-1"
              title="Restaurar objetivos de exemplo"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar exemplos
            </button>
          </div>
        )}
      </main>

      {/* Rodapé institucional */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyFlow · Organização Simples para Estudantes Iniciantes</span>
          <span>Dados salvos localmente no seu navegador (localStorage)</span>
        </div>
      </footer>

      {/* Modal de Cadastro / Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        objectiveToEdit={editingObjective}
        onSave={handleSaveObjective}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingObjective)}
        objective={deletingObjective}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
