import '../styles/legal.css';

export function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="legal-page__content">
          <p>
            ReverionTech respects your privacy. This policy describes how we collect, use, and protect your information.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide when you register, such as name and email, and usage data necessary to provide our services.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, communicate with you, and ensure security.
          </p>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate measures to protect your personal information.
          </p>
          <h2>4. Contact</h2>
          <p>
            For privacy-related questions, please contact us through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
