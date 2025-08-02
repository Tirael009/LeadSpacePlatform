import React from 'react';
import styles from './CampaignCard.module.scss';
import { FiPause, FiPlay, FiEdit2, FiArchive } from 'react-icons/fi';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  ctr: string;
  clicks: number;
  conversions: number;
  revenue: number;
  payout: number;
  startDate: string;
  endDate?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onPause: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onEdit, onPause }) => {
  return (
    <div className={`${styles.card} ${styles[campaign.status]}`}>
      <div className={styles.cardHeader}>
        <h3>{campaign.name}</h3>
        <span className={`${styles.status} ${styles[campaign.status]}`}>
          {campaign.status}
        </span>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.metricRow}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>CTR</span>
            <span className={styles.metricValue}>{campaign.ctr}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Clicks</span>
            <span className={styles.metricValue}>{campaign.clicks.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Conversions</span>
            <span className={styles.metricValue}>{campaign.conversions.toLocaleString()}</span>
          </div>
        </div>
        
        <div className={styles.revenueRow}>
          <div className={styles.revenue}>
            <span className={styles.revenueLabel}>Revenue</span>
            <span className={styles.revenueValue}>${campaign.revenue.toLocaleString()}</span>
          </div>
          <div className={styles.revenue}>
            <span className={styles.revenueLabel}>Your Payout</span>
            <span className={styles.revenueValue}>${campaign.payout.toLocaleString()}</span>
          </div>
        </div>
        
        <div className={styles.dates}>
          <span>Started: {new Date(campaign.startDate).toLocaleDateString()}</span>
          {campaign.endDate && <span>Ended: {new Date(campaign.endDate).toLocaleDateString()}</span>}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        {campaign.status === 'active' ? (
          <button onClick={onPause} className={styles.pauseButton}>
            <FiPause /> Pause
          </button>
        ) : (
          <button onClick={onPause} className={styles.playButton}>
            <FiPlay /> Resume
          </button>
        )}
        <button onClick={onEdit} className={styles.editButton}>
          <FiEdit2 /> Edit
        </button>
        <button className={styles.archiveButton}>
          <FiArchive /> Archive
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;