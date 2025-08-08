// src/types/Schema.ts
export type UserRole = 'lender' | 'publisher';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  company?: string;
  website?: string;
  phone?: string;
  // Дополнительные поля
  tax_id?: string;
  license_number?: string;
  country?: string;
  verticals?: string;
  lead_types?: string;
  monthly_volume?: string;
  experience?: string;
  integration_preference?: string;
  hear_about_us?: string;
  referral_code?: string;
  avatar?: string;
}

export type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  lender_id?: string;
  score?: number;
  rating?: number;
  price?: number;
};

export type Campaign = {
  id: number;
  name: string;
  publisher_id: string;
  created_at: string;
};

export type Transaction = {
  id: number;
  lead_id: string;
  lender_id: string;
  amount: number;
  created_at: string;
};

export type Form = {
  id: number;
  campaign_id: number;
  fields: string;
  created_at: string;
};

export type Schema = {
  users: User[];
  leads: Lead[];
  campaigns: Campaign[];
  transactions: Transaction[];
  forms: Form[];
};