export function whatsappLink(text: string) {
    return `https://wa.me/rodalbores?text=${encodeURIComponent(text)}`;
}

export interface Service {
  slug: string;
  title: string;
  short: string;
  lead: string;
  cta: string;
  problems: string[];
  delivers: string[];
}

export const services: Service[] = [
  {
    slug: 'software-engineering',
    title: 'Software Engineering',
    short: 'We design and develop reliable digital products tailored to business requirements.',
    lead: 'We design and develop reliable digital products tailored to business requirements — from first release to long-term evolution.',
    cta: 'Discuss your product',
    problems: ['Outdated software', 'Disconnected business systems', 'Limited internal technical resources', 'Difficulty scaling operations'],
    delivers: ['Custom Web Applications', 'Mobile Application Development', 'Enterprise Software', 'SaaS Development', 'API Development and Integration', 'UI/UX and Product Engineering'],
  },
  {
    slug: 'intelligent-systems',
    title: 'Intelligent Business Systems',
    short: 'We build connected systems that bring business operations, data, and processes together.',
    lead: 'We build connected systems that bring business operations, data, and processes together — so teams see the whole picture.',
    cta: 'Discuss your systems',
    problems: ['Lack of business visibility', 'Inefficient administrative workflows', 'Data spread across tools', 'Manual reporting'],
    delivers: ['Business Management Systems', 'CRM and ERP Integration', 'Booking and Reservation Systems', 'Business Dashboards', 'Workflow Management', 'Reporting and Analytics', 'Custom Business Platforms'],
  },
  {
    slug: 'technology-consulting',
    title: 'Technology Consulting',
    short: 'We help leaders make better technology decisions — what to build, what to buy, and where AI fits.',
    lead: 'We help leaders make better technology decisions — what to build, what to buy, and where AI fits.',
    cta: 'Talk to our team',
    problems: ['Unclear technology roadmap', 'Uncertainty about AI adoption', "Architecture that won't scale"],
    delivers: ['System Architecture', 'Technology Strategy', 'Digital Transformation Consulting', 'Technical Due Diligence'],
  },
  {
    slug: 'ai-applications',
    title: 'AI Applications',
    short: 'We design and build AI applications that put models to work inside real products.',
    lead: 'We design and build AI applications that put models to work inside real products — from first prototype to a release customers use.',
    cta: 'Discuss an AI application',
    problems: ['A product idea that needs AI, not a demo', 'Models that work in a notebook but not in the product', 'No clear path from prototype to production'],
    delivers: ['Custom AI Applications', 'AI Features in Existing Products', 'Model Integration', 'Evaluation and Release'],
  },
  {
    slug: 'ai-native-platforms',
    title: 'AI-Native Development and Custom Platforms',
    short: 'We build platforms designed around AI from the start, shaped to how your business operates.',
    lead: 'We build platforms designed around AI from the start — custom software shaped to how your business operates, with models in the product rather than bolted on.',
    cta: 'Discuss a platform',
    problems: ['Off-the-shelf tools that do not fit the work', 'AI added after the product is already built', 'No platform your team can extend'],
    delivers: ['AI-Native Product Development', 'Custom Platforms', 'Model-Backed Workflows', 'APIs and Admin Tools'],
  },
  {
    slug: 'agents',
    title: 'Agents',
    short: 'We build agents that take action in your systems, with checkpoints where judgment matters.',
    lead: 'We build agents that plan, use tools, and complete tasks inside your systems — with human checkpoints where judgment matters.',
    cta: 'Discuss an agent',
    problems: ['The same steps still done by hand', 'Chatbots that answer but cannot act', 'No control over what an agent is allowed to do'],
    delivers: ['Task Agents', 'Tool-Using Agents', 'Multi-Agent Workflows', 'Human-in-the-Loop Controls'],
  },
  {
    slug: 'multi-agent-coordination',
    title: 'Multi-Agent Coordination and Workflow Engines',
    short: 'We build engines that coordinate multiple agents and run workflows across your systems.',
    lead: 'We build engines that coordinate multiple agents and run workflows across your systems — with routing, state, and human checkpoints.',
    cta: 'Discuss a workflow engine',
    problems: ['Work that spans several tools and hand-offs', 'Agents that cannot share a task or a result', 'No record of what ran, failed, or needs review'],
    delivers: ['Multi-Agent Coordination', 'Workflow Engines', 'Routing and State', 'Retries, Queues, and Audit Trails'],
  },
  {
    slug: 'rag',
    title: 'RAG',
    short: 'We build retrieval systems that answer from your own documents and show the source.',
    lead: 'Retrieval-augmented generation that answers from your documents, policies, and records — and shows where the answer came from.',
    cta: 'Discuss a knowledge system',
    problems: ['Answers buried in documents and inboxes', 'Models that do not know your business', 'No way to trace where an answer came from'],
    delivers: ['Knowledge Assistants', 'Document Retrieval', 'Source Citations', 'Access-Controlled Knowledge Bases'],
  },
  {
    slug: 'multimodal-systems',
    title: 'Multimodal Systems',
    short: 'We build systems that work across text, voice, image, and documents in one workflow.',
    lead: 'Systems that read, see, and listen — combining text, voice, image, and documents in one workflow.',
    cta: 'Discuss a multimodal system',
    problems: ['Information split across calls, photos, and files', 'Tools that only handle one kind of input', 'Manual review of images, audio, and documents'],
    delivers: ['Vision and Document Understanding', 'Voice and Text Interfaces', 'Image and Media Pipelines', 'Cross-Modal Workflows'],
  },
  {
    slug: 'cloud-operations',
    title: 'Cloud, DevOps, Monitoring and Automated Operations',
    short: 'We run cloud systems with automated releases, monitoring, and operations that stay reliable as you grow.',
    lead: 'We engineer cloud and DevOps so releases, monitoring, and day-to-day operations stay reliable as the system grows.',
    cta: 'Discuss operations',
    problems: ['Releases that still depend on manual steps', 'Incidents found by users, not by monitoring', 'Operations that do not scale with the product'],
    delivers: ['Cloud and DevOps', 'Monitoring and Alerting', 'Automated Operations', 'Incident Response and Runbooks'],
  },
  {
    slug: 'ai-governance',
    title: 'AI Governance, Identity, Permissions and Security',
    short: 'We put identity, permissions, and security controls around AI so the right people and systems can act.',
    lead: 'We put governance, identity, and permissions around AI — so access, actions, and data stay controlled.',
    cta: 'Discuss AI security',
    problems: ['Unclear who can use an AI system or what it can do', 'Models and agents with broader access than they need', 'No record of prompts, actions, or data use'],
    delivers: ['AI Governance', 'Identity and Access', 'Permissions and Least Privilege', 'Audit and Security Controls'],
  },
];

