import { create } from 'zustand';

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface LeadsStore {
  leads: Lead[];
  fetchLeads: () => void;
}

export const useLeadsStore = create<LeadsStore>((set) => ({
  leads: [],
  fetchLeads: async () => {
    // Замените на реальный API-запрос
    const mockLeads = [
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'New' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' }
    ];
    set({ leads: mockLeads });
  }
}));