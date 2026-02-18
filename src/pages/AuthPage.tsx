import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Modal } from '../components/ui/Modal';
import '../styles/auth.css';
import '../styles/legal.css';

type AuthMode = 'login' | 'register';
type LegalModal = 'terms' | 'privacy' | null;

export function AuthPage() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModal>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && !name) {
      setError('Please enter your name.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (mode === 'register' && !agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <Reveal direction="scale" className="auth__card">
        <div className="auth__header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'login' ? 'Sign in to access your dashboard' : 'Get started with your projects'}</p>
        </div>

        <div className="auth__tabs">
          <button
            className={`auth__tab ${mode === 'login' ? 'auth__tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setConfirmPassword(''); setAgreedToTerms(false); }}
          >
            Login
          </button>
          <button
            className={`auth__tab ${mode === 'register' ? 'auth__tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setConfirmPassword(''); setAgreedToTerms(false); }}
          >
            Register
          </button>
        </div>

        {error && <p className="auth__error">{error}</p>}

        <form className="auth__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth__field">
              <label className="auth__label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="auth__input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="auth__field">
            <label className="auth__label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="auth__field">
              <label className="auth__label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="auth__input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="auth__field auth__field--checkbox">
              <label className="auth__agreement">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="auth__checkbox"
                />
                <span>
                  I agree to the{' '}
                  <button type="button" onClick={() => setLegalModal('terms')} className="auth__link">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => setLegalModal('privacy')} className="auth__link">Privacy Policy</button>.
                </span>
              </label>
            </div>
          )}

          <div className="auth__submit">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="auth__footer">
          {mode === 'login' ? (
            <p>Don't have an account? <button onClick={() => setMode('register')}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></p>
          )}
        </div>
      </Reveal>

      <Modal
        isOpen={legalModal === 'terms'}
        onClose={() => setLegalModal(null)}
        title="Terms of Service"
      >
        <p className="legal-page__updated">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="legal-page__content">
          <p>Welcome to ReverionTech. By registering or using our services, you agree to these Terms of Service.</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By creating an account, you agree to be bound by these terms and our Privacy Policy.</p>
          <h2>2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these terms.</p>
          <h2>3. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>
          <h2>4. Contact</h2>
          <p>For questions about these terms, please contact us through our contact page.</p>
        </div>
      </Modal>

      <Modal
        isOpen={legalModal === 'privacy'}
        onClose={() => setLegalModal(null)}
        title="Privacy Policy"
      >
        <p className="legal-page__updated">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="legal-page__content">
          <p>ReverionTech respects your privacy. This policy describes how we collect, use, and protect your information.</p>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide when you register, such as name and email, and usage data necessary to provide our services.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, communicate with you, and ensure security.</p>
          <h2>3. Data Security</h2>
          <p>We implement appropriate measures to protect your personal information.</p>
          <h2>4. Contact</h2>
          <p>For privacy-related questions, please contact us through our contact page.</p>
        </div>
      </Modal>
    </div>
  );
}
