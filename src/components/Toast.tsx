import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start justify-between p-4 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-start gap-3">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#A04A30] shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#A04A30] shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#E0DED7] shrink-0 mt-0.5" />}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">{toast.title}</h4>
              {toast.message && <p className="text-xs font-serif italic text-[#E0DED7] mt-1 leading-relaxed">{toast.message}</p>}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#888378] hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

