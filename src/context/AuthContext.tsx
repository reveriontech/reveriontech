import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, encryptedPayload?: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  resendConfirmationEmail: (email: string, name: string) => Promise<void>;
  sendOtp: (email: string, name: string) => Promise<void>;
  verifyOtp: (email: string, token: string, name: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function supabaseUserToAppUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  return {
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.name ?? supabaseUser.email?.split('@')[0] ?? 'User',
    company: supabaseUser.user_metadata?.company,
    phone: supabaseUser.user_metadata?.phone,
    role: supabaseUser.user_metadata?.role,
  };
}

/** Fire-and-forget: POST login attempt to Rust backend for IP tracking */
function trackLoginAttempt(email: string, method: string, success: boolean, errorMessage?: string) {
  fetch(`${BACKEND_URL}/login-attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, method, success, error_message: errorMessage ?? null }),
  }).catch(() => { /* silent — tracking should never block auth */ });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      return;
    }

    let mounted = true;

    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        if (error.status === 429) return;
        if (error.message?.toLowerCase().includes('expired') || error.message?.toLowerCase().includes('invalid')) {
          await supabase.auth.signOut();
          setUser(null);
        }
        return;
      }
      if (session) {
        setUser(supabaseUserToAppUser(session.user));
      } else {
        setUser(null);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(supabaseUserToAppUser(session?.user ?? null));
      } else {
        setUser(supabaseUserToAppUser(session?.user ?? null));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const rateLimitMessage = 'Too many requests. Please wait a moment and try again.';

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      trackLoginAttempt(email, 'password', false, error.message);
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        throw new Error(rateLimitMessage);
      }
      throw error;
    }
    if (!data.user) throw new Error('Login failed');
    trackLoginAttempt(email, 'password', true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, encryptedPayload?: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (!/^[A-Z]/.test(password)) throw new Error('Password must start with a capital letter.');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      throw new Error('Password must include at least one special character (e.g. !@#$%^&*).');
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          name,
          ...(encryptedPayload ? { encrypted_payload: encryptedPayload } : {}) 
        } 
      },
    });

    if (signUpError) {
      trackLoginAttempt(email, 'register', false, signUpError.message);
      throw signUpError;
    }
    if (!signUpData.user) throw new Error('Registration failed');

    trackLoginAttempt(email, 'register', true);

    const needsEmailConfirmation = !signUpData.session;
    return { needsEmailConfirmation };
  }, []);

  const getAuthCallbackUrl = () => `${window.location.origin}/auth/callback`;

  const resendConfirmationEmail = useCallback(async (email: string, _name: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    // Resend signup confirmation email (same redirect as signUp: /auth/callback)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        throw new Error(rateLimitMessage);
      }
      throw error;
    }
  }, []);

  const sendOtp = useCallback(async (email: string, name: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    // OTP email with randomly generated 6-digit code; link in email redirects to callback
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name },
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    if (error) {
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        throw new Error(rateLimitMessage);
      }
      throw error;
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string, name: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      trackLoginAttempt(email, 'otp', false, error.message);
      const msg = error.message?.toLowerCase() ?? '';
      if (error.status === 429 || msg.includes('rate limit')) {
        throw new Error(rateLimitMessage);
      }
      if (msg.includes('expired') || msg.includes('invalid')) {
        throw new Error('This code has expired. Please click Resend to get a new code.');
      }
      throw error;
    }
    if (!data.user) throw new Error('OTP verification failed');

    trackLoginAttempt(email, 'otp', true);

    if (data.user.user_metadata?.name !== name) {
      await supabase.auth.updateUser({
        data: { name },
      });
    }
    try {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed?.session) setUser(supabaseUserToAppUser(refreshed.session.user));
    } catch {
      // keep session from verifyOtp
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });

    if (error) {
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        throw new Error(rateLimitMessage);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, resendConfirmationEmail, sendOtp, verifyOtp, requestPasswordReset, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

