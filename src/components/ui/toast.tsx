import { useState, useEffect } from "react";
import { CalendarIcon, CheckIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] animate-in slide-in-from-bottom-2 fade-in",
        type === "success" && "bg-green-light text-green border-green/20",
        type === "error" && "bg-red-light text-red border-red/20",
        type === "info" && "bg-blue-light text-blue border-blue/20"
      )}
    >
      <div className="flex-shrink-0">
        {type === "success" && <CheckIcon className="h-5 w-5" />}
        {type === "info" && <CalendarIcon className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="sr-only">Cerrar</span>
        ×
      </button>
    </div>
  );
}

interface ToastManagerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
  }>;
  removeToast: (id: string) => void;
}

export function ToastManager({ toasts, removeToast }: ToastManagerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
  }>>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success", duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}
