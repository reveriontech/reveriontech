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
    slug: 'ai-automation',
    title: 'AI & Intelligent Automation',
    short: 'We use artificial intelligence to reduce repetitive work and enable smarter business processes.',
    lead: 'Intelligent automation, engineered around your business. We use AI to reduce repetitive work and enable smarter processes — with human checkpoints where judgment matters.',
    cta: 'Discuss an AI opportunity',
    problems: ['Repetitive manual operations', 'Poor customer response times', 'Expensive, time-consuming processes', 'Uncertainty about where to adopt AI'],
    delivers: ['AI Agents and Assistants', 'AI Voice Agents', 'Intelligent Workflow Automation', 'AI-Powered Customer Support', 'Document Intelligence', 'Retrieval-Augmented Generation', 'AI Integration and Implementation', 'Multi-Agent Orchestration'],
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
    slug: 'cloud-devops',
    title: 'Cloud & DevOps Engineering',
    short: 'We engineer infrastructure designed for reliability, performance, and scalability.',
    lead: 'We engineer infrastructure designed for reliability, performance, and scalability — and automate how software ships.',
    cta: 'Discuss your infrastructure',
    problems: ['Outdated infrastructure', 'Slow, risky releases', 'Unpredictable performance', 'Rising hosting costs'],
    delivers: ['Cloud Architecture', 'Cloud Migration and Deployment', 'Infrastructure as Code', 'CI/CD Pipelines', 'Containerization', 'Monitoring and Observability', 'Performance Optimization'],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    short: 'We help organizations build and run more secure digital environments.',
    lead: 'Security by design: we help organizations build and run more secure digital environments.',
    cta: 'Discuss security',
    problems: ['Unknown vulnerabilities', 'Security added as an afterthought', 'No clear security ownership'],
    delivers: ['Security Architecture', 'Application Security', 'Cybersecurity Consulting', 'Technical Audits'],
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
];

export const homeCapabilities = [
  { n: '01', title: 'Software Engineering', text: services[0].short, items: services[0].delivers },
  { n: '02', title: 'AI & Intelligent Automation', text: 'We use artificial intelligence to reduce repetitive work, improve operational efficiency, and enable smarter business processes.', items: services[1].delivers },
  { n: '03', title: 'Intelligent Business Systems', text: services[2].short, items: services[2].delivers },
  { n: '04', title: 'Cloud & DevOps Engineering', text: services[3].short, items: ['Cloud Architecture', 'Cloud Deployment', 'Infrastructure as Code', 'CI/CD Pipelines', 'Containerization', 'System Monitoring', 'Performance Optimization'] },
  {
    n: '05',
    title: 'Cybersecurity & Technology Consulting',
    text: 'We help organizations make better technology decisions and develop more secure digital environments.',
    items: [...services[4].delivers, ...services[5].delivers.slice(0, 3)],
  },
];

export const marquee = ['Custom Software', 'AI Agents', 'Workflow Automation', 'Business Systems', 'Cloud & DevOps', 'Cybersecurity', 'Technology Consulting'];

export const homeSolutions = [
  { title: 'AI Customer Support Systems', problem: 'Slow responses and repeated questions tie up staff.', solution: 'An AI assistant trained on your content, with hand-off to people.', benefit: 'Faster answers, around the clock.', tags: 'AI & Automation · Business Systems' },
  { title: 'Intelligent Appointment Scheduling', problem: 'Bookings handled by phone and email, with no-shows.', solution: 'Online and voice booking synced to your calendar, with reminders.', benefit: 'Less admin, fuller schedules.', tags: 'AI & Automation · Business Systems' },
  { title: 'Business Process Automation', problem: 'Manual, repetitive steps across disconnected tools.', solution: 'Orchestrated workflows that connect your systems end to end.', benefit: 'Time back for higher-value work.', tags: 'AI & Automation' },
  { title: 'Document Processing & Extraction', problem: 'Data retyped from invoices, forms and PDFs.', solution: 'AI extraction with validation and review queues.', benefit: 'Fewer errors, faster processing.', tags: 'AI & Automation' },
  { title: 'Customer & Operations Portals', problem: 'Customers and teams chase updates by email.', solution: 'Secure self-service portals connected to your data.', benefit: 'Clear status, fewer follow-ups.', tags: 'Software Engineering' },
  { title: 'Business Intelligence Dashboards', problem: 'No single view of how the business is doing.', solution: 'Dashboards that pull live data from every system.', benefit: 'Decisions made on current numbers.', tags: 'Business Systems' },
  { title: 'Custom Enterprise Applications', problem: "Off-the-shelf software that doesn't fit how you work.", solution: 'Applications engineered around your processes.', benefit: 'Software that scales with the business.', tags: 'Software Engineering · Cloud' },
  { title: 'AI Knowledge Assistants', problem: "Answers buried in documents and people's heads.", solution: 'A RAG assistant that searches your own knowledge, with sources.', benefit: 'Faster onboarding and support.', tags: 'AI & Automation' },
];

