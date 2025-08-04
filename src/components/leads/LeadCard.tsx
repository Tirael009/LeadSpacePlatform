import React from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string; // Добавлено для соответствия Dashboard.tsx
  status: 'new' | 'contacted' | 'converted' | 'lost'; // Уточнён тип
  source?: string; // Добавлено для соответствия
  date?: string; // Добавлено для соответствия
  value?: number;
}

interface LeadCardProps {
  lead: Lead;
  onContact?: () => void;
  onConvert?: () => void;
  value?: number;
}

const LeadCard = ({ lead, onContact, onConvert, value }: LeadCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="font-medium">{lead.name}</h3>
      <p className="text-gray-600">{lead.email}</p>
      {lead.phone && <p className="text-gray-600">{lead.phone}</p>}
      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
        lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
        lead.status === 'contacted' ? 'bg-green-100 text-green-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {lead.status}
      </span>
      {value && <p className="mt-2 font-medium">Value: ${value}</p>}
      <div className="mt-3 flex gap-2">
        {onContact && (
          <button 
            onClick={onContact}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Contact
          </button>
        )}
        {onConvert && (
          <button 
            onClick={onConvert}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Convert
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadCard;