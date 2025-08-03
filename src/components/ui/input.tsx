import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-[#8f9294] bg-white px-3 py-2 text-sm',
        'placeholder:text-[#8f9294]',
        'focus:outline-none focus:ring-1 focus:ring-[#1f222b] focus:border-[#1f222b]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };
