import type { Service } from '../types';

export const services: Service[] = [
  {
    id: 'web-development',
    icon: 'code',
    title: 'Website Design',
    description: 'Custom, modern websites designed, built, and deployed for your brand.',
    features: ['React / Next.js', 'Progressive Web Apps', 'E-commerce Solutions'],
  },
  {
    id: 'mobile-apps',
    icon: 'mobile',
    title: 'Mobile & Desktop App',
    description: 'Cross-platform mobile and desktop apps from idea to launch.',
    features: ['React Native', 'Flutter', 'Native iOS & Android'],
  },
  {
    id: 'ui-ux-design',
    icon: 'design',
    title: 'UI & UX Design',
    description: 'User-centered interfaces that look sharp and convert visitors into customers.',
    features: ['User Research', 'Wireframing', 'Prototyping'],
  },
  {
    id: 'editing-photo',
    icon: 'image',
    title: 'Editing Photo',
    description: 'Professional photo editing and on-brand graphics for web and social.',
    features: ['Photo Retouching', 'Brand Assets', 'Social Media Graphics'],
  },
  {
    id: 'cloud-architecture',
    icon: 'cloud',
    title: 'Cloud Architecture',
    description: 'Secure, scalable cloud setups on AWS, Azure, or GCP.',
    features: ['AWS / Azure / GCP', 'Serverless Architecture', 'CI/CD Pipelines'],
  },
  {
    id: 'ai-integration',
    icon: 'ai',
    title: 'AI Integration',
    description: 'Practical AI integrations to automate work and unlock insights.',
    features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
  },
];
