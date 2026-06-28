import { createContext } from "react";

export interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
