import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company, AuthState, UserRole } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface SignupData {
  companyName: string;
  businessType: string;
  location: string;
  companyEmail: string;
  companyPhone?: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Fetch user profile and company data
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setCompany(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile with company data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

    const userRole = roles?.[0]?.role as UserRole;

    if (!profile) {
      // Profile not found - create minimal user from session and role
      const baseEmail = session?.user?.email ?? '';
      const fallbackUser: User = {
        id: userId,
        email: baseEmail,
        name: baseEmail ? baseEmail.split('@')[0] : 'User',
        role: userRole,
        companyId: '',
        phone: undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      setCompany(null);
      setIsAuthenticated(true);
    } else {
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: userRole,
        companyId: profile.company_id,
        phone: profile.phone,
        createdAt: profile.created_at,
      };

      const companyData: Company = {
        id: profile.companies.id,
        companyName: profile.companies.company_name,
        businessType: profile.companies.business_type,
        location: profile.companies.location,
        email: profile.companies.email,
        phone: profile.companies.phone || undefined,
        createdAt: profile.companies.created_at,
      };

      setUser(userData);
      setCompany(companyData);
      setIsAuthenticated(true);
    }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserData(data.user.id);
        
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });

        // Redirect based on role
        const { data: roleRow } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        const userRole = roleRow?.role;
        
        // Redirect to appropriate dashboard based on role
        const roleDashboards: Record<string, string> = {
          admin: '/admin',
          marketer: '/marketer',
          sales: '/sales',
          super_admin: '/super-admin',
        };
        
        navigate(roleDashboards[userRole] || '/admin');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      // FRONTEND-ONLY MODE: Skip backend calls for now
      const mockCompanyId = 'temp-company';
      const mockUser: User = {
        id: (globalThis.crypto?.randomUUID?.() as string) || String(Date.now()),
        email: data.adminEmail,
        name: data.adminName,
        role: 'admin',
        companyId: mockCompanyId,
        phone: data.companyPhone,
        createdAt: new Date().toISOString(),
      };

      const mockCompany: Company = {
        id: mockCompanyId,
        companyName: data.companyName,
        businessType: data.businessType as any,
        location: data.location,
        email: data.companyEmail,
        phone: data.companyPhone,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      setCompany(mockCompany);
      setIsAuthenticated(true);

      toast({
        title: 'Business Registered',
        description: 'Frontend signup complete. Backend integration can be added later.',
      });

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    }
  };
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCompany(null);
    setIsAuthenticated(false);
    setSession(null);
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, company, isAuthenticated, login, signup, logout, loading, session }}>
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
