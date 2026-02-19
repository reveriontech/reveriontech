import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  resendConfirmationEmail: (email: string, name: string) => Promise<void>;
  sendOtp: (email: string, name: string) => Promise<void>;
  verifyOtp: (email: string, token: string, name: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(supabaseUserToAppUser(session?.user ?? null));
    }).catch((err) => {
      console.error('Error getting session:', err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(supabaseUserToAppUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }

    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (!/^[A-Z]/.test(password)) throw new Error('Password must start with a capital letter.');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      throw new Error('Password must include at least one special character (e.g. !@#$%^&*).');
    }

    // Sign up with password - Supabase sends confirmation email with OTP code
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      // Handle 429 rate limit errors gracefully
      if (signUpError.status === 429 || signUpError.message?.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again, or check your email inbox for the confirmation code.');
      }
      throw signUpError;
    }
    if (!signUpData.user) throw new Error('Registration failed');

    // Supabase sent confirmation email; session is null until user confirms
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
      if (error.status === 429 || error.message?.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again, or check your email inbox for the confirmation code.');
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

    if (error) throw error;
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

    if (error) throw error;
    if (!data.user) throw new Error('OTP verification failed');

    if (data.user.user_metadata?.name !== name) {
      await supabase.auth.updateUser({
        data: { name },
      });
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, resendConfirmationEmail, sendOtp, verifyOtp, logout }}>
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
