import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface StatCounterProps {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

export function StatCounter({ value, suffix, label, icon }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const isFloat = !Number.isInteger(value);

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;
            setDisplayValue(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '0.75rem', color: 'var(--color-accent)' }}>
        <Icon name={icon} size={40} />
      </div>
      <p style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--color-text)',
        marginBottom: '0.5rem',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        color: 'var(--color-accent)',
        lineHeight: 1,
      }}>
        {displayValue}{suffix}
      </p>
    </div>
  );
}
