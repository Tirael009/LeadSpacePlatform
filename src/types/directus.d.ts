// directus.d.ts
import { CollectionTypeMap } from '@directus/sdk';
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role: string; // 'lender' | 'publisher'
  status: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vertical: string;
  score?: number;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  buyer: string; // user id (lender)
  lead: string;  // lead id
  price: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface Schema {
  users: User;
  leads: Lead;
  transactions: Transaction;
}

export interface Schema extends CollectionTypeMap {
  leads: Lead[];
}