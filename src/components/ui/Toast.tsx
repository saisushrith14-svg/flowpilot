import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-secondary/20 border-ink',
  error: 'bg-pink/25 border-ink',
  info: 'bg-primary/15 border-ink',
  warning: 'bg-yellow/30 border-ink',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-5 py-4 shadow-brutal min-w-[320px]',
                styles[toast.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-ink" />
              <p className="flex-1 text-sm font-bold text-ink">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
