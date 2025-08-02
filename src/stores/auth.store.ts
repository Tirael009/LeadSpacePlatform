// src/stores/auth.store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import usersData from '../mocks/data/users.json';

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
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundUser = usersData.find(
          u => u.email === email && u.password === password
        );
        
        if (!foundUser) {
          throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = foundUser;
        set({
          user: userWithoutPassword as User,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      } catch (err) {
        set({
          error: err.message,
          isLoading: false,
        });
        throw err;
      }
    },
    
    register: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const emailExists = usersData.some(u => u.email === userData.email);
        if (emailExists) {
          throw new Error('Email already registered');
        }

        const newUser = {
          ...userData,
          id: Math.max(...usersData.map(u => u.id)) + 1
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (err) {
        set({
          error: err.message,
          isLoading: false,
        });
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
        const user = JSON.parse(userJson);
        set({
          user,
          isAuthenticated: true,
        });
      }
    }
  }))
);