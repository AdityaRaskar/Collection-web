import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  tone?: "info" | "success" | "error";
};

const ToastContext = createContext<{
  push: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (t: Omit<Toast, "id">) => {
    const toast: Toast = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      ...t,
    };
    setToasts((s) => [toast, ...s]);
    setTimeout(
      () => setToasts((s) => s.filter((x) => x.id !== toast.id)),
      4000
    );
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-sm max-w-xs break-words ${
              t.tone === "error"
                ? "bg-red-600 text-white"
                : t.tone === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
