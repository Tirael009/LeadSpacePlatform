import React from 'react';
import styles from './NotificationPanel.module.scss';
import { 
  FiInfo, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiXCircle,
  FiBell
} from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
  action?: () => void;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>
          <FiBell className={styles.bellIcon} />
          Important Notifications
        </h3>
      </div>
      
      <div className={styles.notificationList}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
            onClick={notification.action}
          >
            <div className={styles.notificationIcon}>
              {notification.type === 'info' && <FiInfo className={styles.info} />}
              {notification.type === 'warning' && <FiAlertTriangle className={styles.warning} />}
              {notification.type === 'success' && <FiCheckCircle className={styles.success} />}
              {notification.type === 'error' && <FiXCircle className={styles.error} />}
            </div>
            <div className={styles.notificationContent}>
              <p>{notification.message}</p>
              <span>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;