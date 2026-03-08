import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { Modal } from '../components/ui/Modal';
import '../styles/auth.css';
import '../styles/legal.css';

type AuthMode = 'login' | 'register' | 'forgot_password';
type LegalModal = 'terms' | 'privacy' | null;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return 'Password must be at least 8 characters.';
  if (!/^[A-Z]/.test(password)) return 'Password must start with a capital letter.';
  if (!PASSWORD_SPECIAL.test(password)) return 'Password must include at least one special character (e.g. !@#$%^&*).';
  return null;
}

function getPasswordChecks(password: string) {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    capitalFirst: /^[A-Z]/.test(password),
    special: PASSWORD_SPECIAL.test(password),
  };
}


export function AuthPage() {
  const { isAuthenticated, login, register, resendConfirmationEmail, verifyOtp, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);
  const [confirmToken, setConfirmToken] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModal>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const passwordChecks = mode === 'register' || mode === 'forgot_password' ? getPasswordChecks(password) : { length: false, capitalFirst: false, special: false };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const stateError = (location.state as { error?: string } | null)?.error;
    if (stateError) {
      setError(stateError);
      setMode('login');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await register(name, email, password);
      if (result?.needsEmailConfirmation) {
        setNeedsEmailConfirm(true);
        setConfirmToken('');
        setConfirmError('');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');

    if (!confirmToken) {
      setConfirmError('Please enter the 6-digit code from your email.');
      return;
    }

    setConfirmLoading(true);
    try {
      await verifyOtp(email, confirmToken, name);
      navigate('/dashboard');
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setConfirmError('');
    setConfirmLoading(true);
    try {
      await resendConfirmationEmail(email, name);
      setConfirmError('');
      setConfirmToken('');
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Failed to resend. Try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setResetSuccessMsg('A password reset link has been sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="auth">
      <Reveal direction="scale" className="auth__card">
        <div className="auth__header">
          <h2>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot_password' && 'Reset Password'}
          </h2>
          <p>
            {mode === 'login' && 'Sign in to access your dashboard'}
            {mode === 'register' && 'Get started with your projects'}
            {mode === 'forgot_password' && 'Enter your details to recover your account'}
          </p>
        </div>

        <div className="auth__tabs">
          <button
            className={`auth__tab ${mode === 'login' ? 'auth__tab--active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
              setResetSuccessMsg('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setShowPassword(false);
            }}
          >
            Login
          </button>
          <button
            className={`auth__tab ${mode === 'register' ? 'auth__tab--active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
              setResetSuccessMsg('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setShowPassword(false);
              setAgreedToTerms(false);
              setNeedsEmailConfirm(false);
              setConfirmToken('');
            }}
          >
            Register
          </button>
        </div>

        {resetSuccessMsg && <p className="auth__hint auth__hint--success" style={{ marginBottom: '1rem', textAlign: 'center' }}>{resetSuccessMsg}</p>}
        {error && <p className="auth__error">{error}</p>}

        {mode === 'forgot_password' ? (
          <form className="auth__form" onSubmit={handleRequestReset}>
            <div className="auth__field">
              <label className="auth__label" htmlFor="reset-email">Email Address</label>
              <input
                id="reset-email"
                type="email"
                className="auth__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="auth__submit">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        ) : mode === 'login' ? (
          <form className="auth__form" onSubmit={handleLogin}>
            <div className="auth__field">
              <label className="auth__label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className="auth__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  className="auth__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth__show-password-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
            </div>

            <div className="auth__submit">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Sign In'}
              </Button>
            </div>
          </form>
        ) : needsEmailConfirm ? (
          <form className="auth__form" onSubmit={handleVerifyConfirmation}>
            <p className="auth__otp-message">
              We&apos;ve sent a 6-digit confirmation code to <strong>{email}</strong>. Check your inbox (and spam folder) and enter the code below to confirm your account.
            </p>
            {confirmError && (
              <p className="auth__error">
                {confirmError}
                {confirmError.includes('rate limit') || confirmError.includes('Too many requests') ? (
                  <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85em' }}>
                    Tip: Check your email inbox - the code may have already been sent.
                  </span>
                ) : null}
              </p>
            )}
            <div className="auth__field">
              <label className="auth__label" htmlFor="confirmCode">Confirmation code</label>
              <input
                id="confirmCode"
                type="text"
                name="confirmCode"
                autoComplete="one-time-code"
                className="auth__input"
                placeholder="Enter 6-digit code"
                value={confirmToken}
                onChange={(e) => setConfirmToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                disabled={confirmLoading}
                autoFocus
              />
              <p className="auth__hint" style={{ marginTop: '0.35rem' }}>
                Enter the code soon — it expires in about 1 hour. If you see &quot;code expired&quot;, click Resend below.
              </p>
            </div>
            <div className="auth__submit">
              <Button type="submit" disabled={confirmLoading || confirmToken.length !== 6}>
                {confirmLoading ? 'Verifying...' : 'Confirm email'}
              </Button>
            </div>
            <div className="auth__resend">
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="auth__link"
                disabled={confirmLoading}
              >
                Resend confirmation code
              </button>
            </div>
          </form>
        ) : (
          <form className="auth__form" onSubmit={handleRegister}>
            <div className="auth__field">
              <label className="auth__label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                className="auth__input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className="auth__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  className="auth__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth__show-password-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
              <ul className="auth__checks" aria-live="polite">
                <li className={passwordChecks.length ? 'auth__check--pass' : 'auth__check--fail'}>
                  {passwordChecks.length ? '✓' : '○'} At least 8 characters
                </li>
                <li className={passwordChecks.capitalFirst ? 'auth__check--pass' : 'auth__check--fail'}>
                  {passwordChecks.capitalFirst ? '✓' : '○'} Starts with a capital letter
                </li>
                <li className={passwordChecks.special ? 'auth__check--pass' : 'auth__check--fail'}>
                  {passwordChecks.special ? '✓' : '○'} At least one special character (!@#$%^&* etc.)
                </li>
              </ul>
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  className={`auth__input ${confirmPassword.length > 0 && password !== confirmPassword ? 'auth__input--error' : ''}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth__show-password-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={password === confirmPassword ? 'auth__hint auth__hint--success' : 'auth__hint auth__hint--error'}>
                  {password === confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="auth__field auth__field--checkbox">
              <label className="auth__agreement">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="auth__checkbox"
                  disabled={isLoading}
                />
                <span>
                  I agree to the{' '}
                  <button type="button" onClick={() => setLegalModal('terms')} className="auth__link">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => setLegalModal('privacy')} className="auth__link">Privacy Policy</button>
                </span>
              </label>
            </div>

            <div className="auth__submit">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}

        <div className="auth__footer">
          {mode === 'forgot_password' ? (
            <p>Remember your password? <button type="button" onClick={() => { setMode('login'); setError(''); setResetSuccessMsg(''); }} className="auth__link">Sign in</button></p>
          ) : mode === 'login' ? (
            <>
              <p>Don't have an account? <button type="button" onClick={() => { setMode('register'); setError(''); }} className="auth__link">Sign up</button></p>
              <p style={{ marginTop: '0.75rem' }}>Forgot your password? <button type="button" onClick={() => { setMode('forgot_password'); setError(''); setResetSuccessMsg(''); }} className="auth__link">Reset here</button></p>
            </>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="auth__link">Sign in</button></p>
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

    </div >
  );
}
