interface Lead {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  price: number;
  ai_score: number;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  role: 'lender' | 'publisher' | 'admin';
  // ... другие поля
}