'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import type { Profile } from '@/lib/types';
import { getCurrentProfile } from '@/lib/audit';

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const lastActivityRef = useRef<number>(Date.now());
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshProfile = useCallback(async () => {
    const p = await getCurrentProfile();
    setProfile(p);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session) {
        getCurrentProfile().then((p) => mounted && setProfile(p));
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      (async () => {
        setSession(sess);
        setUser(sess?.user ?? null);
        if (sess) {
          const p = await getCurrentProfile();
          if (mounted) setProfile(p);
        } else {
          if (mounted) setProfile(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Inactivity auto-logout
  useEffect(() => {
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    events.forEach((e) => window.addEventListener(e, resetActivity, { passive: true }));

    countdownRef.current = setInterval(() => {
      if (!session) return;
      const idle = Date.now() - lastActivityRef.current;
      if (idle > INACTIVITY_LIMIT_MS) {
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    }, 30_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity));
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
