import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="mb-6 rounded-3xl border-2 border-ink bg-yellow/30 p-6 text-ink shadow-brutal">{icon}</div>
      <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
      <p className="mt-3 max-w-md text-base text-muted leading-relaxed">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
