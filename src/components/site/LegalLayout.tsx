import type { ReactNode } from 'react';
import { Page, Wrap, Eyebrow } from './parts';
import { LEGAL_UPDATED } from '../../data/legal';

export function LegalLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Page>
      <title>{`${title} | Reverion Tech`}</title>
      <meta name="description" content={description} />

      <section className="rv-sec dark" style={{ padding: '5rem 0 4rem' }}>
        <Wrap>
          <Eyebrow>LEGAL</Eyebrow>
          <h1 className="rv-h1" style={{ marginBottom: 20 }}>{title}</h1>
          <p style={{ fontSize: '.875rem', color: '#8fa5aa' }}>
            Last updated: <time dateTime={LEGAL_UPDATED.iso}>{LEGAL_UPDATED.label}</time>
          </p>
        </Wrap>
      </section>

      <section className="rv-sec" style={{ padding: '4rem 0 6rem' }}>
        <Wrap>
          <article className="rv-prose" style={{ maxWidth: '46rem', margin: '0 auto' }}>{children}</article>
        </Wrap>
      </section>
    </Page>
  );
}
