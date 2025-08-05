import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface User {
    id: number;
    role: 'publisher' | 'lender'; // Определен точный тип роли
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);