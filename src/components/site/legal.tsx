import { Link } from 'react-router-dom';

// Shared legal copy: rendered on /privacy and /terms, and in the sign-up modals.
// Update LEGAL_UPDATED in src/data/legal.ts whenever this text changes.

const CONTACT_EMAIL = 'hello@reveriontech.com';
const Mail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const Address = () => <>Reverion Tech, 212 N. 2nd St. Ste 100, Richmond, KY 40475, United States</>;

export function PrivacyContent() {
  return (
    <>
      <p>
        This policy explains what personal information Reverion Tech (“we”, “us”) collects through reveriontech.com and
        our client portal, why we collect it, who we share it with, and the choices you have. We collect only what we need
        to respond to you, deliver our services, and keep our systems secure.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li><strong>Project inquiries.</strong> When you use the contact form we collect your name, business email, company, and the details you choose to share: industry, service of interest, budget range, timeline and project description.</li>
        <li><strong>Accounts.</strong> When you create a client portal account we collect your name, email address and password, and optionally your company, phone number and role. If you sign in with a third-party provider, we receive your name and email from that provider.</li>
        <li><strong>Project and team data.</strong> Information you or your team add to the portal, such as project details, updates, files and messages.</li>
        <li><strong>Direct communication.</strong> Anything you send us by email, phone or video call.</li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li><strong>Sign-in security records.</strong> For each sign-in attempt we record the email address used, the sign-in method, whether it succeeded, any error message, the IP address and the time. We use these records to detect and block unauthorized access.</li>
        <li><strong>Technical data.</strong> Our hosting and security providers process standard request data, such as IP address, browser type, device information, pages requested and timestamps, to deliver the site and protect it from abuse.</li>
        <li><strong>Browser storage.</strong> We store your light/dark theme preference and, if you sign in, your session token in your browser’s local storage. We do not use advertising cookies or third-party tracking pixels.</li>
      </ul>
      <h3>The AI assistant</h3>
      <p>
        Our site assistant can answer questions by text or voice. Voice mode starts only when you choose it and your browser
        asks for microphone permission. While a conversation is active, your messages and audio are sent through our servers
        to our AI provider, xAI, to generate responses. Please do not share sensitive personal information with the assistant.
        You can end a voice conversation at any time, and you can revoke microphone access in your browser settings.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To respond to inquiries, arrange discovery calls and prepare proposals.</li>
        <li>To create and manage your account and provide the client portal.</li>
        <li>To deliver, support and improve the services we have agreed to provide.</li>
        <li>To secure our systems, prevent fraud and investigate misuse.</li>
        <li>To meet legal, tax and accounting obligations.</li>
      </ul>
      <p>
        We do not sell your personal information, and we do not use the information you share with us to train AI models.
        We will only send you marketing emails if you have asked to receive them, and every such email includes a way to unsubscribe.
      </p>

      <h2>3. Legal Bases (EEA, UK and similar regions)</h2>
      <p>
        Where these laws apply, we process personal information to take steps you request before entering a contract and to
        perform that contract; for our legitimate interests in running, securing and improving our business, balanced against
        your rights; to comply with legal obligations; and, where required, with your consent, which you can withdraw at any time.
      </p>

      <h2>4. How We Share Information</h2>
      <p>We share personal information only with service providers that help us run our business, under contracts that limit their use of it:</p>
      <ul>
        <li><strong>Cloudflare</strong>: website hosting, content delivery and security.</li>
        <li><strong>Supabase</strong>: account authentication and database hosting.</li>
        <li><strong>xAI</strong>: processing conversations with the AI assistant.</li>
        <li>Email, scheduling and productivity tools we use to communicate with you.</li>
      </ul>
      <p>
        We may also disclose information when required by law or to protect our rights, users or the public, and to a successor
        if our business is reorganized, merged or sold. Information you add to a shared project is visible to the members of
        that project.
      </p>

      <h2>5. International Transfers</h2>
      <p>
        We operate from the United States and the Philippines, and our providers may process data in other countries. Where
        required, we rely on appropriate safeguards, such as standard contractual clauses, for these transfers.
      </p>

      <h2>6. How Long We Keep Information</h2>
      <ul>
        <li><strong>Inquiries</strong> that do not lead to a project: up to 24 months, then deleted.</li>
        <li><strong>Account and project data</strong>: for as long as your account is active, and afterwards for the period our contract or the law requires.</li>
        <li><strong>Sign-in security records</strong>: up to 12 months, unless needed longer to investigate an incident.</li>
      </ul>

      <h2>7. Security</h2>
      <p>
        We protect information with encryption in transit, access controls, the principle of least privilege, and monitoring of
        sign-in activity. No system is completely secure; if we become aware of a breach that affects your personal information,
        we will notify you as the law requires.
      </p>

      <h2>8. Your Rights and Choices</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete or export your personal information, to
        object to or restrict certain processing, and to withdraw consent. California residents may also request information about
        the categories of data we collect and how we use it; we do not sell or share personal information for cross-context
        behavioral advertising. To make a request, email <Mail />. We will verify your identity and respond within the time the
        law requires, and we will not treat you differently for exercising your rights. You may also lodge a complaint with your
        local data protection authority.
      </p>

      <h2>9. Children</h2>
      <p>Our services are intended for businesses and are not directed to children under 16. We do not knowingly collect their personal information.</p>

      <h2>10. Links to Other Sites</h2>
      <p>Our site and articles link to third-party websites. Their privacy practices are their own, and we encourage you to read their policies.</p>

      <h2>11. Changes to This Policy</h2>
      <p>We will update this policy when our practices change and revise the “Last updated” date above. If a change is significant, we will tell account holders by email or in the portal before it takes effect.</p>

      <h2>12. Contact Us</h2>
      <p>
        For privacy questions or requests, email <Mail />, use our <Link to="/contact">contact page</Link>, or write to us at <Address />.
      </p>
    </>
  );
}

