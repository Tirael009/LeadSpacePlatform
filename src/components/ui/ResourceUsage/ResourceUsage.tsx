// ResourceUsage.tsx
import React from 'react';
import { FiDatabase, FiUser, FiPieChart } from 'react-icons/fi';
import styles from './ResourceUsage.module.scss';

interface ResourceUsageProps {
  leadsUsed: number;
  leadsLimit: number;
  storageUsed: number;
  storageLimit: number;
}

const ResourceUsage: React.FC<ResourceUsageProps> = ({ 
  leadsUsed, 
  leadsLimit, 
  storageUsed, 
  storageLimit 
}) => {
  const leadsPercentage = Math.min(Math.round((leadsUsed / leadsLimit) * 100), 100);
  const storagePercentage = Math.min(Math.round((storageUsed / storageLimit) * 100), 100);

  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return '#FF4757';
    if (percentage > 70) return '#FED330';
    return '#26DE81';
  };

  return (
    <div className={styles.resourceUsage}>
      <h3 className={styles.title}>
        <FiPieChart className={styles.titleIcon} />
        Resource Usage
      </h3>
      
      <div className={styles.resourceItem}>
        <div className={styles.resourceHeader}>
          <FiUser className={styles.resourceIcon} />
          <span className={styles.resourceName}>Leads</span>
            <span className={styles.resourceCount}>
            {storageUsed}GB/{storageLimit}GB
            </span>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{
              width: `${leadsPercentage}%`,
              background: getProgressColor(leadsPercentage)
            }}
          />
          <span className={styles.progressText}>{leadsPercentage}%</span>
        </div>
      </div>
      
      <div className={styles.resourceItem}>
        <div className={styles.resourceHeader}>
          <FiDatabase className={styles.resourceIcon} />
          <span className={styles.resourceName}>Storage</span>
          <span className={styles.resourceCount}>
            {storageUsed}GB/{storageLimit}GB
          </span>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{
              width: `${storagePercentage}%`,
              background: getProgressColor(storagePercentage)
            }}
          />
          <span className={styles.progressText}>{storagePercentage}%</span>
        </div>
      </div>
      
      <div className={styles.usageHint}>
        <p>Upgrade plan to increase resources</p>
      </div>
    </div>
  );
};

export default ResourceUsage;