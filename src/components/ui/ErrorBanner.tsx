import { cn } from '@/utils/cn';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBanner({ message, onDismiss, className }: ErrorBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border-2 border-ink bg-pink/20 px-4 py-3 text-sm font-semibold text-ink shadow-brutal-sm',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 rounded-lg p-1 hover:bg-white/50">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
