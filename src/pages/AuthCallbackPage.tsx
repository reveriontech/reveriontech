import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        setStatus('error');
        const friendlyMessage = (error.message?.toLowerCase().includes('expired') || error.message?.toLowerCase().includes('invalid'))
          ? 'This link has expired. Please request a new sign-in link or use the 6-digit code from your latest email.'
          : error.message;
        navigate('/auth', { replace: true, state: { error: friendlyMessage } });
        return;
      }
      if (session) {
        setStatus('success');
        navigate('/dashboard', { replace: true });
        return;
      }
      timer = setTimeout(async () => {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (cancelled) return;
        if (s) {
          setStatus('success');
          navigate('/dashboard', { replace: true });
        } else {
          setStatus('error');
          navigate('/auth', { replace: true, state: { error: 'This link has expired or was already used. Please request a new sign-in link or use the 6-digit code from your email.' } });
        }
      }, 500);
    };

    run();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <p>Signing you in…</p>
      </div>
    );
  }

  return null;
}
