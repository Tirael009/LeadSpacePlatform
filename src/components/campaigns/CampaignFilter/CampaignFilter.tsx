import React, { useState, useEffect } from 'react';
import styles from './CampaignFilter.module.scss';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';

interface Filter {
  status: string;
  dateRange: string;
  searchQuery: string;
  type: string;
  niche: string;
}

interface CampaignFilterProps {
  filter: Filter;
  onFilterChange: (name: string, value: string) => void;
  niches: string[];
}

const CampaignFilter: React.FC<CampaignFilterProps> = ({ 
  filter, 
  onFilterChange,
  niches
}) => {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      // УДАЛЕНО: setMobileView(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleReset = () => {
    onFilterChange('status', '');
    onFilterChange('dateRange', '30d');
    onFilterChange('searchQuery', '');
    onFilterChange('type', '');
    onFilterChange('niche', '');
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.header}>
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
        
        <button 
          className={styles.toggleButton}
          onClick={() => setExpanded(!expanded)}
        >
          <FiFilter />
          <span>Filters</span>
          <FiChevronDown className={`${styles.chevron} ${expanded ? styles.rotated : ''}`} />
        </button>
      </div>
      
      {expanded && (
        <div className={styles.filterGroup}>
          <div className={styles.selectGroup}>
            <label>Status</label>
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
          </div>
          
          <div className={styles.selectGroup}>
            <label>Date Range</label>
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
          </div>
          
          <div className={styles.selectGroup}>
            <label>Niche</label>
            <select
              value={filter.niche}
              onChange={(e) => onFilterChange('niche', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Niches</option>
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
          
          <button onClick={handleReset} className={styles.resetButton}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignFilter;