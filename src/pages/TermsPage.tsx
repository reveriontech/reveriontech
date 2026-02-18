import '../styles/legal.css';

export function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Terms of Service</h1>
        <p className="legal-page__updated">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="legal-page__content">
          <p>
            Welcome to ReverionTech. By registering or using our services, you agree to these Terms of Service.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, you agree to be bound by these terms and our Privacy Policy.
          </p>
          <h2>2. Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these terms.
          </p>
          <h2>3. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
          <h2>4. Contact</h2>
          <p>
            For questions about these terms, please contact us through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
