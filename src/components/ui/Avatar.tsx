import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/helpers';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

const sizeMap = {
  xs: 'h-7 w-7 text-[10px] border',
  sm: 'h-9 w-9 text-xs border-2',
  md: 'h-11 w-11 text-sm border-2',
  lg: 'h-14 w-14 text-base border-2',
  xl: 'h-20 w-20 text-xl border-[2.5px]',
};

const colors = ['bg-primary/30', 'bg-pink/30', 'bg-yellow/40', 'bg-secondary/30', 'bg-purple/30', 'bg-accent/30'];

function getColorFromName(name: string) {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ src, name, size = 'md', className, color }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border-ink font-extrabold text-ink overflow-hidden shadow-brutal-sm',
        sizeMap[size],
        color ?? getColorFromName(name),
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
