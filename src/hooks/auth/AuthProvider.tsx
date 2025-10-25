import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Company, AuthState, UserRole, SignupData } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserData } from './utils';
import { useSignup } from './useSignup';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { signup } = useSignup();

  const [state, setState] = useState<AuthState>({
    user: null,
    company: null,
    isLoading: true,
  });
  const navigate = useNavigate();

  const fetchCompanyData = async (userId: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Auth state change will handle the rest
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/login');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const [userRole, companyData] = await Promise.all([
            fetchUserData(session.user.id),
            fetchCompanyData(session.user.id),
          ]);

          setState({
            user: { ...session.user, role: userRole as UserRole },
            company: companyData,
            isLoading: false,
          });
        } else {
          setState({ user: null, company: null, isLoading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({ user: null, company: null, isLoading: false });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const [userRole, companyData] = await Promise.all([
              fetchUserData(session.user.id),
              fetchCompanyData(session.user.id),
            ]);

            setState({
              user: { ...session.user, role: userRole as UserRole },
              company: companyData,
              isLoading: false,
            });
          } else {
            setState({ user: null, company: null, isLoading: false });
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setState({ user: null, company: null, isLoading: false });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
