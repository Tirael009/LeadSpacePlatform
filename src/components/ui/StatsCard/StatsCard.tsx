import React from 'react';
import { FaUsers } from 'react-icons/fa';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {icon || <FaUsers className={styles.icon} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '+' : ''}{change}% 
          <span className={styles.changeText}> vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;