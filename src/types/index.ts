export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  technologies: string[];
  gradientFrom: string;
  gradientTo: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    author: string;
    role: string;
    quote: string;
  };
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface Milestone {
  label: string;
  date: string;
  done: boolean;
}

export interface Deliverable {
  name: string;
  status: 'Delivered' | 'In Progress' | 'Pending';
}

export interface DashboardProject {
  id: string;
  name: string;
  status: 'active' | 'review' | 'completed';
  progress: number;
  milestones: Milestone[];
  deliverables: Deliverable[];
}

export interface User {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role?: string;
}

export interface OnboardingStep {
  step: string;
  done: boolean;
}

export interface MonthlyData {
  month: string;
  tasks: number;
  completed: number;
}