export const solutionPages = [
  { id: 'cx', n: '01', title: 'AI Customer Experience', lead: 'AI-powered customer support, voice assistants, lead qualification, and intelligent inquiry handling.', cta: 'Discuss an AI Opportunity', problem: 'Slow responses, missed calls and repeated questions cost leads and staff time.', build: ['Support assistants', 'AI voice agents', 'Lead qualification', 'Inquiry routing & hand-off'], benefit: 'Faster answers at any hour, with people involved when it matters.', tags: 'AI & Automation · Business Systems' },
  { id: 'ops', n: '02', title: 'Intelligent Business Operations', lead: 'Workflow automation, system orchestration, document processing, and process optimization.', cta: 'Start a Project', problem: 'Manual, repetitive work spread across disconnected tools and spreadsheets.', build: ['Workflow automation', 'System orchestration', 'Document processing', 'Process optimization'], benefit: 'Fewer manual steps and errors; teams focused on higher-value work.', tags: 'AI & Automation · Intelligent Systems' },
  { id: 'platforms', n: '03', title: 'Digital Business Platforms', lead: 'Custom portals, management systems, booking platforms, and SaaS applications.', cta: 'Start a Project', problem: "Off-the-shelf tools that don't fit, or a product idea with no team to build it.", build: ['Customer & partner portals', 'Management systems', 'Booking platforms', 'SaaS applications'], benefit: 'Software shaped around how you operate, ready to grow with you.', tags: 'Software Engineering · Cloud & DevOps' },
  { id: 'data', n: '04', title: 'Data & Decision Intelligence', lead: 'Business dashboards, reporting systems, analytics, and AI-assisted knowledge retrieval.', cta: 'Start a Project', problem: 'No single view of the business; answers buried in documents and inboxes.', build: ['Business dashboards', 'Reporting systems', 'Analytics pipelines', 'AI knowledge assistants (RAG)'], benefit: 'Decisions made on current numbers and searchable company knowledge.', tags: 'Intelligent Systems · AI & Automation' },
  { id: 'infra', n: '05', title: 'Modern Technology Infrastructure', lead: 'Cloud migration, DevOps automation, security architecture, and infrastructure optimization.', cta: 'Start a Project', problem: 'Aging servers, risky manual deployments and security gaps.', build: ['Cloud migration', 'CI/CD & DevOps automation', 'Security architecture', 'Infrastructure optimization'], benefit: 'Reliable, secure systems that scale without surprises.', tags: 'Cloud & DevOps · Cybersecurity' },
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
  { q: 'Is Reverion Tech an AI company?', a: 'Reverion Tech is a technology engineering company that uses AI as one capability across its services. We also provide software engineering, business systems, cloud and DevOps engineering, cybersecurity, and technology consulting.' },
  { q: 'Where is Reverion Tech located?', a: 'Our main office is at 212 N. 2nd St. Ste 100, Richmond, KY 40475, United States. We also have an office in Davao City, Philippines, and work with clients locally and internationally.' },
  { q: 'Does Reverion Tech build AI agents and automation?', a: 'Yes. We build AI agents and assistants, AI voice agents, document processing, retrieval-augmented generation (RAG) knowledge assistants and workflow automation, with human review added where risk, context or business rules require it.' },
  { q: 'Which industries does Reverion Tech work with?', a: 'We work with professional services, real estate and property management, retail and e-commerce, healthcare administration, education and training, logistics and operations, government and public services, and technology startups.' },
  { q: 'How do I start a project with Reverion Tech?', a: 'Send a project inquiry through our contact page or email hello@reveriontech.com. We review it, arrange a short discovery call, and then send a proposal covering approach, timeline and cost.' },
];

