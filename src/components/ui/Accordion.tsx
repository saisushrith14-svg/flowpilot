import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b-2 border-ink/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-base font-extrabold text-ink hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-5 w-5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div className={cn('overflow-hidden transition-all duration-200', open ? 'max-h-96 pb-5' : 'max-h-0')}>
        <p className="text-base text-muted leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
