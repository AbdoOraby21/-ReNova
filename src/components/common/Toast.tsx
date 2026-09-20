import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300">
      {type === 'success' ? (
        <CheckCircle className="text-[var(--primary)]" size={20} />
      ) : (
        <XCircle className="text-[var(--danger)]" size={20} />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-[var(--bg-item)] rounded-md transition-colors">
        <X size={16} className="text-[var(--text-muted)]" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const ToastContainer = () => (
    toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null
  );

  return { showToast, ToastContainer };
};

export default Toast;
