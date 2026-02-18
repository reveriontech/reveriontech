import type { DashboardProject, OnboardingStep, MonthlyData } from '../types';

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
