import React from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
}

const LeadCard = ({ lead }: { lead: Lead }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="font-medium">{lead.name}</h3>
      <p className="text-gray-600">{lead.email}</p>
      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
        lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
        lead.status === 'Contacted' ? 'bg-green-100 text-green-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {lead.status}
      </span>
    </div>
  );
};

export default LeadCard;