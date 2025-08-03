'use client';

import * as React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

interface PlayerToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function PlayerToggle({
  pressed,
  onPressedChange,
  children,
  className,
  title,
}: PlayerToggleProps) {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={cn(
        'player-toggle wmp-control-button border border-accent/10 bg-surface/80 hover:bg-surface/60 transition-all duration-200',
        'data-[state=on]:border-accent-primary/50 data-[state=on]:bg-accent-primary/20 data-[state=on]:text-accent-primary',
        'data-[state=on]:shadow-[0_0_8px_var(--color-accent-primary)] data-[state=on]:scale-105',
        'hover:border-accent/30 hover:scale-105',
        'focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-background',
        className
      )}
      title={title}
    >
      {children}
    </Toggle>
  );
}
