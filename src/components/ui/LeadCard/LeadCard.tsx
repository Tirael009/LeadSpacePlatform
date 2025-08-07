import React from 'react';
import { 
  FiShoppingCart, 
  FiMapPin, 
  FiClock, 
  FiDollarSign,
  FiUser,
  FiTrendingUp,
  FiStar,
  FiInfo
} from 'react-icons/fi';
import styles from './LeadCard.module.scss';

export interface Lead {
  id: string;
  type: string;
  region: string;
  city: string;
  time: string;
  aiScore: number;
  price: number;
  description: string;
  badges: string[];
  income?: number;
  age?: number;
  creditScore?: number;
  loanAmount?: number;
  urgency?: number;
  isFavorite?: boolean;
  isExclusive?: boolean;
}

interface LeadCardProps {
  lead: Lead;
  inCart: boolean;
  onAddToCart: () => void;
  onToggleFavorite?: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  inCart, 
  onAddToCart,
  onToggleFavorite
}) => {
  return (
    <div className={styles.leadCard}>
      {lead.isExclusive && (
        <div className={styles.exclusiveBadge}>
          <FiInfo /> Эксклюзивный лид
        </div>
      )}
      
      <div className={styles.leadHeader}>
        <div className={styles.leadType}>{lead.type}</div>
        <div className={styles.aiScore}>
          <span className={styles.scoreValue}>{lead.aiScore}%</span>
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreFill} 
              style={{ width: `${lead.aiScore}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className={styles.leadMeta}>
        <div className={styles.metaItem}>
          <FiMapPin />
          <span>{lead.city}, {lead.region}</span>
        </div>
        <div className={styles.metaItem}>
          <FiClock />
          <span>{lead.time}</span>
        </div>
        {lead.income && (
          <div className={styles.metaItem}>
            <FiTrendingUp />
            <span>{(lead.income / 1000).toFixed(0)}K ₽/мес</span>
          </div>
        )}
        {lead.age && (
          <div className={styles.metaItem}>
            <FiUser />
            <span>{lead.age} лет</span>
          </div>
        )}
        {lead.creditScore && (
          <div className={styles.metaItem}>
            <FiDollarSign />
            <span>Кредитный рейтинг: {lead.creditScore}</span>
          </div>
        )}
        {lead.urgency !== undefined && (
          <div className={styles.metaItem}>
            <FiInfo />
            <span>Срочность: {lead.urgency}/10</span>
          </div>
        )}
      </div>
      
      <div className={styles.leadDescription}>
        {lead.description}
      </div>
      
      <div className={styles.leadFooter}>
        <div className={styles.price}>
          <FiDollarSign /> {lead.price.toLocaleString('ru-RU')} ₽
        </div>
        
        <div className={styles.badges}>
          {lead.badges.map((badge, index) => (
            <span 
              key={index} 
              className={`${styles.badge} ${
                badge === 'premium' ? styles.premium : 
                badge === 'unique' ? styles.unique : 
                badge === 'new' ? styles.new : 
                badge === 'vip' ? styles.vip : 
                badge === 'hot' ? styles.hot : ''
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        
        <div className={styles.actions}>
          {onToggleFavorite && (
            <button 
              className={`${styles.favoriteButton} ${lead.isFavorite ? styles.active : ''}`}
              onClick={() => onToggleFavorite?.(lead.id)}
            >
              <FiStar />
            </button>
          )}
          
          <button 
            className={`${styles.cartButton} ${inCart ? styles.inCart : ''}`}
            onClick={onAddToCart}
          >
            <FiShoppingCart />
            {inCart ? 'В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeadCard);