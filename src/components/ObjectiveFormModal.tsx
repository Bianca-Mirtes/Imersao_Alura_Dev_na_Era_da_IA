import React, { useState, useEffect } from 'react';
import { Objective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';
import { X, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  objectiveToEdit: Objective | null;
  onSave: (data: ObjectiveFormData) => void;
  onClose: () => void;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  objectiveToEdit,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(objectiveToEdit);

  // Data padrão para novos objetivos: 7 dias à frente
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDeadline());
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (objectiveToEdit) {
      setTitle(objectiveToEdit.title);
      setDescription(objectiveToEdit.description || '');
      setDeadline(objectiveToEdit.deadline || getDefaultDeadline());
      setStatus(objectiveToEdit.status || 'nao_iniciado');
      setError(null);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDeadline());
      setStatus('nao_iniciado');
      setError(null);
    }
  }, [objectiveToEdit, isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!deadline) {
      setError('Por favor, selecione uma data limite/prazo para seu objetivo.');
      return;
    }

    setError(null);
    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  // Atalhos de prazo para facilitar a rotina do estudante
  const setQuickDeadline = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setDeadline(d.toISOString().split('T')[0]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="form-modal-title" className="text-base font-bold text-slate-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize as informações do seu objetivo de estudo'
                  : 'Defina o que você quer aprender e quando pretende alcançar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Título */}
          <div>
            <label htmlFor="objective-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="objective-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Aprender funções e loops em Python"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: Seja específico e direto sobre o que deseja aprender.
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="objective-description" className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição ou anotações de estudo <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="objective-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Ler capítulo 4 do livro de referência e resolver a lista de 10 exercícios propostos."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="objective-deadline" className="block text-xs font-semibold text-slate-700">
                Prazo final <span className="text-rose-500">*</span>
              </label>
              {/* Atalhos de data */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(0)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(3)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  +1 semana
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                id="objective-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status atual do objetivo <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Não iniciado</span>
                <span className="text-[10px] text-slate-400">A planejar</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Em andamento</span>
                <span className="text-[10px] text-amber-600/80">Estudando</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Concluído</span>
                <span className="text-[10px] text-emerald-600/80">Alcançado</span>
              </button>
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Atualizar Objetivo' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