export const projectCategories = ['Software Engineering', 'AI & Automation', 'Business Systems', 'Cloud Infrastructure', 'Enterprise Solutions'];

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
    slug: 'findarchi',
    client: 'FindArchi',
    category: 'Software Engineering',
    title: 'Architecture Discovery Platform',
    summary: 'A marketplace listing architects by specialization and location, with an enquiry pipeline for clients and architects.',
    lead: 'A marketplace that helps clients find architects by specialization and location — and turns searches into enquiries.',
    industry: 'Professional Services',
    featuredImage: true,
    featuredSummary: 'A marketplace listing architects by specialization and location, with search filters, profiles and an enquiry pipeline.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    image: '/projects/findarchi.png',
    href: 'https://findarchi.iteapp.site/LandingPage.php',
    challenge: 'FindArchi needed a marketplace-style platform to list architects by specialisation and location, with a seamless client enquiry pipeline.',
    solution: 'We built a PHP/MySQL platform with advanced search filters, architect profile pages, and an enquiry management system for both clients and architects.',
  },
  {
    slug: 'talinoed',
    client: 'TalinoEd',
    category: 'Business Systems',
    title: 'Smart Academic Monitoring System',
    summary: 'Automated attendance, grade computation and performance tracking for basic education.',
    industry: 'Education',
    tech: ['Rust', 'PostgreSQL', 'React'],
    image: '/projects/talinoed.png',
    challenge: 'Schools computing grades by hand, tracking attendance on paper, and keeping fragmented records.',
    solution: 'An automated system that records attendance, computes averages and determines final grades.',
  },
  {
    slug: 'eventwise',
    client: 'EventWise',
    category: 'Software Engineering',
    title: 'Event Management Landing Page',
    summary: 'A responsive landing page with a tiered pricing showcase and integrated lead capture.',
    industry: 'Events',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    image: '/projects/eventwise.png',
    href: 'https://eventwise.iteapp.site/landing.php',
    challenge: 'EventWise needed a professional landing page that communicated their value proposition and drove sign-ups.',
    solution: 'We designed and built a responsive PHP/HTML landing page with animated sections, a tiered pricing showcase, and an integrated lead capture form.',
  },
  {
    slug: 'splendors',
    client: 'Splendors International',
    category: 'Software Engineering',
    title: 'Splendors International Website',
    summary: 'A website and member system for a direct-selling company, supporting fast payouts and real-time notifications.',
    industry: 'Direct Selling',
    tech: ['React', 'Next.js', 'Node.js', 'AWS'],
    image: '/projects/splendors.png',
    href: 'https://splendorsintl.com/',
    challenge: 'Distributors struggled with slow returns, unclear compensation plans, and minimal support systems.',
    solution: 'A daily payout system with 24/7 transaction capability and real-time notifications, so members receive earnings promptly and transparently.',
  },
  {
    slug: 'ai-booking-assistant',
    client: 'Inquiry & Booking Assistant',
    category: 'AI & Automation',
    title: 'AI Inquiry & Booking Assistant',
    summary: 'A voice and chat agent that answers from a company knowledge base, books appointments, and escalates to staff.',
    tech: ['Next.js', 'Python', 'OpenAI', 'n8n'],
    concept: true,
    challenge: 'A service business misses calls and answers the same questions all day.',
    solution: "A voice and chat agent that answers from the company's knowledge base, books appointments, and escalates to staff when needed.",
  },
  {
    slug: 'operations-dashboard',
    client: 'Operations Dashboard',
    category: 'Business Systems',
    title: 'Unified Operations Dashboard',
    summary: 'One live view of sales, bookings and support, pulling data from existing CRM and accounting tools.',
    tech: ['Next.js', 'PostgreSQL', 'Supabase', 'APIs'],
    concept: true,
    ground: 'teal',
    challenge: 'Leaders piece together performance from CRM, accounting and support tools by hand.',
    solution: 'A single dashboard that pulls live data from existing tools through their APIs and keeps one current picture of the business.',
  },
];

export const insightTopics = ['AI in Business Operations', 'Intelligent Automation', 'Software Engineering', 'Digital Transformation', 'Cloud Infrastructure', 'Cybersecurity', 'Emerging Technology'];

export const values = ['Engineering Excellence', 'Innovation with Purpose', 'Integrity and Accountability', 'Security by Design', 'Human-Centered Technology', 'Continuous Improvement'];

export const industriesForm = ['Professional Services', 'Real Estate & Property Management', 'Retail & E-commerce', 'Healthcare Administration', 'Education & Training', 'Logistics & Operations', 'Government & Public Services', 'Technology Startup', 'Other'];
