import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

const cardStyle: CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  transition: 'all var(--transition-normal)',
};

const hoverableClass = 'card--hoverable';

export function Card({ children, className, hoverable = false, style, onClick }: CardProps) {
  return (
    <div
      className={`card ${hoverable ? hoverableClass : ''} ${className || ''}`}
      style={{ ...cardStyle, ...style, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
