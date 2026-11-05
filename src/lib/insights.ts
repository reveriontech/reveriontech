// Insight articles are authored in Obsidian (vault: "Reverion System" › "Reverion Tech Insights")
// and copied into src/content/insights. Each file starts with an "Article Metadata" table;
// everything after the first horizontal rule is the article body.

const files = import.meta.glob('../content/insights/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface Insight {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  readMinutes: number;
  date: string; // ISO yyyy-mm-dd
  body: string; // markdown
}

function parse(raw: string): Insight {
  const text = raw.replace(/\r\n/g, '\n');
  const meta: Record<string, string> = {};
  for (const m of text.matchAll(/^\| \*\*(.+?)\*\* \| (.*) \|$/gm)) meta[m[1]] = m[2].trim();

  const hr = text.indexOf('\n---\n');
  // Drop the drafting labels; their content stays.
  const body = (hr >= 0 ? text.slice(hr + 5) : text).replace(/^## (Opening Hook|Call to Action)\s*$/gm, '').trim();
  const slug = (meta['URL Slug'] ?? '').replace(/`/g, '').replace(/^\/?insights\//, '').replace(/\/$/, '');

  return {
    slug,
    category: meta.Category ?? '',
    title: meta.Title ?? '',
    excerpt: meta.Excerpt ?? '',
    metaTitle: meta['Meta Title'] ?? meta.Title ?? '',
    metaDescription: meta['Meta Description'] ?? meta.Excerpt ?? '',
    readMinutes: parseInt(meta['Estimated Reading Time'] ?? '', 10) || 0,
    date: meta['Suggested Publication Date'] ?? '',
    body,
  };
}

export const insights: Insight[] = Object.keys(files)
  .sort()
  .map((k) => parse(files[k]))
  .filter((a) => a.slug && a.title);

export const getInsight = (slug: string | undefined) => insights.find((a) => a.slug === slug);

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
