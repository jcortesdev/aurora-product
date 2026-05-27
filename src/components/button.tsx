import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background) ' +
  'disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-(--color-accent) text-(--color-accent-foreground) hover:not-disabled:bg-(--color-accent-hover)',
  secondary:
    'border border-(--color-border) bg-transparent text-(--color-text-primary) hover:not-disabled:bg-(--color-surface)',
  ghost:
    'bg-transparent text-(--color-text-secondary) hover:not-disabled:bg-(--color-surface) hover:not-disabled:text-(--color-text-primary)',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const composed = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');

  return (
    <button type={type} className={composed} {...rest}>
      {children}
    </button>
  );
}