export function TermsContent() {
  return (
    <>
      <p>
        These Terms of Service (“Terms”) govern your use of reveriontech.com, the AI assistant on it, and the Reverion Tech
        client portal (together, the “Services”). By using the Services or creating an account, you agree to these Terms and to
        our <Link to="/privacy">Privacy Policy</Link>. If you use the Services on behalf of a company, you confirm that you are
        authorized to accept these Terms for it.
      </p>

      <h2>1. Our Services and Client Engagements</h2>
      <p>
        The website describes our software engineering, automation, AI and infrastructure services. Project work itself is
        provided under a separate written agreement, such as a proposal, statement of work or master services agreement. If that
        agreement conflicts with these Terms, the agreement governs the project. Proposals, estimates and timelines are not
        binding until both parties sign.
      </p>

      <h2>2. Accounts</h2>
      <ul>
        <li>You must provide accurate information and keep it up to date.</li>
        <li>You are responsible for keeping your password confidential and for activity under your account. Tell us promptly at <Mail /> if you suspect unauthorized access.</li>
        <li>Account owners are responsible for the team members they invite and the access they grant.</li>
        <li>We may suspend or close an account that violates these Terms or puts the Services or other users at risk.</li>
      </ul>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Services for anything unlawful, fraudulent or harmful;</li>
        <li>attempt to access accounts, systems or data you are not authorized to access, or probe, scan or test their vulnerabilities without our written permission;</li>
        <li>interfere with or overload the Services, or scrape them by automated means beyond ordinary search-engine indexing;</li>
        <li>upload malware or content that infringes others’ rights;</li>
        <li>use the AI assistant to generate unlawful or abusive content, or attempt to extract its underlying instructions.</li>
      </ul>

      <h2>4. The AI Assistant</h2>
      <p>
        The site assistant is provided for general information about Reverion Tech and our services. Its answers are generated
        automatically and may be incomplete or inaccurate. They are not a quote, a commitment or professional advice. Confirm
        anything important with our team before relying on it.
      </p>

      <h2>5. Insights and Website Content</h2>
      <p>
        Articles, guides and other content on the site are for general information only and are not legal, financial, security
        or other professional advice. Technology and regulations change quickly; assess any approach against your own situation.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Services, including the site design, text, graphics, logos and software, belong to Reverion Tech or its licensors
        and are protected by law. You may view and share our content for personal or internal business purposes with
        attribution, but you may not copy, modify or republish it commercially without our written permission. Ownership of
        deliverables from a client engagement is set out in that engagement’s agreement.
      </p>

      <h2>7. Your Content</h2>
      <p>
        You keep ownership of the information and files you submit. You grant us a limited license to host, use and process them
        only to provide the Services and perform our work for you. You confirm you have the right to share what you submit.
      </p>

      <h2>8. Confidentiality</h2>
      <p>
        We treat project details you share with us as confidential and use them only to evaluate and deliver your project. If a
        signed non-disclosure or services agreement is in place, its confidentiality terms apply.
      </p>

      <h2>9. Third-Party Services and Links</h2>
      <p>
        The Services rely on, and link to, third-party products and websites. We are not responsible for their content,
        availability or practices, and your use of them is subject to their terms.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        Except as stated in a signed agreement, the Services are provided “as is” and “as available”, without warranties of any
        kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement. We do not
        guarantee that the Services will be uninterrupted, error-free or secure.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the extent permitted by law, Reverion Tech will not be liable for any indirect, incidental, special, consequential or
        punitive damages, or for lost profits, revenue or data, arising from your use of the Services. Our total liability for
        claims relating to the Services under these Terms is limited to one hundred US dollars (US$100). Liability for client
        engagements is governed by the applicable agreement. Some jurisdictions do not allow these limitations, so they may not
        apply to you.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You agree to indemnify Reverion Tech against claims and costs arising from your misuse of the Services or your violation
        of these Terms or of others’ rights.
      </p>

      <h2>13. Termination</h2>
      <p>
        You may stop using the Services and ask us to close your account at any time. We may suspend or end access if you breach
        these Terms. Sections that by their nature should survive, including intellectual property, disclaimers, limitation of
        liability and governing law, survive termination.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Commonwealth of Kentucky, United States, without regard to its conflict-of-law
        rules. Disputes will be resolved in the state or federal courts located in Kentucky, unless a signed agreement or
        applicable law requires otherwise.
      </p>

      <h2>15. Changes to These Terms</h2>
      <p>
        We may update these Terms and will revise the “Last updated” date above. If a change is significant, we will notify
        account holders before it takes effect. Continuing to use the Services after that means you accept the updated Terms.
      </p>

      <h2>16. Contact</h2>
      <p>
        Questions about these Terms? Email <Mail />, use our <Link to="/contact">contact page</Link>, or write to us at <Address />.
      </p>
    </>
  );
}
