// src/contexts/AuthProvider.tsx
import { useState } from 'react';
import users from '../mocks/data/users.json';
import { AuthContext } from './AuthContext';
import { User, UserRole } from '../types/auth.d';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      // Явно проверяем и приводим тип
      const role: UserRole = found.role === 'lender' || found.role === 'publisher' 
        ? found.role 
        : 'lender';
      
      // Создаем объект с явным указанием типа
      const authenticatedUser: User = {
        ...found,
        role,
        type: role // Используем переменную role, которая гарантированно имеет правильный тип
      };
      
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};