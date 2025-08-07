import React, { useState } from 'react';
import styles from './CampaignCard.module.scss';
import { 
  FiPause, 
  FiPlay, 
  FiEdit2, 
  FiArchive, 
  FiBarChart2,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
  FiClock
} from 'react-icons/fi';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived' | 'moderation' | 'rejected';
  ctr: string;
  clicks: number;
  conversions: number;
  revenue: number;
  payout: number;
  startDate: string;
  endDate?: string;
  landingPage: string;
  source: string;
  leadsCount: number;
  epc: number;
  cr: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onPause: () => void;
  onArchive: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onPause,
  onArchive
}) => {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'active': return <FiPlay />;
      case 'paused': return <FiPause />;
      case 'archived': return <FiArchive />;
      case 'moderation': return <FiClock />;
      case 'rejected': return <FiAlertTriangle />;
      default: return <FiBarChart2 />;
    }
  };

  return (
    <div className={`${styles.card} ${styles[campaign.status]} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.titleContainer}>
          <h3>{campaign.name}</h3>
          <span className={`${styles.status} ${styles[campaign.status]}`}>
            {getStatusIcon()}
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.toggleButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          <div className={styles.menuContainer}>
            <button 
              className={styles.menuButton}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              •••
            </button>
            
            {menuOpen && (
              <div className={styles.menuDropdown}>
                {campaign.status === 'active' ? (
                  <button onClick={() => { onPause(); setMenuOpen(false); }} className={styles.menuItem}>
                    <FiPause /> Pause Campaign
                  </button>
                ) : campaign.status === 'paused' ? (
                  <button onClick={() => { onPause(); setMenuOpen(false); }} className={styles.menuItem}>
                    <FiPlay /> Resume Campaign
                  </button>
                ) : null}
                
                {campaign.status === 'moderation' && (
                  <button onClick={() => { onEdit(); setMenuOpen(false); }} className={styles.menuItem}>
                    <FiEdit2 /> Edit Submission
                  </button>
                )}
                
                {campaign.status === 'rejected' && (
                  <button onClick={() => { onEdit(); setMenuOpen(false); }} className={styles.menuItem}>
                    <FiEdit2 /> Resubmit
                  </button>
                )}
                
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className={styles.menuItem}>
                  <FiEdit2 /> Edit Campaign
                </button>
                
                {campaign.status !== 'archived' && campaign.status !== 'moderation' && campaign.status !== 'rejected' && (
                  <button onClick={() => { onArchive(); setMenuOpen(false); }} className={styles.menuItem}>
                    <FiArchive /> Archive Campaign
                  </button>
                )}
                
                <button onClick={() => { setMenuOpen(false); }} className={styles.menuItem}>
                  <FiBarChart2 /> View Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.metricRow}>
          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <FiUser />
            </div>
            <div>
              <div className={styles.metricLabel}>Leads</div>
              <div className={styles.metricValue}>{campaign.leadsCount}</div>
            </div>
          </div>
          
          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <FiBarChart2 />
            </div>
            <div>
              <div className={styles.metricLabel}>EPC</div>
              <div className={styles.metricValue}>${campaign.epc.toFixed(2)}</div>
            </div>
          </div>
          
          <div className={styles.metric}>
            <div className={styles.metricIcon}>
              <FiBarChart2 />
            </div>
            <div>
              <div className={styles.metricLabel}>CR</div>
              <div className={styles.metricValue}>{campaign.cr.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        <div className={styles.revenueRow}>
          <div className={styles.revenue}>
            <div className={styles.revenueLabel}>Revenue</div>
            <div className={styles.revenueValue}>${campaign.revenue.toLocaleString()}</div>
          </div>
          <div className={styles.revenue}>
            <div className={styles.revenueLabel}>Your Payout</div>
            <div className={styles.revenueValue}>${campaign.payout.toLocaleString()}</div>
          </div>
        </div>
        
        <div className={styles.dates}>
          <div>
            <div className={styles.dateLabel}>Started</div>
            <div className={styles.dateValue}>{formatDate(campaign.startDate)}</div>
          </div>
          {campaign.endDate && (
            <div>
              <div className={styles.dateLabel}>Ended</div>
              <div className={styles.dateValue}>{formatDate(campaign.endDate)}</div>
            </div>
          )}
        </div>
        
        {expanded && (
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>Landing Page:</span>
              <a 
                href={campaign.landingPage} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.detailValue}
              >
                {campaign.landingPage}
              </a>
            </div>
            <div className={styles.detailRow}>
              <span>Source:</span>
              <span className={styles.detailValue}>{campaign.source}</span>
            </div>
            {campaign.status === 'moderation' && (
              <div className={styles.detailRow}>
                <span>Status:</span>
                <span className={styles.detailValue} style={{ color: '#FED330' }}>
                  <FiClock /> Waiting for approval
                </span>
              </div>
            )}
            {campaign.status === 'rejected' && (
              <div className={styles.detailRow}>
                <span>Status:</span>
                <span className={styles.detailValue} style={{ color: '#FF4D4D' }}>
                  <FiAlertTriangle /> Rejected - requires changes
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;