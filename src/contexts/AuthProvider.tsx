import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../types/Schema';
import { directus } from '../api/directus';
import { readMe } from '@directus/sdk';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка сессии при загрузке
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await directus.getToken();
        if (token) {
          // Установите токен вручную для прокси
          directus.setToken(token);
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const me = await directus.request(
        readMe({
          fields: ['id', 'email', 'first_name', 'last_name', 'role', 'avatar']
        })
      ) as unknown as User;
      
      setUser(me);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      await directus.logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Вход через Directus
      await directus.login({ email, password });
      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await directus.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      isAuthenticated: !!user,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};