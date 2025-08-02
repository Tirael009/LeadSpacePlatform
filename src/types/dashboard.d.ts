interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  date: string;
  value?: number;
}

interface Payment {
  id: string;
  date: string;
  publisher: string;
  leadsCount: number;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
}