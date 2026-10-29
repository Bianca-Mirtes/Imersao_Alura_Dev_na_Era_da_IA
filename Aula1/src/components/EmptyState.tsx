import React from 'react';
import { BookOpen, SearchX, PlusCircle, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-data' | 'no-filter-match';
  onAddClick: () => void;
  onResetSamples?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAddClick,
  onResetSamples,
  onClearFilters,
}) => {
  if (type === 'no-filter-match') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos filtros ou termo de busca selecionados.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
        >
          Limpar filtros e busca
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-5 shadow-xs border border-indigo-100">
        <BookOpen className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium mb-3 border border-amber-200/60">
        <Sparkles className="w-3 h-3" />
        Comece a sua jornada de estudos
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>

      <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
        O <strong>StudyFlow</strong> foi feito para você planejar pequenos passos de aprendizado sem
        ansiedade. Cadastre o que deseja estudar, estipule um prazo e acompanhe seu progresso!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onAddClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onResetSamples && (
          <button
            onClick={onResetSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Carregar objetivos de exemplo para entender a dinâmica"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Carregar exemplos de estudo</span>
          </button>
        )}
      </div>
    </div>
  );
};
