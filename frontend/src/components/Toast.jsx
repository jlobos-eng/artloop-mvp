import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const RING = {
  success: 'border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_18px_40px_-20px_rgba(16,185,129,0.45)]',
  error:   'border-rose-500/50    shadow-[0_0_0_1px_rgba(244,63,94,0.25),0_18px_40px_-20px_rgba(244,63,94,0.45)]',
  info:    'border-cyan-400/40    shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_18px_40px_-20px_rgba(34,211,238,0.45)]',
};

const ICON_COLOR = {
  success: 'text-emerald-400',
  error:   'text-rose-400',
  info:    'text-cyan-300',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++counter.current;
    const item = { id, type: toast.type || 'info', title: toast.title, message: toast.message };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => dismiss(id), toast.duration ?? 4500);
  }, [dismiss]);

  const value = useMemo(() => ({
    success: (title, message) => push({ type: 'success', title, message }),
    error:   (title, message) => push({ type: 'error',   title, message }),
    info:    (title, message) => push({ type: 'info',    title, message }),
  }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-[min(94vw,22rem)]">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={`toast-anim glass rounded-2xl px-4 py-3 flex items-start gap-3 ${RING[t.type]}`}
            >
              <Icon size={20} className={`${ICON_COLOR[t.type]} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                {t.title && <p className="font-semibold text-white text-sm leading-tight">{t.title}</p>}
                {t.message && <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
