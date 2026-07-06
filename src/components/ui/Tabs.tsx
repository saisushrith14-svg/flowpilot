import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap border-b-2 border-ink pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-5 py-3 text-sm font-extrabold rounded-t-2xl transition-all border-2 border-b-0',
              activeTab === tab.id
                ? 'bg-yellow/30 border-ink text-ink -mb-0.5'
                : 'border-transparent text-muted hover:text-ink hover:bg-background'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
