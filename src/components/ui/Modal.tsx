import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-(--surface) border border-(--border) rounded-2xl w-full ${maxWidth} animate-slide-in shadow-2xl`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border)">
          <h2 className="text-lg font-bold text-(--text)">{title}</h2>

          <button
            onClick={onClose}
            className="text-(--muted) hover:text-(--text) transition-colors p-1 rounded-lg hover:bg-(--surface-2)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}