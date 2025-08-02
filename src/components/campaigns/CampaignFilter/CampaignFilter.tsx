import React from 'react';
import styles from './CampaignFilter.module.scss';
import { FiSearch, FiX } from 'react-icons/fi';

interface Filter {
  status: string;
  dateRange: string;
  searchQuery: string;
  type: string;
}

interface CampaignFilterProps {
  filter: Filter;
  onFilterChange: (name: string, value: string) => void;
}

const CampaignFilter: React.FC<CampaignFilterProps> = ({ filter, onFilterChange }) => {
  const handleReset = () => {
    onFilterChange('status', '');
    onFilterChange('dateRange', '30d');
    onFilterChange('searchQuery', '');
    onFilterChange('type', '');
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchBox}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filter.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          className={styles.searchInput}
        />
        {filter.searchQuery && (
          <button onClick={() => onFilterChange('searchQuery', '')} className={styles.clearButton}>
            <FiX />
          </button>
        )}
      </div>
      
      <div className={styles.filterGroup}>
        <select
          value={filter.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
        
        <select
          value={filter.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
        
        <button onClick={handleReset} className={styles.resetButton}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default CampaignFilter;