const service = (slug: string) => services.find((s) => s.slug === slug)!;

export const homeCapabilities = [
  { n: '01', title: service('software-engineering').title, text: service('software-engineering').short, items: service('software-engineering').delivers },
  { n: '02', title: 'AI Applications, Agents & RAG', text: 'AI applications, agents, retrieval, and multimodal systems — with human checkpoints where judgment matters.', items: ['AI Applications', 'Agents', 'Multi-Agent Coordination', 'RAG', 'Multimodal Systems'] },
  { n: '03', title: service('intelligent-systems').title, text: service('intelligent-systems').short, items: service('intelligent-systems').delivers },
  { n: '04', title: service('cloud-operations').title, text: service('cloud-operations').short, items: service('cloud-operations').delivers },
  { n: '05', title: service('ai-governance').title, text: service('ai-governance').short, items: [...service('ai-governance').delivers, ...service('technology-consulting').delivers.slice(0, 2)] },
];

export const marquee = ['Custom Software', 'AI-Native Development', 'Custom Platforms', 'AI Applications', 'Agents', 'Multi-Agent Coordination', 'Workflow Engines', 'RAG', 'Multimodal Systems', 'Business Systems', 'Cloud & DevOps', 'Monitoring', 'Automated Operations', 'AI Governance', 'Identity & Permissions', 'Technology Consulting'];

