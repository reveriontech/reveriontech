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

/** SDLC phase for web/blockchain dev (client + developer) */
export interface ProjectPhase {
  id: number;
  name: string;
  description: string;
  goal?: string;
}

/** Activity within a phase */
export interface ProjectActivity {
  id: string;
  phaseId: number;
  description: string;
  plannedStart: string;
  plannedFinish: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  comments?: string;
}

/** Daily update entry (client or developer) */
export interface DailyUpdate {
  id: string;
  date: string;
  phaseId: number;
  content: string;
  author: 'client' | 'developer';
}

export interface DashboardProject {
  id: string;
  name: string;
  status: 'active' | 'review' | 'completed';
  progress: number;
  milestones: Milestone[];
  deliverables: Deliverable[];
  activities?: ProjectActivity[];
  dailyUpdates?: DailyUpdate[];
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

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  description: string;
  timeline: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
}
