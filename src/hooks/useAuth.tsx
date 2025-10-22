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
      console.log('🔐 Login attempt started for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Auth response:', { user: data.user?.id, error });

      if (error) throw error;

      if (data.user) {
        console.log('✅ User authenticated:', data.user.id);
        
        // Fetch user role
        const { data: roleRow, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        console.log('👤 Role query result:', { roleRow, roleError });

        const userRole = roleRow?.role;
        
        if (!userRole) {
          console.error('❌ No role found for user:', data.user.id);
          throw new Error('User role not found. Please contact support.');
        }

        console.log('✅ User role:', userRole);
        
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });

        // Redirect to appropriate dashboard based on role
        const roleDashboards: Record<string, string> = {
          admin: '/admin',
          marketer: '/marketer',
          sales: '/sales',
          super_admin: '/super-admin',
        };
        
        const redirectPath = roleDashboards[userRole] || '/admin';
        console.log('🚀 Redirecting to:', redirectPath);
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
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
      console.log('📝 Starting signup process for:', data.adminEmail);
      console.log('📝 Company data:', { 
        name: data.companyName, 
        type: data.businessType, 
        location: data.location 
      });

      // 1. Create auth user
      console.log('1️⃣ Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.adminEmail,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            name: data.adminName,
          }
        }
      });

      console.log('1️⃣ Auth result:', { userId: authData.user?.id, error: authError });
      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');
      console.log('✅ Auth user created:', authData.user.id);

      // 2. Create company
      console.log('2️⃣ Creating company...');
      const companyInsert = {
        company_name: data.companyName,
        business_type: data.businessType as 'retail' | 'services' | 'technology' | 'manufacturing' | 'healthcare' | 'education' | 'other',
        location: data.location,
        email: data.companyEmail,
        phone: data.companyPhone,
      };
      console.log('2️⃣ Company insert data:', companyInsert);

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([companyInsert])
        .select()
        .single();

      console.log('2️⃣ Company result:', { companyData, error: companyError });
      if (companyError) {
        console.error('❌ Company creation failed:', companyError);
        throw companyError;
      }
      console.log('✅ Company created:', companyData.id);

      // 3. Create profile
      console.log('3️⃣ Creating profile...');
      const profileInsert = {
        id: authData.user.id,
        company_id: companyData.id,
        name: data.adminName,
        email: data.adminEmail,
        phone: data.companyPhone,
      };
      console.log('3️⃣ Profile insert data:', profileInsert);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([profileInsert])
        .select();

      console.log('3️⃣ Profile result:', { profileData, error: profileError });
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        throw profileError;
      }
      console.log('✅ Profile created');

      // 4. Assign admin role
      console.log('4️⃣ Assigning admin role...');
      const roleInsert = {
        user_id: authData.user.id,
        role: 'admin' as 'admin' | 'marketer' | 'sales',
      };
      console.log('4️⃣ Role insert data:', roleInsert);

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .insert([roleInsert])
        .select();

      console.log('4️⃣ Role result:', { roleData, error: roleError });
      if (roleError) {
        console.error('❌ Role assignment failed:', roleError);
        throw roleError;
      }
      console.log('✅ Admin role assigned');

      console.log('🎉 Signup completed successfully!');
      
      toast({
        title: 'Business Registered Successfully',
        description: 'Your account has been created. Redirecting to dashboard...',
      });

      // Navigate to admin dashboard
      setTimeout(() => {
        console.log('🚀 Redirecting to /admin');
        navigate('/admin');
      }, 1000);
    } catch (error: any) {
      console.error('❌ Signup error:', error);
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
