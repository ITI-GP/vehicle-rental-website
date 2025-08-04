import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../Lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  // Helper function to get access token
  const getAccessToken = () => {
    return session?.access_token || null;
  };

  // Helper function to get refresh token
  const getRefreshToken = () => {
    return session?.refresh_token || null;
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    getAccessToken,
    getRefreshToken,
    accessToken: session?.access_token || null,
    refreshToken: session?.refresh_token || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
