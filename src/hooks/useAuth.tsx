import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company, AuthState, UserRole, BusinessType } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCompany = localStorage.getItem('company');
    if (storedUser && storedCompany) {
      const parsedUser = JSON.parse(storedUser);
      const parsedCompany = JSON.parse(storedCompany);
      setUser(parsedUser);
      setCompany(parsedCompany);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userCompany = companies.find((c: any) => c.id === foundUser.companyId);
      
      if (!userCompany) {
        toast({
          title: "Login Failed",
          description: "Company not found",
          variant: "destructive",
        });
        throw new Error('Company not found');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setCompany(userCompany);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('company', JSON.stringify(userCompany));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });

      // Redirect based on role
      switch (userWithoutPassword.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'marketer':
          navigate('/marketer');
          break;
        case 'sales':
          navigate('/sales');
          break;
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (data: SignupData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    if (users.some((u: any) => u.email === data.adminEmail)) {
      toast({
        title: "Signup Failed",
        description: "Email already registered",
        variant: "destructive",
      });
      throw new Error('Email already exists');
    }

    // Create company
    const newCompany: Company = {
      id: crypto.randomUUID(),
      companyName: data.companyName,
      businessType: data.businessType as BusinessType,
      location: data.location,
      email: data.companyEmail,
      phone: data.companyPhone,
      createdAt: new Date().toISOString(),
    };

    // Create admin user
    const newUser = {
      id: crypto.randomUUID(),
      email: data.adminEmail,
      password: data.password,
      name: data.adminName,
      role: 'admin' as UserRole,
      companyId: newCompany.id,
      createdAt: new Date().toISOString(),
    };

    companies.push(newCompany);
    users.push(newUser);
    localStorage.setItem('companies', JSON.stringify(companies));
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setCompany(newCompany);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('company', JSON.stringify(newCompany));

    toast({
      title: "Business Registered",
      description: "Your business account has been created successfully!",
    });

    navigate('/admin');
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, company, isAuthenticated, login, signup, logout }}>
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
