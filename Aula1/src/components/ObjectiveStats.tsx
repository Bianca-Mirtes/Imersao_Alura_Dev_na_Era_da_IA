import React from 'react';
import { Objective } from '../types/objective';
import { CheckCircle2, Clock, CircleDot, Target } from 'lucide-react';

interface ObjectiveStatsProps {
  objectives: Objective[];
  onFilterSelect?: (status: 'todos' | 'nao_iniciado' | 'em_andamento' | 'concluido') => void;
  activeFilter?: string;
}

export const ObjectiveStats: React.FC<ObjectiveStatsProps> = ({
  objectives,
  onFilterSelect,
  activeFilter = 'todos',
}) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;

  const percentConcluidos = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Visão geral dos objetivos" className="mb-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {/* Total Geral */}
        <button
          type="button"
          onClick={() => onFilterSelect?.('todos')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'todos'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {total}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {total === 1 ? 'objetivo cadastrado' : 'objetivos cadastrados'}
          </p>
        </button>

        {/* Não Iniciados */}
        <button
          type="button"
          onClick={() => onFilterSelect?.('nao_iniciado')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'nao_iniciado'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Não iniciados</span>
            <CircleDot className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-700 tabular-nums">
            {naoIniciados}
          </div>
          <p className="text-xs text-slate-500 mt-1">aguardando início</p>
        </button>

        {/* Em Andamento */}
        <button
          type="button"
          onClick={() => onFilterSelect?.('em_andamento')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'em_andamento'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-700">Em andamento</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-900 tabular-nums">
            {emAndamento}
          </div>
          <p className="text-xs text-amber-700/80 mt-1">estudos em progresso</p>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onFilterSelect?.('concluido')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'concluido'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700">Concluídos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-900 tabular-nums">
            {concluidos}
          </div>
          <p className="text-xs text-emerald-700/80 mt-1">metas alcançadas</p>
        </button>
      </div>

      {/* Barra de Progresso Acolhedora */}
      {total > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Seu ritmo de aprendizado</span>
              <span className="text-indigo-600 font-semibold tabular-nums">
                {concluidos} de {total} concluídos ({percentConcluidos}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentConcluidos}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 sm:text-right">
            {percentConcluidos === 100 ? (
              <span className="text-emerald-700 font-medium">Parabéns! Todos os objetivos foram concluídos! 🎉</span>
            ) : percentConcluidos >= 50 ? (
              <span>Mais da metade concluída! Continue com foco. 💪</span>
            ) : (
              <span>Dê um passo de cada vez para construir consistência. 🌱</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
