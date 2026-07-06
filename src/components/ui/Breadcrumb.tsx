import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav className={cn('flex items-center gap-2 text-sm font-bold', className)}>
      <Link
        to={ROUTES.DASHBOARD}
        className={cn(
          'flex items-center justify-center h-8 w-8 rounded-xl border-2 border-ink/20 text-muted hover:bg-yellow/30 hover:text-ink hover:border-ink transition-all',
          location.pathname === ROUTES.DASHBOARD && 'bg-yellow/30 border-ink text-ink'
        )}
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted" />
          {item.href ? (
            <Link to={item.href} className="text-muted hover:text-ink transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-extrabold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
