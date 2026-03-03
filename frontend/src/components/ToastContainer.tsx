import React from 'react';
import { useToast } from '../hooks/useToast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium min-w-[220px] max-w-xs ${
            toast.type === 'success'
              ? 'bg-white border-violet-200 text-neutral-800'
              : toast.type === 'error'
              ? 'bg-white border-red-200 text-neutral-800'
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={16} className="text-violet-600 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.type === 'info' && <Info size={16} className="text-neutral-500 flex-shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
