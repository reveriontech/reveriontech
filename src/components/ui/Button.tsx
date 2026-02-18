import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
type ButtonAsLink = BaseProps & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.4rem 1rem', fontSize: '0.85rem' },
  md: { padding: '0.65rem 1.5rem', fontSize: '0.95rem' },
  lg: { padding: '0.85rem 2rem', fontSize: '1.05rem' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-accent)',
    color: 'var(--color-bg)',
    border: '2px solid var(--color-accent)',
    fontWeight: 600,
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-accent)',
    border: '2px solid var(--color-accent)',
    fontWeight: 600,
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-accent)',
    border: '2px solid transparent',
    fontWeight: 500,
  },
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'all var(--transition-normal)',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
  fontFamily: 'inherit',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, ...rest } = props;
  const style = { ...baseStyle, ...variantStyles[variant], ...sizeStyles[size] };

  if ('to' in rest && rest.to) {
    const { to, ...linkRest } = rest;
    return <Link to={to} style={style} className={`btn btn--${variant} ${className || ''}`} {...linkRest} />;
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button style={style} className={`btn btn--${variant} ${className || ''}`} {...buttonRest} />;
}
