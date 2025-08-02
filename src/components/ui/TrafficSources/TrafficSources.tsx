import React from 'react';
import styles from './TrafficSources.module.scss';

interface TrafficSource {
  name: string;
  value: number;
  change: number;
  color: string;
}

interface TrafficSourcesProps {
  sources: TrafficSource[];
}

const TrafficSources: React.FC<TrafficSourcesProps> = ({ sources }) => {
  return (
    <div className={styles.container}>
      <h3>Traffic Sources</h3>
      <div className={styles.sourcesList}>
        {sources.map((source) => (
          <div key={source.name} className={styles.sourceItem}>
            <div className={styles.sourceHeader}>
              <div 
                className={styles.sourceColor} 
                style={{ backgroundColor: source.color }}
              />
              <span className={styles.sourceName}>{source.name}</span>
              <span className={`${styles.sourceChange} ${source.change >= 0 ? styles.positive : styles.negative}`}>
                {source.change >= 0 ? '+' : ''}{source.change}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${source.value}%`,
                  backgroundColor: source.color
                }}
              />
            </div>
            <div className={styles.sourceValue}>
              {source.value}% of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSources;