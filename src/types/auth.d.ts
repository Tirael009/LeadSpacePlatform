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
  firstName: string;
  lastName: string;
  role: UserRole;
  type: 'lender' | 'publisher'; // Важно: именно так должно быть определено
  company?: string;
  website?: string;
  avatar?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}