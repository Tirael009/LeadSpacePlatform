import { createContext } from 'react';
import { User } from '../types/Schema';

interface AuthContextType {
  user: User | null;
  isLoading?: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => Promise.resolve(false),
  logout: () => Promise.resolve()
});