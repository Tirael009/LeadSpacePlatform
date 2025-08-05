import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import usersData from '../mocks/data/users.json';
import { User, UserRole } from '../types/auth.d';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    
    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const foundUser = usersData.find(
          (u) => u.email === email && u.password === password
        );
        
        if (!foundUser) {
          throw new Error('Invalid email or password');
        }

        // Исправление: удаление неиспользуемого свойства без сохранения
        const { password: _, ...userWithoutPassword } = foundUser;
        
        const newUser: User = {
          ...userWithoutPassword,
          firstName: foundUser.firstName || '',
          lastName: foundUser.lastName || '',
          role: foundUser.role as UserRole,
          id: foundUser.id,
          password: foundUser.password,
          type: foundUser.role as 'lender' | 'publisher',
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({
            error: err.message,
            isLoading: false,
          });
        }
        throw err;
      }
    },
    
    register: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const emailExists = usersData.some((u) => u.email === userData.email);
        if (emailExists) {
          throw new Error('Email already registered');
        }

        // Исправление: генерируем id как число
        const maxId = Math.max(...usersData.map(u => u.id));
        const newUser = {
          ...userData,
          id: maxId + 1,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          // Добавление обязательных свойств
          role: 'publisher' as UserRole, // Значение по умолчанию
          type: 'publisher' as 'lender' | 'publisher', // Значение по умолчанию
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({
            error: err.message,
            isLoading: false,
          });
        }
        throw err;
      }
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('user');
    },

    clearError: () => {
      set({ error: null });
    },

    loadUser: () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          user,
          isAuthenticated: true,
        });
      }
    },
  }))
);