/**
 * Formata data no padrão brasileiro DD/MM/AAAA a partir de YYYY-MM-DD
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Calcula a situação relativa do prazo para orientar o estudante
 */
export function getDeadlineInfo(dateString: string, isCompleted: boolean): {
  label: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  if (!dateString) {
    return { label: 'Sem prazo', isUrgent: false, isOverdue: false };
  }

  if (isCompleted) {
    return { label: 'Concluído', isUrgent: false, isOverdue: false };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dateString.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        label: overdueDays === 1 ? 'Venceu ontem' : `Atrasado há ${overdueDays} dias`,
        isUrgent: true,
        isOverdue: true,
      };
    }

    if (diffDays === 0) {
      return { label: 'Vence hoje!', isUrgent: true, isOverdue: false };
    }

    if (diffDays === 1) {
      return { label: 'Vence amanhã', isUrgent: true, isOverdue: false };
    }

    return {
      label: `Faltam ${diffDays} dias`,
      isUrgent: diffDays <= 3,
      isOverdue: false,
    };
  } catch {
    return { label: formatDateBR(dateString), isUrgent: false, isOverdue: false };
  }
}
