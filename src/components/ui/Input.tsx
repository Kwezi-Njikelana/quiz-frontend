import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-(--muted) uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        className={`bg-(--surface-2) border ${
          error ? 'border-(--wrong)' : 'border-(--border)'
        }
        rounded-lg px-3 py-2.5 text-sm text-(--text) outline-none transition-all
        focus:border-(--accent)
        focus:shadow-[0_0_0_3px_var(--accent-glow)]
        placeholder:text-(--muted)
        ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-(--wrong)">{error}</p>}
    </div>
  );
}