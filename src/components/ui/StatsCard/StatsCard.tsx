import React, { useState, useEffect } from 'react';
import styles from './StatsCard.module.scss';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
  loading?: boolean;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  loading = false,
  color = "#00F5FF"
}) => {
  const [animatedValue, setAnimatedValue] = useState<number | string>(0);
  const isPositive = change >= 0;
  const isNeutral = change === 0;

  useEffect(() => {
    if (typeof value === 'number') {
      let current = 0;
      const increment = value / 30;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.round(current));
        }
      }, 20);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value]);

  return (
    <div className={`${styles.card} ${loading ? styles.loading : ''}`}>
      <div 
        className={styles.iconContainer}
        style={{ 
          background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
          boxShadow: `0 4px 6px ${color}20, inset 0 -2px 4px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.05)`
        }}
      >
        {loading ? (
          <div className={styles.loader} />
        ) : (
          icon || <div className={styles.defaultIcon} style={{ color }} />
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        <p className={styles.value}>
          {loading ? '...' : animatedValue}
        </p>
        
        {!loading && !isNeutral && (
          <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? (
              <FiTrendingUp className={styles.changeIcon} />
            ) : (
              <FiTrendingDown className={styles.changeIcon} />
            )}
            {isPositive ? '+' : ''}{change}% 
            <span className={styles.changeText}> vs last period</span>
          </div>
        )}
        
        {isNeutral && (
          <div className={`${styles.change} ${styles.neutral}`}>
            <span className={styles.changeText}>No change</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;