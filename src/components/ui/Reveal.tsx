import { useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
  as?: keyof HTMLElementTagNameMap;
}

const directionClass: Record<Direction, string> = {
  up: 'reveal',
  left: 'reveal reveal--from-left',
  right: 'reveal reveal--from-right',
  scale: 'reveal reveal--scale',
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  style,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal--visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [
    directionClass[direction],
    delay > 0 ? `reveal--delay-${delay}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // @ts-expect-error -- dynamic tag with ref
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
