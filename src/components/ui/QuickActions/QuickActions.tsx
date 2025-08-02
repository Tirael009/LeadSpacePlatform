import React from 'react';
import styles from './QuickActions.module.scss';

interface Action {
  icon: React.ReactNode;
  label: string;
  action: string;
}

interface Props {
  actions: Action[];
  onAction: (action: string) => void;
}

const QuickActions: React.FC<Props> = ({ actions, onAction }) => {
  return (
    <div className={styles.quickActions}>
      {actions.map((action, index) => (
        <button 
          key={index} 
          className={styles.actionButton}
          onClick={() => onAction(action.action)}
        >
          <span className={styles.icon}>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;