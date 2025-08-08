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

  // Initialize auth state and set up auth state listener
  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setSession(session);
          
          // Store tokens in localStorage for persistence
          if (session) {
            localStorage.setItem('sb-access-token', session.access_token);
            localStorage.setItem('sb-refresh-token', session.refresh_token);
          } else {
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('sb-refresh-token');
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Clear any invalid tokens
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
            case 'USER_UPDATED':
              setUser(session?.user ?? null);
              setSession(session);
              if (session) {
                localStorage.setItem('sb-access-token', session.access_token);
                localStorage.setItem('sb-refresh-token', session.refresh_token);
              }
              break;
              
            case 'SIGNED_OUT':
              setUser(null);
              setSession(null);
              localStorage.removeItem('sb-access-token');
              localStorage.removeItem('sb-refresh-token');
              break;
              
            case 'USER_DELETED':
              setUser(null);
              setSession(null);
              localStorage.removeItem('sb-access-token');
              localStorage.removeItem('sb-refresh-token');
              break;
              
            default:
              break;
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign out the current user
  const signOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Clear tokens from localStorage
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      return { error: error || null };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { 
        error: error.message || 'An error occurred during sign out' 
      };
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

  // Function to update user data
  const updateUser = async () => {
    try {
      console.log('Updating user data...');
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
      
      console.log('New user data received:', currentUser);
      
      // Update both user and session states
      setUser(currentUser);
      setSession(prev => ({
        ...prev,
        user: currentUser
      }));
      
      return currentUser;
    } catch (error) {
      console.error('Error in updateUser:', {
        message: error.message,
        details: error,
        stack: error.stack
      });
      throw error; // Re-throw to allow handling in the component
    }
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
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
