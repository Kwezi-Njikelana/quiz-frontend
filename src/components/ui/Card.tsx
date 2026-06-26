
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hoverable,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-(--surface) border border-(--border) rounded-xl p-5 transition-all duration-200
      ${
        hoverable
          ? 'hover:border-(--accent)/50 hover:shadow-[0_0_20px_var(--accent-glow)] cursor-pointer'
          : ''
      }
      ${className}`}
    >
      {children}
    </div>
  );
}