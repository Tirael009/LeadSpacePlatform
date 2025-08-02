// RecentActivity.tsx
import React from 'react';
import { FiActivity, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';
import styles from './RecentActivity.module.scss';

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type?: 'success' | 'warning' | 'info';
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className={styles.successIcon} />;
      case 'warning':
        return <FiAlertTriangle className={styles.warningIcon} />;
      default:
        return <FiActivity className={styles.infoIcon} />;
    }
  };

  return (
    <div className={styles.recentActivity}>
      <div className={styles.header}>
        <h3>
          <FiActivity className={styles.titleIcon} />
          Recent Activity
        </h3>
      </div>
      
      <ul className={styles.activityList}>
        {activities.map((activity) => (
          <li key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <span className={styles.user}>{activity.user}</span> {activity.action}
              </p>
              
              <div className={styles.activityMeta}>
                <FiClock className={styles.timeIcon} />
                <span className={styles.time}>{activity.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;