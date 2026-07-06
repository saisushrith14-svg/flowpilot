import { cn } from '@/utils/cn';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-bold text-ink mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-2xl border-2 border-ink bg-white px-4 py-3 text-base font-medium text-ink',
            'placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'transition-all duration-150 shadow-brutal-sm',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-semibold text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
