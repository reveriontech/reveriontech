import knowledge from '../data/chatKnowledge.json';
import { insights } from './insights';

const MISSED = 'I might have missed that, maybe its above my pay grade. Want me to connect you with our team?';

export interface KnowledgeDoc {
    id: string;
    type: string;
    title: string;
    path: string;
    questions: string[];
    text: string;
}

function plain(markdown: string) {
    return markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/[#>*_`|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function pieces(text: string, size = 900) {
    if (text.length <= size) return [text];
    const parts: string[] = [];
    let rest = text;
    while (rest.length > size) {
        const cut = rest.lastIndexOf('. ', size);
        const at = cut > 200 ? cut + 1 : size;
        parts.push(rest.slice(0, at).trim());
        rest = rest.slice(at).trim();
    }
    if (rest) parts.push(rest);
    return parts;
}

function insightDocs(): KnowledgeDoc[] {
    const catalog: KnowledgeDoc = {
        id: 'insights-catalog',
        type: 'insight',
        title: 'Insights catalog',
        path: '/insights',
        questions: ['what insights', 'which articles', 'insights page', 'topics'],
        text: insights.map((article) => (
            `${article.category}: "${article.title}". ${article.excerpt} Published ${article.date}. ${article.readMinutes} min read. https://www.reveriontech.com/insights/${article.slug}`
        )).join('\n'),
    };
    const sections = insights.flatMap((article) => {
        const blocks = article.body.split(/^## /m).map((block) => block.trim()).filter(Boolean);
        return blocks.flatMap((block, index) => {
            const [headingLine, ...rest] = block.split('\n');
            const heading = plain(headingLine);
            return pieces(plain(rest.join('\n') || heading)).map((text, part) => ({
                id: `insight-${article.slug}-${index}-${part}`,
                type: 'insight',
                title: `Insight: ${article.title} — ${heading}`,
                path: `/insights/${article.slug}`,
                questions: [article.title, article.category, heading, 'insights'],
                text: `${article.category}. ${article.title}. ${heading}. Published ${article.date}. ${text}`,
            }));
        });
    });
    return [catalog, ...sections];
}

export const knowledgeDocs: KnowledgeDoc[] = [...(knowledge.documents as KnowledgeDoc[]), ...insightDocs()];

const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'with', 'from', 'is', 'are', 'was', 'be', 'do', 'does', 'did', 'you', 'your', 'we', 'our', 'it', 'this', 'that', 'what', 'who', 'how', 'where', 'when', 'can', 'i', 'me', 'my']);

function tokens(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9.+]+/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 1 && !STOP.has(token));
}

function counts(words: string[]) {
    const map = new Map<string, number>();
    for (const word of words) map.set(word, (map.get(word) ?? 0) + 1);
    return map;
}

const indexed = knowledgeDocs.map((doc) => {
    const words = tokens(`${doc.title} ${doc.questions.join(' ')} ${doc.text}`);
    return { doc, tf: counts(words), length: words.length || 1 };
});

const docFreq = new Map<string, number>();
for (const row of indexed) {
    for (const term of row.tf.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
}

const docCount = indexed.length || 1;

function idf(term: string) {
    const df = docFreq.get(term) ?? 0;
    return Math.log((docCount + 1) / (df + 0.5));
}

function weight(tf: number, length: number, term: string) {
    return (tf / length) * idf(term);
}

export function searchKnowledge(query: string, limit = 5): KnowledgeDoc[] {
    const queryTokens = tokens(query);
    if (!queryTokens.length) return knowledgeDocs.slice(0, limit);
    const queryTf = counts(queryTokens);
    const scored = indexed.map((row) => {
        let dot = 0;
        let queryNorm = 0;
        let docNorm = 0;
        for (const [term, tf] of queryTf) {
            const qw = weight(tf, queryTokens.length, term);
            queryNorm += qw * qw;
            const dw = row.tf.has(term) ? weight(row.tf.get(term) ?? 0, row.length, term) : 0;
            dot += qw * dw;
        }
        for (const [term, tf] of row.tf) {
            const dw = weight(tf, row.length, term);
            docNorm += dw * dw;
        }
        const cosine = queryNorm && docNorm ? dot / Math.sqrt(queryNorm * docNorm) : 0;
        const haystack = `${row.doc.title} ${row.doc.questions.join(' ')}`.toLowerCase();
        const phrase = query.toLowerCase().trim();
        const boost = phrase.length > 2 && haystack.includes(phrase) ? 0.35 : 0;
        return { doc: row.doc, score: cosine + boost };
    });
    return scored
        .filter((row) => row.score > 0.02)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((row) => row.doc);
}

export function knowledgeContext(query: string, limit = 5) {
    const hits = searchKnowledge(query, limit);
    if (!hits.length) {
        return `Retrieved company records: none. If the answer is not in the company facts, reply exactly: ${MISSED}`;
    }
    const body = hits.map((doc) => `[${doc.id}] ${doc.title} (${doc.path})\n${doc.text}`).join('\n\n');
    return `Retrieved company records. Answer only from these records and the company facts. If the answer is not here, reply exactly: ${MISSED}\n\n${body}`;
}

export function companyFactsBrief() {
    const pick = (id: string) => knowledgeDocs.find((doc) => doc.id === id)?.text ?? '';
    return `## Company facts
Answer company questions only from these facts, the Insights articles in search, or search_company_knowledge results. If it is not here, reply exactly: ${MISSED} Do not describe Reverion Tech as a Web3 or smart-contract studio.
${pick('company-contact')}
${pick('team-roster')}
${pick('projects-index')}
For a specific service, person, project, insight, partner, or policy, call search_company_knowledge with the visitor's question before answering. If the visitor message already contains Retrieved company records, answer from those records and do not call the tool.
`;
}
