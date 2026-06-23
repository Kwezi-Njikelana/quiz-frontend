import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ToastContext } from "./ToastContext";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed bottom-4 right-4 z-60 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((item) => {
          const Icon = item.type === "error" ? AlertCircle : CheckCircle2;

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-xl animate-slide-in"
            >
              <Icon
                size={18}
                className="mt-0.5 shrink-0"
                style={{
                  color:
                    item.type === "error" ? "var(--wrong)" : "var(--correct)",
                }}
              />
              <span className="leading-5">{item.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
