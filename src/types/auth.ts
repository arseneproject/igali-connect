export type UserRole = 'admin' | 'marketer' | 'sales';
export type BusinessType = 'retail' | 'services' | 'technology' | 'manufacturing' | 'healthcare' | 'education' | 'other';

export interface Company {
  id: string;
  companyName: string;
  businessType: BusinessType;
  location: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  phone?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
}