export const homeSolutions = [
  { title: 'AI Customer Support Systems', problem: 'Slow responses and repeated questions tie up staff.', solution: 'An AI assistant trained on your content, with hand-off to people.', benefit: 'Faster answers, around the clock.', tags: 'Agents · Business Systems' },
  { title: 'Intelligent Appointment Scheduling', problem: 'Bookings handled by phone and email, with no-shows.', solution: 'Online and voice booking synced to your calendar, with reminders.', benefit: 'Less admin, fuller schedules.', tags: 'Agents · Business Systems' },
  { title: 'Business Process Automation', problem: 'Manual, repetitive steps across disconnected tools.', solution: 'Orchestrated workflows that connect your systems end to end.', benefit: 'Time back for higher-value work.', tags: 'Workflow Engines' },
  { title: 'Document Processing & Extraction', problem: 'Data retyped from invoices, forms and PDFs.', solution: 'AI extraction with validation and review queues.', benefit: 'Fewer errors, faster processing.', tags: 'AI Applications' },
  { title: 'Customer & Operations Portals', problem: 'Customers and teams chase updates by email.', solution: 'Secure self-service portals connected to your data.', benefit: 'Clear status, fewer follow-ups.', tags: 'Software Engineering' },
  { title: 'Business Intelligence Dashboards', problem: 'No single view of how the business is doing.', solution: 'Dashboards that pull live data from every system.', benefit: 'Decisions made on current numbers.', tags: 'Business Systems' },
  { title: 'Custom Enterprise Applications', problem: "Off-the-shelf software that doesn't fit how you work.", solution: 'Applications engineered around your processes.', benefit: 'Software that scales with the business.', tags: 'Software Engineering · Cloud' },
  { title: 'AI Knowledge Assistants', problem: "Answers buried in documents and people's heads.", solution: 'A RAG assistant that searches your own knowledge, with sources.', benefit: 'Faster onboarding and support.', tags: 'RAG' },
];

export const solutionPages = [
  { id: 'cx', n: '01', title: 'AI Customer Experience', lead: 'AI-powered customer support, voice assistants, lead qualification, and intelligent inquiry handling.', cta: 'Discuss an AI Opportunity', problem: 'Slow responses, missed calls and repeated questions cost leads and staff time.', build: ['Support assistants', 'AI voice agents', 'Lead qualification', 'Inquiry routing & hand-off'], benefit: 'Faster answers at any hour, with people involved when it matters.', tags: 'Agents · Business Systems' },
  { id: 'ops', n: '02', title: 'Intelligent Business Operations', lead: 'Workflow automation, system orchestration, document processing, and process optimization.', cta: 'Start a Project', problem: 'Manual, repetitive work spread across disconnected tools and spreadsheets.', build: ['Workflow automation', 'System orchestration', 'Document processing', 'Process optimization'], benefit: 'Fewer manual steps and errors; teams focused on higher-value work.', tags: 'Workflow Engines · Intelligent Systems' },
  { id: 'platforms', n: '03', title: 'Digital Business Platforms', lead: 'Custom portals, management systems, booking platforms, and SaaS applications.', cta: 'Start a Project', problem: "Off-the-shelf tools that don't fit, or a product idea with no team to build it.", build: ['Customer & partner portals', 'Management systems', 'Booking platforms', 'SaaS applications'], benefit: 'Software shaped around how you operate, ready to grow with you.', tags: 'Software Engineering · Cloud & Operations' },
  { id: 'data', n: '04', title: 'Data & Decision Intelligence', lead: 'Business dashboards, reporting systems, analytics, and AI-assisted knowledge retrieval.', cta: 'Start a Project', problem: 'No single view of the business; answers buried in documents and inboxes.', build: ['Business dashboards', 'Reporting systems', 'Analytics pipelines', 'AI knowledge assistants (RAG)'], benefit: 'Decisions made on current numbers and searchable company knowledge.', tags: 'Intelligent Systems · RAG' },
  { id: 'infra', n: '05', title: 'Modern Technology Infrastructure', lead: 'Cloud migration, DevOps automation, security architecture, and infrastructure optimization.', cta: 'Start a Project', problem: 'Aging servers, risky manual deployments and security gaps.', build: ['Cloud migration', 'CI/CD & DevOps automation', 'Security architecture', 'Infrastructure optimization'], benefit: 'Reliable, secure systems that scale without surprises.', tags: 'Cloud & Operations · AI Governance' },
];

