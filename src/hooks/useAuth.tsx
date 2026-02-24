import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInAsDemo: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in session storage first
    const demoUser = sessionStorage.getItem('lumina_demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!sessionStorage.getItem('lumina_demo_user')) {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAsDemo = () => {
    const mockUser = {
      id: 'demo-user-id',
      email: 'demo@lumina.app',
      user_metadata: { full_name: 'Demo User' }
    } as any;
    sessionStorage.setItem('lumina_demo_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signOut = async () => {
    sessionStorage.removeItem('lumina_demo_user');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
