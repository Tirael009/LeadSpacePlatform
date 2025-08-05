interface User {
    id: number;
    role: 'publisher' | 'lender';
    username: string;
    password: string;
}

interface Lead {
    id: number;
    type: string;
    region: string;
    price: number;
    availability: boolean;
}

interface Transaction {
    id: number;
    userId: number;
    leadId: number;
    date: string; // или тип Date
    total: number;
}