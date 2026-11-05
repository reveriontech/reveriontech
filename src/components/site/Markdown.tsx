import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

// A small renderer for the subset of Markdown the insight articles use:
// ## / ### headings, paragraphs, - and 1. lists, pipe tables, --- rules,
// **bold**, *italic*, `code` and [links](url). No raw HTML is ever rendered.

function inline(text: string, key = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[2] !== undefined) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3] !== undefined) out.push(<em key={k}>{inline(m[3], k)}</em>);
    else if (m[4] !== undefined) out.push(<code key={k}>{m[4]}</code>);
    else {
      const href = m[6];
      const label = inline(m[5], k);
      out.push(href.startsWith('/')
        ? <Link key={k} to={href}>{label}</Link>
        : <a key={k} href={href} target="_blank" rel="noopener noreferrer">{label}</a>);
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const k = `b${i}`;
    if (!line.trim()) { i++; continue; }

    const h = line.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const level = Math.min(Math.max(h[1].length, 2), 4);
      const H = `h${level}` as 'h2' | 'h3' | 'h4';
      blocks.push(<H key={k}>{inline(h[2], k)}</H>);
      i++;
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) { blocks.push(<hr key={k} />); i++; continue; }

    if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const [head, , ...body] = rows;
      blocks.push(
        <div key={k} className="rv-prose__table">
          <table>
            <thead><tr>{cells(head).map((c, j) => <th key={j}>{inline(c, `${k}h${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{cells(r).map((c, j) => <td key={j}>{inline(c, `${k}r${ri}c${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    const isUl = /^- /.test(line);
    const isOl = /^\d+\. /.test(line);
    if (isUl || isOl) {
      const items: string[] = [];
      const pat = isUl ? /^- (.*)$/ : /^\d+\. (.*)$/;
      while (i < lines.length && pat.test(lines[i])) items.push(lines[i++].match(pat)![1]);
      const L = isUl ? 'ul' : 'ol';
      blocks.push(<L key={k}>{items.map((t, j) => <li key={j}>{inline(t, `${k}-${j}`)}</li>)}</L>);
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4} |- |\d+\. |\||-{3,}$)/.test(lines[i])) para.push(lines[i++].trim());
    if (!para.length) para.push(lines[i++].trim()); // never stall on an unrecognised line
    blocks.push(<p key={k}>{inline(para.join(' '), k)}</p>);
  }

  return <div className="rv-prose">{blocks}</div>;
}
