import React from 'react';
import { BookOpen, PlusCircle } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onOpenNewModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalCount, onOpenNewModal }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">StudyFlow</span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                Iniciante
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Organize suas metas de estudo com clareza e sem complicação
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            aria-label="Cadastrar novo objetivo"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
