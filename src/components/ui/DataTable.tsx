import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface DataTableProps<T> {
  columns: {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
  }[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-3xl border-2 border-ink shadow-brutal', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-ink bg-yellow/15">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-ink', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'border-b border-ink/10 last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-yellow/10'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-5 py-4 font-medium', col.className)}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
