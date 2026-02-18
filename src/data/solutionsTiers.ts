export interface SolutionTier {
  id: string;
  name: string;
  subtitle: string;
  recommended?: boolean;
  features: string[];
  ctaText: string;
  ctaTo: string;
  ctaVariant: 'primary' | 'outline';
  illustration: 'starter' | 'growth' | 'enterprise';
}

export const solutionsTiers: SolutionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'For teams getting started with smart tools',
    recommended: false,
    features: [
      'Up to 3 projects',
      'Core analytics dashboard',
      'Email support',
      'Basic integrations',
      'Monthly reports',
      'Community access',
    ],
    ctaText: 'Get Started',
    ctaTo: '/contact?tier=starter',
    ctaVariant: 'outline',
    illustration: 'starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    subtitle: 'Scale with advanced features and priority support',
    recommended: true,
    features: [
      'Unlimited projects',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'All integrations + API access',
      'Custom reports & exports',
      'Dedicated success manager',
    ],
    ctaText: 'Start Free Trial',
    ctaTo: '/contact?tier=growth',
    ctaVariant: 'primary',
    illustration: 'growth',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Security, compliance, and custom solutions',
    recommended: false,
    features: [
      'Everything in Growth',
      'SSO & advanced security',
      'SLA & compliance support',
      'Custom contracts',
      'On-premise deployment option',
      '24/7 phone support',
    ],
    ctaText: 'Contact Sales',
    ctaTo: '/contact?tier=enterprise',
    ctaVariant: 'outline',
    illustration: 'enterprise',
  },
];
