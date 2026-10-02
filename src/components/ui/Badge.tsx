import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary/10 text-primary',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border text-muted-foreground',
  success: 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  warning: 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400',
};

const Badge = ({ variant = 'secondary', className = '', children }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
