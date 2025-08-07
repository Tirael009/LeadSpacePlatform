import React, { useState } from 'react';
import styles from './TrafficSources.module.scss';
import { FiInfo, FiFilter, FiArrowDown, FiArrowUp } from 'react-icons/fi';

interface TrafficSource {
  name: string;
  value: number;
  change: number;
  color: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface TrafficSourcesProps {
  sources: TrafficSource[];
}

const TrafficSources: React.FC<TrafficSourcesProps> = ({ sources }) => {
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'value' | 'change'; direction: 'asc' | 'desc' }>({ 
    key: 'value', 
    direction: 'desc' 
  });
  const [filterQuery, setFilterQuery] = useState('');
  
  const sortedSources = [...sources].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const filteredSources = sortedSources.filter(source => 
    source.name.toLowerCase().includes(filterQuery.toLowerCase())
  );
  
  const requestSort = (key: 'name' | 'value' | 'change') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Traffic Sources</h3>
        <div className={styles.controls}>
          <div className={styles.searchFilter}>
            <input 
              type="text" 
              placeholder="Filter sources..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            <FiFilter className={styles.filterIcon} />
          </div>
          <div className={styles.infoIcon} data-tooltip="Distribution of traffic sources">
            <FiInfo />
          </div>
        </div>
      </div>
      
      <div className={styles.tableHeader}>
        <div 
          className={`${styles.headerCell} ${sortConfig.key === 'name' ? styles.active : ''}`}
          onClick={() => requestSort('name')}
        >
          Source
          {sortConfig.key === 'name' && (
            sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
          )}
        </div>
        <div 
          className={`${styles.headerCell} ${sortConfig.key === 'value' ? styles.active : ''}`}
          onClick={() => requestSort('value')}
        >
          Share
          {sortConfig.key === 'value' && (
            sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
          )}
        </div>
        <div 
          className={`${styles.headerCell} ${sortConfig.key === 'change' ? styles.active : ''}`}
          onClick={() => requestSort('change')}
        >
          Change
          {sortConfig.key === 'change' && (
            sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
          )}
        </div>
      </div>
      
      <div className={styles.sourcesList}>
        {filteredSources.map((source) => (
          <div 
            key={source.name} 
            className={styles.sourceItem}
            onMouseEnter={() => setHoveredSource(source.name)}
            onMouseLeave={() => setHoveredSource(null)}
          >
            <div className={styles.sourceHeader}>
              <div 
                className={styles.sourceColor} 
                style={{ backgroundColor: source.color }}
              />
              <span className={styles.sourceName}>{source.name}</span>
            </div>
            
            <div className={styles.sourceData}>
              <span className={styles.sourceShare}>{source.value}%</span>
              <span className={`${styles.sourceChange} ${source.change >= 0 ? styles.positive : styles.negative}`}>
                {source.change >= 0 ? '+' : ''}{source.change}%
              </span>
            </div>
            
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${source.value}%`,
                  backgroundColor: source.color,
                  opacity: hoveredSource === source.name ? 0.9 : 0.7
                }}
                data-tooltip={`${source.value}% of traffic`}
              />
            </div>
            
            {hoveredSource === source.name && (
              <div className={styles.sourceTooltip}>
                <div className={styles.tooltipRow}>
                  <span>Clicks:</span>
                  <strong>{source.clicks.toLocaleString()}</strong>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Conversions:</span>
                  <strong>{source.conversions.toLocaleString()}</strong>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Revenue:</span>
                  <strong>${source.revenue.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSources;