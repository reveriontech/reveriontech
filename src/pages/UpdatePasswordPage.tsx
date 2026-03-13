import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';

// Custom validation checks similar to AuthPage
const getPasswordChecks = (password: string) => {
    return {
        length: password.length >= 8,
        capitalFirst: /^[A-Z]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
};

export function UpdatePasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Optional: You can check if the user has an active session here.
        // Supabase will automatically set the session when the user clicks the recovery link.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If they somehow navigated here without a session, they might not be able to update their password
                // But we'll let Supabase handle the error if they try.
            }
        };
        checkSession();
    }, []);

    const passwordChecks = getPasswordChecks(password);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setSuccessMsg('Your password has been updated successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <Reveal direction="scale" className="auth__card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px' }}>
                <div className="auth__header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Update Password</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Enter your new password below</p>
                </div>

                {successMsg && <p className="auth__hint auth__hint--success" style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--color-success)' }}>{successMsg}</p>}
                {error && <p className="auth__error" style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--color-error)' }}>{error}</p>}

                <form className="auth__form" onSubmit={handleUpdatePassword}>
                    <div className="auth__field" style={{ marginBottom: '1rem' }}>
                        <label className="auth__label" htmlFor="new-password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                className="auth__input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text)' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                            >
                                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                            </button>
                        </div>
                        <ul className="auth__checks" aria-live="polite" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', listStyle: 'none', padding: 0 }}>
                            <li style={{ color: passwordChecks.length ? 'var(--color-success)' : 'inherit' }}>
                                {passwordChecks.length ? '✓' : '○'} At least 8 characters
                            </li>
                            <li style={{ color: passwordChecks.capitalFirst ? 'var(--color-success)' : 'inherit' }}>
                                {passwordChecks.capitalFirst ? '✓' : '○'} Starts with a capital letter
                            </li>
                            <li style={{ color: passwordChecks.special ? 'var(--color-success)' : 'inherit' }}>
                                {passwordChecks.special ? '✓' : '○'} At least one special character
                            </li>
                        </ul>
                    </div>

                    <div className="auth__field" style={{ marginBottom: '1.5rem' }}>
                        <label className="auth__label" htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="confirmNewPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="auth__input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', borderRadius: '6px', border: `1px solid ${confirmPassword.length > 0 && password !== confirmPassword ? 'var(--color-error)' : 'var(--color-border)'}`, backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text)' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                            >
                                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="auth__submit">
                        <Button type="submit" disabled={isLoading || password.length < 8 || password !== confirmPassword} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px' }}>
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </Reveal>
        </div>
    );
}
