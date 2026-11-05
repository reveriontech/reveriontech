import { LegalLayout } from '../components/site/LegalLayout';
import { TermsContent } from '../components/site/legal';

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" description="The terms that govern use of the Reverion Tech website, AI assistant and client portal.">
      <TermsContent />
    </LegalLayout>
  );
}
