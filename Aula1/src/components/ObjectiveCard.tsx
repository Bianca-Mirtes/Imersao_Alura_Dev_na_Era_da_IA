import React from 'react';
import { Objective, ObjectiveStatus } from '../types/objective';
import { formatDateBR, getDeadlineInfo } from '../utils/dateUtils';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDot } from 'lucide-react';

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDeleteRequest: (objective: Objective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = objective.status === 'concluido';
  const deadlineInfo = getDeadlineInfo(objective.deadline, isCompleted);

  const getStatusBadge = () => {
    switch (objective.status) {
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Concluído
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Em andamento
          </span>
        );
      case 'nao_iniciado':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-md">
            <CircleDot className="w-3.5 h-3.5" />
            Não iniciado
          </span>
        );
    }
  };

  return (
    <article
      className={`rounded-xl border bg-white p-5 transition-all duration-200 flex flex-col justify-between shadow-xs ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status e Prazo */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
          </div>

          <div
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              deadlineInfo.isOverdue
                ? 'text-rose-600 font-semibold'
                : deadlineInfo.isUrgent
                ? 'text-amber-600 font-semibold'
                : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span title={`Data limite: ${formatDateBR(objective.deadline)}`}>
              {formatDateBR(objective.deadline)}
            </span>
            <span className="text-[11px] text-slate-400">({deadlineInfo.label})</span>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold leading-snug mb-2 text-balance ${
            isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição do Objetivo */}
        {objective.description ? (
          <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">Nenhuma descrição informada.</p>
        )}
      </div>

      {/* Rodapé do Card com Ações */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        {/* Seletor rápido de Status */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={`status-select-${objective.id}`} className="sr-only">
            Alterar status de {objective.title}
          </label>
          <select
            id={`status-select-${objective.id}`}
            value={objective.status}
            onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
            className="text-xs py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-700 hover:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="nao_iniciado">Não iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        {/* Botões de Edição e Exclusão */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(objective)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Editar este objetivo"
            aria-label={`Editar ${objective.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(objective)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Excluir este objetivo"
            aria-label={`Excluir ${objective.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
