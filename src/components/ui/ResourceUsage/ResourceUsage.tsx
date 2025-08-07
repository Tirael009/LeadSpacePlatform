import React, { useState, useEffect } from 'react';
import { FiDatabase, FiUser, FiPieChart, FiAlertTriangle } from 'react-icons/fi';
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
  const [leadsPercentage, setLeadsPercentage] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);
  
  useEffect(() => {
    const leadsTarget = Math.min(Math.round((leadsUsed / leadsLimit) * 100), 100);
    const storageTarget = Math.min(Math.round((storageUsed / storageLimit) * 100), 100);
    
    const animate = () => {
      setLeadsPercentage(prev => {
        if (prev < leadsTarget) return prev + 1;
        return leadsTarget;
      });
      
      setStoragePercentage(prev => {
        if (prev < storageTarget) return prev + 1;
        return storageTarget;
      });
    };
    
    const timer = setInterval(animate, 20);
    
    return () => clearInterval(timer);
  }, [leadsUsed, leadsLimit, storageUsed, storageLimit]);
  
  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return '#f87171';
    if (percentage > 70) return '#fbbf24';
    return '#4ade80';
  };
  
  const getProgressClass = (percentage: number) => {
    if (percentage > 90) return styles.critical;
    if (percentage > 70) return styles.warning;
    return styles.normal;
  };

  return (
    <div className={styles.resourceUsage}>
      <h3 className={styles.title}>
        <FiPieChart className={styles.titleIcon} />
        Resource Usage
        {leadsPercentage > 90 && (
          <span className={styles.alertBadge}>
            <FiAlertTriangle /> High Usage
          </span>
        )}
      </h3>
      
      <div className={styles.resourceItem}>
        <div className={styles.resourceHeader}>
          <FiUser className={styles.resourceIcon} />
          <span className={styles.resourceName}>Leads</span>
          <span className={styles.resourceCount}>
            {leadsUsed}/{leadsLimit}
          </span>
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${getProgressClass(leadsPercentage)}`}
              style={{
                width: `${leadsPercentage}%`,
                background: getProgressColor(leadsPercentage)
              }}
            />
          </div>
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
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${getProgressClass(storagePercentage)}`}
              style={{
                width: `${storagePercentage}%`,
                background: getProgressColor(storagePercentage)
              }}
            />
          </div>
          <span className={styles.progressText}>{storagePercentage}%</span>
        </div>
      </div>
      
      <div className={styles.usageHint}>
        <p>Upgrade plan to increase resources</p>
        <button className={styles.upgradeButton}>
          Upgrade Account
        </button>
      </div>
    </div>
  );
};

export default ResourceUsage;