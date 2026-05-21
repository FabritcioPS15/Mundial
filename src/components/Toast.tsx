import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[280px] max-w-sm animate-slide-in ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 border-emerald-500/50 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-red-900/95 border-red-500/50 text-red-100'
              : 'bg-gray-900/95 border-gold/50 text-gray-100'
          }`}
        >
          <span className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-red-400" />}
            {toast.type === 'info' && <Info size={18} className="text-gold" />}
          </span>
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
