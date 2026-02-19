import type { DashboardProject, OnboardingStep, MonthlyData, ProjectPhase } from '../types';

/** SDLC phases for ReverionTech (web dev & blockchain dev) */
export const PHASES: ProjectPhase[] = [
  {
    id: 1,
    name: 'Requirements Gathering and Analysis',
    description: 'Analyze, clarify, and document user needs in a Software Requirement Specification (SRS) document.',
    goal: 'Understand project scope and feasibility, preventing wasted effort later.',
  },
  {
    id: 2,
    name: 'Planning and Design',
    description: 'Define system architecture, select tech stack, design UI/UX, and draft algorithms (pseudo-code or flowcharts).',
    goal: 'Structure the application and plan for potential risks.',
  },
  {
    id: 3,
    name: 'Coding (Development or Implementation)',
    description: 'Translate design into working source code; follow coding guidelines; use IDEs, compilers, and debuggers.',
    goal: 'Build the functional components of the application.',
  },
  {
    id: 4,
    name: 'Testing and Quality Assurance',
    description: 'Check for bugs, errors, and conformity to requirements; unit testing and debugging.',
    goal: 'Ensure the software is reliable, secure, and meets quality standards.',
  },
  {
    id: 5,
    name: 'Deployment and Implementation',
    description: 'Release the tested product into production; install, configure, and make it accessible.',
    goal: 'Make the application operational.',
  },
  {
    id: 6,
    name: 'Maintenance and Support',
    description: 'Fix bugs, add features, and update the software for changing environments.',
    goal: 'Ensure longevity and relevance of the application.',
  },
];

export const dashboardProjects: DashboardProject[] = [
  {
    id: 'proj-1',
    name: 'E-Commerce Redesign',
    status: 'active',
    progress: 65,
    milestones: [
      { label: 'Discovery & Planning', date: '2025-01-15', done: true },
      { label: 'UI/UX Design', date: '2025-02-01', done: true },
      { label: 'Frontend Development', date: '2025-03-15', done: false },
      { label: 'Testing & Launch', date: '2025-04-01', done: false },
    ],
    deliverables: [
      { name: 'Wireframes', status: 'Delivered' },
      { name: 'Design System', status: 'Delivered' },
      { name: 'Homepage Build', status: 'In Progress' },
      { name: 'Product Pages', status: 'Pending' },
    ],
    activities: [
      { id: 'a1', phaseId: 1, description: 'SRS document and scope sign-off', plannedStart: '2025-01-10', plannedFinish: '2025-01-20', status: 'Completed', comments: 'Signed off' },
      { id: 'a2', phaseId: 2, description: 'System architecture and UI/UX wireframes', plannedStart: '2025-02-01', plannedFinish: '2025-02-15', status: 'Completed' },
      { id: 'a3', phaseId: 2, description: 'Design system and component specs', plannedStart: '2025-02-10', plannedFinish: '2025-02-28', status: 'In Progress' },
      { id: 'a4', phaseId: 3, description: 'Homepage and core components implementation', plannedStart: '2025-03-01', plannedFinish: '2025-03-20', status: 'In Progress' },
    ],
    dailyUpdates: [
      { id: 'u1', date: '2025-02-15', phaseId: 2, content: 'Wireframes approved. Moving to design system.', author: 'client' },
      { id: 'u2', date: '2025-02-16', phaseId: 2, content: 'Design tokens and components in Figma. Review by Wed.', author: 'developer' },
      { id: 'u3', date: '2025-02-18', phaseId: 3, content: 'Started homepage layout. Blocked on final copy.', author: 'developer' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    status: 'review',
    progress: 90,
    milestones: [
      { label: 'Requirements Gathering', date: '2024-11-01', done: true },
      { label: 'Prototype', date: '2024-12-01', done: true },
      { label: 'Development', date: '2025-02-15', done: true },
      { label: 'QA & Launch', date: '2025-03-01', done: false },
    ],
    deliverables: [
      { name: 'App Prototype', status: 'Delivered' },
      { name: 'API Integration', status: 'Delivered' },
      { name: 'Beta Build', status: 'Delivered' },
      { name: 'App Store Submission', status: 'In Progress' },
    ],
    activities: [
      { id: 'b1', phaseId: 1, description: 'Requirements doc and SRS', plannedStart: '2024-10-15', plannedFinish: '2024-11-01', status: 'Completed' },
      { id: 'b2', phaseId: 4, description: 'Unit and integration testing', plannedStart: '2025-02-01', plannedFinish: '2025-02-15', status: 'Completed' },
      { id: 'b3', phaseId: 5, description: 'App Store submission and metadata', plannedStart: '2025-02-20', plannedFinish: '2025-03-05', status: 'In Progress' },
    ],
    dailyUpdates: [
      { id: 'v1', date: '2025-02-17', phaseId: 5, content: 'Submitted for review. Waiting on metadata approval.', author: 'developer' },
    ],
  },
];

export const onboardingChecklist: OnboardingStep[] = [
  { step: 'Complete your profile', done: true },
  { step: 'Review project scope', done: true },
  { step: 'Approve design mockups', done: false },
  { step: 'Set up communication channel', done: false },
  { step: 'Upload brand assets', done: false },
];

export const analyticsData: MonthlyData[] = [
  { month: 'Sep', tasks: 12, completed: 10 },
  { month: 'Oct', tasks: 18, completed: 15 },
  { month: 'Nov', tasks: 22, completed: 20 },
  { month: 'Dec', tasks: 15, completed: 14 },
  { month: 'Jan', tasks: 25, completed: 19 },
  { month: 'Feb', tasks: 20, completed: 16 },
];
