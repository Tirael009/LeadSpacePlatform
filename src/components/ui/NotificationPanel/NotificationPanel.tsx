import React from 'react';
import styles from './NotificationPanel.module.scss';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
}

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<Props> = ({ notifications, onMarkAsRead, onClose }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Notifications</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className={styles.notificationList}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`${styles.notification} ${styles[notification.type]} ${notification.read ? styles.read : ''}`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <p>{notification.message}</p>
            <span>{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;