export const industries = ['Professional Services', 'Real Estate & Property Management', 'Retail & E-commerce', 'Healthcare Administration', 'Education & Training', 'Logistics & Operations', 'Government & Public Services', 'Technology Startups'];

export const process = [
  { n: '01', title: 'Discover', text: 'Understand the business, objectives, requirements, and existing processes.' },
  { n: '02', title: 'Strategize', text: 'Identify opportunities, define the architecture, and create a roadmap.' },
  { n: '03', title: 'Design', text: 'Develop user experiences, system specifications, and solution architecture.' },
  { n: '04', title: 'Engineer', text: 'Build, integrate, test, and validate the solution.' },
  { n: '05', title: 'Deploy', text: 'Launch on reliable infrastructure with sound deployment practices.' },
  { n: '06', title: 'Optimize', text: 'Monitor, maintain, measure, and continuously improve.' },
];

export const stack = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] },
  { label: 'Backend', items: ['Rust', 'Node.js', 'Python'] },
  { label: 'Database', items: ['PostgreSQL', 'MongoDB', 'Supabase'] },
  { label: 'AI', items: ['OpenAI', 'Gemini', 'Vector Databases', 'RAG Frameworks'] },
  { label: 'Infrastructure', items: ['Google Cloud', 'Cloudflare', 'Docker', 'Kubernetes'] },
  { label: 'Automation', items: ['n8n', 'APIs', 'Webhooks', 'Workflow Orchestration'] },
];

export const workflow = [
  ['INPUT', 'Business Input'],
  ['AI', 'AI Processing'],
  ['ORCHESTRATE', 'Orchestration'],
  ['WHERE NEEDED', 'Human Review'],
  ['EXECUTE', 'System Execution'],
  ['IMPROVE', 'Monitoring & Improvement'],
];

export const pillars = [
  { title: 'Intelligent Automation', text: 'Automate repetitive processes and coordinate complex workflows.' },
  { title: 'Human Oversight', text: 'Keep people involved where judgment, approval, and accountability matter.' },
  { title: 'Connected Systems', text: 'Integrate AI with existing business tools and infrastructure.' },
  { title: 'Continuous Improvement', text: 'Monitor, evaluate, and refine automated processes over time.' },
];

export const faqs = [
  { q: 'What does Reverion Tech do?', a: 'Reverion Tech is an AI-enabled technology engineering company. We design and build custom software, automate business operations with AI and workflow orchestration, and engineer secure cloud infrastructure for businesses and organizations.' },
  { q: 'Is Reverion Tech an AI company?', a: 'Reverion Tech is a technology engineering company that uses AI as one capability across its services. We also provide software engineering, business systems, cloud and automated operations, AI governance and security, and technology consulting.' },
  { q: 'Where is Reverion Tech located?', a: 'Our main office is at 212 N. 2nd St. Ste 100, Richmond, KY 40475, United States. We also have an office in Davao City, Philippines, and work with clients locally and internationally.' },
  { q: 'Does Reverion Tech build AI agents and automation?', a: 'Yes. We build AI agents and assistants, AI voice agents, document processing, retrieval-augmented generation (RAG) knowledge assistants and workflow automation, with human review added where risk, context or business rules require it.' },
  { q: 'Which industries does Reverion Tech work with?', a: 'We work with professional services, real estate and property management, retail and e-commerce, healthcare administration, education and training, logistics and operations, government and public services, and technology startups.' },
  { q: 'How do I start a project with Reverion Tech?', a: 'Send a project inquiry through our contact page or email hello@reveriontech.com. We review it, arrange a short discovery call, and then send a proposal covering approach, timeline and cost.' },
];

