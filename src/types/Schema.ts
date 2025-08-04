// src/types/Schema.ts

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export interface Schema {
  leads: Lead[];
}