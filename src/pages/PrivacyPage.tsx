import { LegalLayout } from '../components/site/LegalLayout';
import { PrivacyContent } from '../components/site/legal';

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" description="How Reverion Tech collects, uses, shares and protects personal information, and the choices you have.">
      <PrivacyContent />
    </LegalLayout>
  );
}
