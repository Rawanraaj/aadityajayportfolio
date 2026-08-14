'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 lg:mb-8',
        className
      )}
    >
      <div className="space-y-1.5">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
