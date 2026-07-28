import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast) return null;
  const cls = toast.type === 'info' ? 'toast toast-sage' : toast.type === 'warning' ? 'toast toast-gold' : 'toast';
  return (
    <div className={cls}>
      <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
      <span>{toast.message}</span>
    </div>
  );
};

// Kept for import compatibility — returns null (no wavy dividers in minimal design)
export const OrganicWavyDivider = () => null;
