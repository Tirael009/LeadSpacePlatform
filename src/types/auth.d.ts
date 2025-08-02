// src/types/auth.d.ts
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