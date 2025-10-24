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
  adminPhone?: string;
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
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      console.log('Auth successful, user:', data.user);
      await fetchUserData(data.user.id);
      
      // Fetch user role to determine redirect
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      console.log('Role query result:', { roleData, roleError });

      if (roleError) {
        console.error('Role fetch error:', roleError);
        throw new Error('User role not found. Please contact support.');
      }

      if (!roleData) {
        console.error('No role data found for user:', data.user.id);
        throw new Error('User role not found. Please contact support.');
      }

      const userRole = roleData.role as UserRole;
      console.log('Resolved user role:', userRole);

      const roleDashboards: Record<UserRole, string> = {
        admin: '/admin',
        marketer: '/marketer',
        sales: '/sales',
        super_admin: '/super-admin',
      };

      toast({
        title: "Login successful!",
        description: `Welcome back!`,
      });

      navigate(roleDashboards[userRole]);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setLoading(true);

      // Create auth user with all signup data in metadata
      // Database trigger will handle company, profile, and role creation atomically
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.adminEmail,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: data.adminName,
            companyName: data.companyName,
            businessType: data.businessType,
            location: data.location,
            companyEmail: data.companyEmail,
            companyPhone: data.companyPhone || '',
            adminPhone: data.adminPhone || '',
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      toast({
        title: "Account created successfully!",
        description: "Welcome to your dashboard.",
      });

      // Fetch user data and redirect
      await fetchUserData(authData.user.id);
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setCompany(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
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