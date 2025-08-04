// src/types/auth.d.ts

export type UserRole = 'lender' | 'publisher';
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  type: 'lender' | 'publisher';
  company?: string;
  website?: string;
}

interface RegisterData extends Omit<User, 'id'> {
  password: string;
  confirmPassword: string;
  phone?: string;
  taxId?: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  company?: string;
  website?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}