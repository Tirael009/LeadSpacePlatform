import React from 'react';
import styles from './LeadFilter.module.scss';

interface Filter {
  status: string;
  dateRange: string;
  searchQuery: string;
  source: string;
}

interface Props {
  filter: Filter;
  onFilterChange: (name: string, value: string) => void;
  sources: string[];
}

const LeadFilter: React.FC<Props> = ({ filter, onFilterChange, sources }) => {
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search leads..."
        value={filter.searchQuery}
        onChange={(e) => onFilterChange('searchQuery', e.target.value)}
      />
      
      <select
        value={filter.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="converted">Converted</option>
      </select>
      
      <select
        value={filter.source}
        onChange={(e) => onFilterChange('source', e.target.value)}
      >
        {sources.map(source => (
          <option key={source} value={source}>{source}</option>
        ))}
      </select>
      
      <select
        value={filter.dateRange}
        onChange={(e) => onFilterChange('dateRange', e.target.value)}
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
      </select>
    </div>
  );
};

export default LeadFilter;