export const projectCategories = ['Software Engineering', 'Agents', 'Business Systems', 'Cloud Infrastructure', 'Enterprise Solutions'];

export interface SiteProject {
  slug: string;
  client: string;
  category: string;
  title: string;
  summary: string;
  /** Hero lead on the case-study page; falls back to summary. */
  lead?: string;
  industry?: string;
  tech: string[];
  image?: string;
  concept?: boolean;
  /** Placeholder ground when there is no image. */
  ground?: 'navy' | 'teal';
  /** Home featured card: show the screenshot and a one-line summary instead of challenge/solution. */
  featuredImage?: boolean;
  featuredSummary?: string;
  challenge: string;
  solution: string;
  href?: string;
}

export const siteProjects: SiteProject[] = [
  {
    slug: 'prime-grand',
    client: 'Prime Grand',
    category: 'Software Engineering',
    title: 'Premium Property Reservations',
    summary: 'Real-time lot inventory, instant reservations, and interactive 3D property visualization for agents, brokers, and buyers.',
    lead: 'A property platform where agents, brokers, and buyers find lots, reserve them, and explore the site plan in 3D.',
    industry: 'Real Estate',
    featuredImage: true,
    featuredSummary: 'Real-time lot inventory, instant reservations, and an interactive 3D site plan for agents, brokers, and buyers.',
    tech: [],
    image: '/projects/prime-grand.png',
    href: 'https://prime-grand.com',
    challenge: 'Agents and buyers needed a live view of available lots and a way to reserve them without tracking inventory by hand.',
    solution: 'A platform with live lot inventory, instant reservations, and an interactive 3D site plan.',
  },
  {
    slug: 'talinoed',
    client: 'TalinoEd',
    category: 'Business Systems',
    title: 'Classroom Management System',
    summary: 'Attendance, grades, nutrition, and student records in one platform for educators.',
    lead: 'A classroom platform that keeps attendance, grades, nutrition, and student records in one place.',
    industry: 'Education',
    featuredImage: true,
    featuredSummary: 'Attendance, grades, nutrition, and student records in one platform for educators.',
    tech: ['Rust', 'PostgreSQL', 'React'],
    image: '/projects/talinoed.png',
    href: 'https://talinoed.com',
    challenge: 'Educators were tracking attendance, grades, nutrition, and student records in separate places.',
    solution: 'One classroom system that brings attendance, grades, nutrition, and student records together.',
  },
  {
    slug: 'prime-lendrow',
    client: 'Prime LendRow',
    category: 'Business Systems',
    title: 'Stellar Lending Workspace',
    summary: 'KYC, lending, borrowing, repayment, and portfolio insight in one workspace for borrowers and lenders.',
    lead: 'A Stellar-native workspace where borrowers and lenders handle KYC, loans, repayment, and portfolio insight.',
    industry: 'Lending',
    featuredImage: true,
    featuredSummary: 'KYC, lending, borrowing, repayment, and portfolio insight in one Stellar-native workspace.',
    tech: ['Stellar'],
    image: '/projects/prime-lendrow.png',
    href: 'https://primelendrow.com',
    challenge: 'Borrowers and lenders needed KYC, loans, repayment, and portfolio insight in one place.',
    solution: 'A Stellar-native workspace with deposit-backed, XLM collateral-backed, and guarantor-backed loans.',
  },
  {
    slug: 'paddlq',
    client: 'PaddlQ',
    category: 'Software Engineering',
    title: 'Pickleball Community',
    summary: 'Find courts, join open plays, compete in tournaments, and connect with players nearby.',
    lead: 'A community platform for the Philippines’ pickleball players to find courts, open plays, and tournaments.',
    industry: 'Sports',
    image: '/projects/paddlq.png',
    tech: [],
    href: 'https://paddlq.com',
    challenge: 'Players needed one place to find courts, join open plays, and enter tournaments.',
    solution: 'A community platform for courts, open plays, tournaments, and nearby players.',
  },
  {
    slug: 'thessalieh-property',
    client: 'Thessalieh Property',
    category: 'Software Engineering',
    title: 'Land Parcel Portal',
    summary: 'A member portal for premium land parcels across Thessaloniki, Chalkidiki, and Northern Greece.',
    lead: 'A signed-in portal for buyers of premium land parcels across Thessaloniki, Chalkidiki, and Northern Greece.',
    industry: 'Real Estate',
    image: '/projects/thessalieh-property.png',
    tech: [],
    href: 'https://thessalieh-property.reveriontech.com',
    challenge: 'Buyers needed a private place to access land parcels across Northern Greece.',
    solution: 'A member portal for premium parcels in Thessaloniki, Chalkidiki, and Northern Greece.',
  },
  {
    slug: 'eduseal',
    client: 'EduSeal',
    category: 'Business Systems',
    title: 'Document Verification',
    summary: 'Document verification for EduSeal.',
    industry: 'Education',
    tech: ['React', 'Node.js', 'Blockchain'],
    image: '/projects/EduSeal.png',
    href: 'https://eduseal-verify.com',
    challenge: 'Institutions needed a way to confirm that issued documents are authentic.',
    solution: 'We built EduSeal so documents can be checked against a verification record.',
  },
  {
    slug: 'reverionlabs',
    client: 'Reverion Labs',
    category: 'Software Engineering',
    title: 'Applied Research',
    summary: 'The public site for Reverion Tech’s R&D division, covering applied research in AI, autonomous platforms, quantum technologies, and secure communications.',
    lead: 'A research site for Reverion Labs, the advanced R&D division of Reverion Tech.',
    industry: 'Research',
    image: '/projects/reverionlabs.png',
    tech: [],
    href: 'https://reverionlabs.com',
    challenge: 'The R&D division needed a public home for its research, projects, and partnership inquiries.',
    solution: 'A site covering research, projects, technology, news, careers, and partnership inquiries.',
  },
  {
    slug: 'waste2earn',
    client: 'Waste2Earn',
    category: 'Business Systems',
    title: 'Waste Management Platform',
    summary: 'A platform connecting waste collectors and recyclers, with route mapping and an earnings dashboard.',
    industry: 'Sustainability',
    featuredImage: true,
    featuredSummary: 'A platform connecting waste collectors and recyclers, with route mapping and an earnings dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    image: '/projects/waste2earn.png',
    href: 'https://waste2earn.com',
    challenge: 'Households, collectors and recycling facilities needed one place for logistics, payouts and impact tracking.',
    solution: 'A web app with route mapping, a data layer for collections, and a live earnings dashboard for collectors.',
  },
  {
    slug: 'log-house',
    client: 'Log House',
    category: 'Software Engineering',
    title: 'Wellness Collection',
    summary: 'Saunas, indoor saunas, cold plunges, and hot tubs for the Log House wellness collection.',
    lead: 'A wellness site for Log House saunas, cold plunges, and hot tubs, including the Cube garden sauna.',
    industry: 'Wellness',
    tech: [],
    image: '/projects/loghouse-wellness.jpg',
    href: 'https://loghouse.co.uk',
    challenge: 'Log House needed a site that presents saunas, cold plunges, and hot tubs as one wellness collection.',
    solution: 'A collection site for heat, cold, and water, with visits and a way to plan a space.',
  },
  {
    slug: 'spa-saunas',
    client: 'Spa & Saunas',
    category: 'Software Engineering',
    title: 'Spa & Saunas',
    summary: 'Public website for Spa & Saunas.',
    industry: 'Hospitality',
    tech: [],
    href: 'https://spasaunas.co.uk',
    challenge: 'Spa & Saunas needed a public website for the business.',
    solution: 'We designed and built the Spa & Saunas website.',
  },
  {
    slug: 'lime-ph',
    client: 'Lime PH',
    category: 'Software Engineering',
    title: 'Solar for Homes and Businesses',
    summary: 'A site for a Philippine solar provider that supplies and installs panels for homes and businesses.',
    lead: 'Lime PH supplies and installs solar systems for Filipino homes and businesses, with quotes, assessments, and a knowledge hub.',
    industry: 'Energy',
    image: '/projects/lime-ph.png',
    tech: [],
    challenge: 'Homeowners and businesses needed a clear way to explore solar, request a quote, and book an assessment.',
    solution: 'A site for home and business solar, with free quotes, assessments, and a knowledge hub.',
  },
  {
    slug: 'web3-davao',
    client: 'Web3 Davao',
    category: 'Software Engineering',
    title: 'Builder Community',
    summary: 'A guild for developers and founders in the Davao Region learning Web3, shipping projects, and passing on preseed grants.',
    lead: 'A membership site for Web3 builders in the Davao Region, with the guild, members, grants, and applications to join.',
    industry: 'Web3',
    image: '/projects/web3-davao.png',
    tech: [],
    challenge: 'Developers and founders in the Davao Region needed a public guild for learning, projects, and grants.',
    solution: 'A community site for the guild, members, grants, the manifesto, and applications to join.',
  },
  {
    slug: 'smart-sparrow',
    client: 'Smart Sparrow',
    category: 'Business Systems',
    title: 'Digital Learning',
    summary: 'A digital learning platform with a studio, solutions, and a public site for the product.',
    lead: 'Smart Sparrow’s site for the next wave in digital learning, with the platform, studio, and solutions.',
    industry: 'Education',
    image: '/projects/smart-sparrow.png',
    tech: [],
    href: 'https://smartsparrow.com',
    challenge: 'Smart Sparrow needed a public home for its digital learning platform, studio, and solutions.',
    solution: 'A site that introduces the platform, studio, solutions, and ways to discover the product.',
  },
  {
    slug: 'prime-vpn',
    client: 'Prime VPN',
    category: 'Software Engineering',
    title: 'Private VPN',
    summary: 'A private, secured VPN application built natively in Rust.',
    lead: 'A private VPN application, built natively in Rust, for secured connections.',
    industry: 'Security',
    tech: ['Rust'],
    challenge: 'People needed a private VPN that kept their connection secured.',
    solution: 'A secured VPN application built natively in Rust.',
  },
  {
    slug: 'private-video-calls',
    client: 'Private Video Calls',
    category: 'Software Engineering',
    title: 'HIPAA-Compliant Video Calls',
    summary: 'A secured, HIPAA-compliant application for private video calls.',
    lead: 'A private video-call application built to stay secured and HIPAA compliant.',
    industry: 'Healthcare',
    tech: [],
    challenge: 'Care teams needed private video calls that stayed secured and HIPAA compliant.',
    solution: 'A secured private video-call application built for HIPAA-compliant use.',
  },
];

export const insightTopics = ['AI in Business Operations', 'Intelligent Automation', 'Software Engineering', 'Digital Transformation', 'Cloud Infrastructure', 'Cybersecurity', 'Emerging Technology'];

export const values = ['Engineering Excellence', 'Innovation with Purpose', 'Integrity and Accountability', 'Security by Design', 'Human-Centered Technology', 'Continuous Improvement'];

export const industriesForm = ['Professional Services', 'Real Estate & Property Management', 'Retail & E-commerce', 'Healthcare Administration', 'Education & Training', 'Logistics & Operations', 'Government & Public Services', 'Technology Startup', 'Other'];
