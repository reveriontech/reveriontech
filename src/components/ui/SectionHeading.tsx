interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  highlight?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ subtitle, title, highlight, align = 'left' }: SectionHeadingProps) {
  return (
    <div style={{ textAlign: align, marginBottom: '3rem' }}>
      {subtitle && (
        <p style={{
          color: 'var(--color-accent)',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '0.75rem',
        }}>
          {subtitle}
        </p>
      )}
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        {title}{' '}
        {highlight && <span style={{ color: 'var(--color-accent)' }}>{highlight}</span>}
      </h2>
      <div style={{
        width: '60px',
        height: '3px',
        background: 'var(--color-accent)',
        borderRadius: '2px',
        margin: align === 'center' ? '0 auto' : undefined,
      }} />
    </div>
  );
}
