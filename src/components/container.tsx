import type { ReactNode } from 'react';

type ContainerProps = {
  children?: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-(--spacing-page-x)${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
