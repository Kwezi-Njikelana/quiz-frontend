import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'correct' | 'wrong' | 'accent';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]',
    correct: 'bg-[var(--correct)]/10 text-[var(--correct)] border-[var(--correct)]/30',
    wrong: 'bg-[var(--wrong)]/10 text-[var(--wrong)] border-[var(--wrong)]/30',
    accent: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}