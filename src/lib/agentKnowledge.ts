import { companyFactsBrief } from './knowledgeSearch';

const facts = companyFactsBrief();

export function withCompanyFacts(instructions: string) {
    let text = instructions
        .replace(
            'an AI-powered Web3 product engineering and smart contract studio',
            'an AI-enabled technology engineering company',
        )
        .replace(
            '- Focus: AI-powered Web3 product engineering, smart contracts, web, mobile, blockchain, and related digital product work\n',
            '- Focus: custom software, intelligent business systems, AI applications, agents, RAG, multimodal systems, cloud operations, AI governance, and technology consulting.\n',
        )
        .replace(
            '- Location context: Davao-based studio (confirm details from the site when relevant)\n',
            '- Main office: 212 N. 2nd St. Ste 100, Richmond, KY 40475, United States.\n- Second office: Davao City, Philippines.\n',
        );

    if (text.includes('## Company facts')) return text;
    const block = `\n${facts}\n`;
    const marker = '# Current time';
    const at = text.indexOf(marker);
    if (at >= 0) return text.slice(0, at) + block + text.slice(at);
    return text + block;
}
