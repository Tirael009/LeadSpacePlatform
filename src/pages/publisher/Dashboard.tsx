import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiPieChart,
  FiBell,
  FiHelpCircle,
  FiPlus,
  FiBarChart2,
  FiCreditCard,
  FiLink,
  FiUsers,
  FiAward,
  FiBookOpen,
  FiUserPlus,
  FiFileText,
  FiSettings,
  FiShare2,
  FiCopy,
  FiCheck,
  FiX,
  FiPlay,
  FiEdit,
  FiDownload,
  FiSearch,
  FiZap,
  FiUser,
  FiLock,
  FiLogOut,
  FiMessageCircle,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard/StatsCard';
import CampaignCard from '../../components/campaigns/CampaignCard/CampaignCard';
import CampaignFilter from '../../components/campaigns/CampaignFilter/CampaignFilter';
import TrafficSources from '../../components/ui/TrafficSources/TrafficSources';
import ResourceUsage from '../../components/ui/ResourceUsage/ResourceUsage';
import styles from './Dashboard.module.scss';

interface Campaign {
  id: string;
  name: string;
  niche: string;
  status: 'active' | 'paused' | 'archived';
  ctr: string;
  clicks: number;
  conversions: number;
  revenue: number;
  payout: number;
  startDate: string;
  endDate?: string;
  landingPage: string;
  source: string;
}

interface TrafficSource {
  name: string;
  value: number;
  change: number;
  color: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
}

interface TrackingLink {
  id: string;
  name: string;
  url: string;
  campaign: string;
  created: string;
  clicks: number;
  conversions: number;
  geo: string;
  status: 'active' | 'paused';
}

interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
}

interface Referral {
  id: string;
  name: string;
  date: string;
  earnings: number;
  status: 'active' | 'pending' | 'inactive';
}

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'signed' | 'pending';
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string; 
}

interface DashboardStats {
  totalClicks: number;
  clicksChange: number;
  totalConversions: number;
  conversionsChange: number;
  revenue: number;
  revenueChange: number;
  payout: number;
  payoutChange: number;
  balance: number;
  topCampaigns: Campaign[];
  trafficSources: TrafficSource[];
  recentPayouts: { date: string; amount: number; status: string; method: string }[];
  reputation: {
    level: string;
    status: string;
    returnRate: number;
    leadsSold: number;
    aiRating: number;
    nextLevel: string;
  };
  badges: ReputationBadge[];
  courses: Course[];
  referrals: Referral[];
  documents: Document[];
}

const PublisherDashboard = () => {
  const authContext = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'trackingLinks' | 'earnings' | 'reputation' | 'learning' | 'referrals' | 'documents' | 'settings'>('dashboard');
  const [filter, setFilter] = useState({
    status: '',
    dateRange: '30d',
    searchQuery: '',
    type: '',
    niche: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    clicksChange: 0,
    totalConversions: 0,
    conversionsChange: 0,
    revenue: 0,
    revenueChange: 0,
    payout: 0,
    payoutChange: 0,
    balance: 1250,
    topCampaigns: [],
    trafficSources: [],
    recentPayouts: [],
    reputation: {
      level: 'Silver Partner',
      status: 'reliable',
      returnRate: 2.1,
      leadsSold: 283,
      aiRating: 4.7,
      nextLevel: 'Gold Publisher'
    },
    badges: [],
    courses: [],
    referrals: [],
    documents: []
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es' | 'ru'>('en');
  const [timezone, setTimezone] = useState('GMT');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (authContext.user) {
      setUser({
        id: String(authContext.user.id),
        email: authContext.user.email,
        firstName: authContext.user.firstName || '',
        lastName: authContext.user.lastName || '',
        avatar: authContext.user.avatar,
        phone: authContext.user.phone,
      });
    } else {
      setUser(null);
    }
  }, [authContext.user]);

  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      { 
        id: '1', 
        name: 'Mortgage Leads US', 
        niche: 'Mortgage',
        status: 'active', 
        ctr: '3.2%', 
        clicks: 2845, 
        conversions: 142, 
        revenue: 2840, 
        payout: 2130,
        startDate: '2023-04-15',
        landingPage: 'https://example.com/mortgage',
        source: 'Google Ads'
      },
      { 
        id: '2', 
        name: 'Auto Insurance CA', 
        niche: 'Auto Loans',
        status: 'active', 
        ctr: '2.1%', 
        clicks: 1532, 
        conversions: 98, 
        revenue: 1960, 
        payout: 1470,
        startDate: '2023-05-01',
        landingPage: 'https://example.com/auto-insurance',
        source: 'Facebook Ads'
      },
      { 
        id: '3', 
        name: 'Credit Cards UK', 
        niche: 'Credit Cards',
        status: 'paused', 
        ctr: '1.8%', 
        clicks: 876, 
        conversions: 43, 
        revenue: 860, 
        payout: 645,
        startDate: '2023-03-10',
        endDate: '2023-05-20',
        landingPage: 'https://example.com/credit-cards',
        source: 'Email'
      },
    ];

    const mockTrackingLinks: TrackingLink[] = [
      {
        id: '1',
        name: 'Mortgage US Main',
        url: 'https://track.leadspace.com/mortgage?pub=123',
        campaign: 'Mortgage Leads US',
        created: '2023-05-15',
        clicks: 1420,
        conversions: 71,
        geo: 'US',
        status: 'active'
      },
      {
        id: '2',
        name: 'Auto Insurance CA',
        url: 'https://track.leadspace.com/auto?pub=123',
        campaign: 'Auto Insurance CA',
        created: '2023-05-20',
        clicks: 890,
        conversions: 45,
        geo: 'CA',
        status: 'active'
      }
    ];

    const mockStats: DashboardStats = {
      totalClicks: 5253,
      clicksChange: 8,
      totalConversions: 283,
      conversionsChange: 12,
      revenue: 5660,
      revenueChange: 15,
      payout: 4245,
      payoutChange: 10,
      balance: 1250,
      topCampaigns: mockCampaigns.slice(0, 2),
      trafficSources: [
        { name: 'Organic', value: 45, change: 5, color: '#00F5FF', clicks: 2364, conversions: 127, revenue: 2547 },
        { name: 'Social', value: 25, change: -2, color: '#9D00FF', clicks: 1313, conversions: 71, revenue: 1420 },
        { name: 'Email', value: 15, change: 3, color: '#FF4D9D', clicks: 788, conversions: 43, revenue: 860 },
        { name: 'Referral', value: 10, change: 1, color: '#26DE81', clicks: 525, conversions: 28, revenue: 560 },
        { name: 'Direct', value: 5, change: -1, color: '#FED330', clicks: 263, conversions: 14, revenue: 280 }
      ],
      recentPayouts: [
        { date: '2023-05-15', amount: 1250, status: 'processed', method: 'PayPal' },
        { date: '2023-04-30', amount: 980, status: 'processed', method: 'Bank Transfer' },
        { date: '2023-04-15', amount: 1100, status: 'processed', method: 'PayPal' }
      ],
      reputation: {
        level: 'Silver Partner',
        status: 'reliable',
        returnRate: 2.1,
        leadsSold: 283,
        aiRating: 4.7,
        nextLevel: 'Gold Publisher'
      },
      badges: [
        { id: '1', name: '100 Leads Without Return', description: 'Generated 100 leads without any returns', earned: true },
        { id: '2', name: 'Auto Loans Expert', description: 'Top performer in auto loans niche', earned: true },
        { id: '3', name: 'Gold Publisher', description: 'Achieve Gold level status', earned: false },
        { id: '4', name: 'Quick Starter', description: 'Reached first $1000 in first month', earned: true }
      ],
      courses: [
        { 
          id: '1', 
          title: 'Lead Generation Mastery', 
          description: 'Complete guide to maximizing your earnings through effective lead generation strategies', 
          progress: 35, 
          duration: '8h 30m' 
        }
      ],
      referrals: [
        { id: '1', name: 'John Smith', date: '2023-04-10', earnings: 125, status: 'active' },
        { id: '2', name: 'Emma Johnson', date: '2023-05-05', earnings: 0, status: 'pending' },
        { id: '3', name: 'Mike Brown', date: '2023-03-22', earnings: 85, status: 'inactive' }
      ],
      documents: [
        { id: '1', name: 'Publisher Agreement', type: 'Contract', date: '2023-01-15', status: 'signed' },
        { id: '2', name: 'DPA Compliance', type: 'Data Agreement', date: '2023-01-15', status: 'signed' },
        { id: '3', name: 'Exclusive Partnership', type: 'Contract', date: '2023-05-20', status: 'pending' }
      ]
    };

    const mockNotifications: Notification[] = [
      { 
        id: '1', 
        type: 'success', 
        message: 'New conversion from Mortgage Leads', 
        time: '15 min ago', 
        read: false 
      },
      { 
        id: '2', 
        type: 'info', 
        message: 'Campaign Credit Cards UK was paused', 
        time: '2 hours ago', 
        read: false 
      },
      { 
        id: '3', 
        type: 'success', 
        message: 'Payout $1,250 processed', 
        time: '3 days ago', 
        read: true 
      },
      { 
        id: '4', 
        type: 'warning', 
        message: 'Lead return from Auto Insurance campaign', 
        time: '1 day ago', 
        read: false 
      },
      { 
        id: '5', 
        type: 'info', 
        message: 'New course available: Advanced Lead Optimization', 
        time: '2 days ago', 
        read: true 
      }
    ];

    setCampaigns(mockCampaigns);
    setTrackingLinks(mockTrackingLinks);
    setStats(mockStats);
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = !filter.status || campaign.status === filter.status;
    const matchesSearch = !filter.searchQuery || 
      campaign.name.toLowerCase().includes(filter.searchQuery.toLowerCase());
    const matchesNiche = !filter.niche || campaign.niche === filter.niche;
    return matchesStatus && matchesSearch && matchesNiche;
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    console.log(`${action} campaign:`, campaignId);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    setQuickActionsOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleLanguage = (lang: 'en' | 'es' | 'ru') => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };

  const requestPayout = () => {
    if (stats.balance >= 100) {
      console.log('Requesting payout:', stats.balance);
      setStats(prev => ({ ...prev, balance: 0 }));
    } else {
      console.log('Minimum payout is $100');
    }
  };

  const navigate = (path: string) => {
    console.log('Navigating to:', path);
    setProfileMenuOpen(false);
  };

  return (
    <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {/* Top Navigation Bar */}
      <div className={styles.topNav}>
        <div className={styles.brand}>
          <span className={styles.logo}>🚀</span>
          <h1>LeadSpace Publisher</h1>
        </div>
        
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search campaigns, links, lead IDs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.navControls}>
          {/* Quick Actions Dropdown */}
          <div className={styles.quickActions} ref={quickActionsRef}>
            <button 
              className={styles.quickActionsButton}
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            >
              <FiZap />
              <span>Quick Actions</span>
            </button>
            {quickActionsOpen && (
              <div className={styles.quickActionsDropdown}>
                <button onClick={() => handleQuickAction('new_campaign')}>
                  <FiPlus />
                  <span>Create Campaign</span>
                </button>
                <button onClick={() => handleQuickAction('tracking_link')}>
                  <FiLink />
                  <span>Create Tracking Link</span>
                </button>
                <button onClick={() => handleQuickAction('request_payout')}>
                  <FiCreditCard />
                  <span>Request Payout</span>
                </button>
                <button onClick={() => handleQuickAction('report')}>
                  <FiBarChart2 />
                  <span>Campaign Report</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Financial Indicators */}
          <div className={styles.financialIndicators}>
            <div className={styles.indicator}>
              <FiDollarSign />
              <span>${stats.revenue.toLocaleString()}</span>
            </div>
            <div className={styles.indicator}>
              <FiCreditCard />
              <span>${stats.payout.toLocaleString()}</span>
            </div>
            <div className={styles.indicator}>
              <FiTrendingUp />
              <span>{stats.totalClicks.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Reputation Badge */}
          <div className={styles.reputationBadge}>
            <FiAward className={styles.badgeIcon} />
            <span className={styles.levelBadge}>{stats.reputation.level}</span>
            <span className={`${styles.status} ${styles[stats.reputation.status]}`}>
              {stats.reputation.status === 'reliable' ? 'Reliable' : 
               stats.reputation.status === 'verification' ? 'Verification' : 'Under Review'}
            </span>
          </div>
          
          {/* AI Assistant */}
          <button 
            className={styles.aiAssistant}
            onClick={() => setAiAssistantOpen(true)}
          >
            <FiMessageCircle />
            <span>AI Manager</span>
          </button>
          
          {/* Language and Timezone Dropdown */}
          <div className={styles.languageToggle} ref={languageRef}>
            <button 
              className={styles.languageButton}
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            >
              {language === 'en' ? 'EN' : language === 'es' ? 'ES' : 'RU'}
            </button>
            {languageMenuOpen && (
              <div className={styles.languageDropdown}>
                <button onClick={() => toggleLanguage('en')}>
                  English 🇬🇧
                </button>
                <button onClick={() => toggleLanguage('es')}>
                  Español 🇪🇸
                </button>
                <button onClick={() => toggleLanguage('ru')}>
                  Русский 🇷🇺
                </button>
                <div className={styles.timezoneSection}>
                  <label>Timezone</label>
                  <select 
                    value={timezone} 
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="PST">GMT-8:00 (PST)</option>
                    <option value="EST">GMT-5:00 (EST)</option>
                    <option value="GMT">GMT+0:00 (GMT)</option>
                    <option value="MSK">GMT+3:00 (MSK)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications Dropdown */}
          <div className={styles.notificationDropdown} ref={notificationsRef}>
            <button 
              className={styles.notificationButton}
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            >
              <FiBell />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>
            {notificationDropdownOpen && (
              <div className={styles.notificationDropdownMenu}>
                <div className={styles.notificationHeader}>
                  <h4>Notifications</h4>
                  <span>{unreadCount} unread</span>
                </div>
                <div className={styles.notificationList}>
                  {notifications.slice(0, 4).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
                      onClick={() => markNotificationAsRead(notification.id)}
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
                <button className={styles.viewAllButton} onClick={() => navigate('/notifications')}>
                  View All Notifications
                </button>
              </div>
            )}
          </div>
          
          {/* User Profile Dropdown */}
          <div 
            className={styles.userMenu} 
            ref={profileRef}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <img 
              src={user?.avatar || 'https://i.pravatar.cc/300'} 
              alt="User" 
              className={styles.avatar}
            />
            <span>{user?.firstName} {user?.lastName}</span>
            {profileMenuOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <img 
                    src={user?.avatar || 'https://i.pravatar.cc/300'} 
                    alt="User" 
                    className={styles.avatarLarge}
                  />
                  <div>
                    <strong>{user?.firstName} {user?.lastName}</strong>
                    <span>Publisher Account</span>
                  </div>
                </div>
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/profile')}>
                    <FiUser />
                    <span>My Profile</span>
                  </button>
                  <button onClick={() => navigate('/documents')}>
                    <FiFileText />
                    <span>Documents</span>
                  </button>
                  <button onClick={() => navigate('/security')}>
                    <FiLock />
                    <span>Security</span>
                  </button>
                  <button onClick={() => navigate('/settings')}>
                    <FiSettings />
                    <span>Account Settings</span>
                  </button>
                  <button onClick={authContext.logout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <nav className={styles.primaryNav}>
          <ul>
            <li className={activeTab === 'dashboard' ? styles.active : ''}>
              <button onClick={() => setActiveTab('dashboard')}>
                <FiTrendingUp />
                <span>Overview</span>
              </button>
            </li>
            <li className={activeTab === 'campaigns' ? styles.active : ''}>
              <button onClick={() => setActiveTab('campaigns')}>
                <FiLink />
                <span>My Campaigns</span>
              </button>
            </li>
            <li className={activeTab === 'trackingLinks' ? styles.active : ''}>
              <button onClick={() => setActiveTab('trackingLinks')}>
                <FiShare2 />
                <span>Tracking Links</span>
              </button>
            </li>
            <li className={activeTab === 'earnings' ? styles.active : ''}>
              <button onClick={() => setActiveTab('earnings')}>
                <FiDollarSign />
                <span>Earnings & Payouts</span>
              </button>
            </li>
            <li className={activeTab === 'reputation' ? styles.active : ''}>
              <button onClick={() => setActiveTab('reputation')}>
                <FiAward />
                <span>Reputation & Levels</span>
              </button>
            </li>
            <li className={activeTab === 'learning' ? styles.active : ''}>
              <button onClick={() => setActiveTab('learning')}>
                <FiBookOpen />
                <span>Learning</span>
              </button>
            </li>
            <li className={activeTab === 'referrals' ? styles.active : ''}>
              <button onClick={() => setActiveTab('referrals')}>
                <FiUserPlus />
                <span>Referrals</span>
              </button>
            </li>
            <li className={activeTab === 'documents' ? styles.active : ''}>
              <button onClick={() => setActiveTab('documents')}>
                <FiFileText />
                <span>Documents</span>
              </button>
            </li>
            <li className={activeTab === 'settings' ? styles.active : ''}>
              <button onClick={() => setActiveTab('settings')}>
                <FiSettings />
                <span>Profile Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.secondaryNav}>
          <h3>Tools</h3>
          <ul>
            <li>
              <button>
                <FiPlus />
                <span>Create Campaign</span>
              </button>
            </li>
            <li>
              <button>
                <FiPieChart />
                <span>Reports</span>
              </button>
            </li>
            <li>
              <button>
                <FiUsers />
                <span>Affiliates</span>
              </button>
            </li>
            <li>
              <button>
                <FiHelpCircle />
                <span>Support</span>
              </button>
            </li>
          </ul>
        </div>

        <ResourceUsage 
          leadsUsed={campaigns.length} 
          leadsLimit={50} 
          storageUsed={85} 
          storageLimit={100}
        />
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <h1>
              {activeTab === 'dashboard' && 'Publisher Dashboard'}
              {activeTab === 'campaigns' && 'Campaign Management'}
              {activeTab === 'trackingLinks' && 'Tracking Links'}
              {activeTab === 'earnings' && 'Earnings & Payouts'}
              {activeTab === 'reputation' && 'Reputation & Levels'}
              {activeTab === 'learning' && 'Learning Center'}
              {activeTab === 'referrals' && 'Referral Program'}
              {activeTab === 'documents' && 'Documents & Contracts'}
              {activeTab === 'settings' && 'Profile Settings'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Your performance overview'}
              {activeTab === 'campaigns' && 'Manage and track your campaigns'}
              {activeTab === 'trackingLinks' && 'Create and manage your tracking links'}
              {activeTab === 'earnings' && 'View earnings and payout history'}
              {activeTab === 'reputation' && 'Your reputation status and achievements'}
              {activeTab === 'learning' && 'Courses and resources to improve your skills'}
              {activeTab === 'referrals' && 'Invite others and earn bonuses'}
              {activeTab === 'documents' && 'Legal documents and contracts'}
              {activeTab === 'settings' && 'Update your profile and preferences'}
            </p>
          </div>
        </header>

        {/* AI Assistant Modal */}
        {aiAssistantOpen && (
          <div className={styles.aiAssistantModal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>AI Manager Assistant</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setAiAssistantOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.aiMessage}>
                  <p>Hi {user?.firstName}, I'm your AI Manager. How can I help you today?</p>
                </div>
                <div className={styles.aiSuggestions}>
                  <button>
                    <span>How can I improve my conversion rate?</span>
                  </button>
                  <button>
                    <span>Analyze my top campaigns</span>
                  </button>
                  <button>
                    <span>Recommend niches for me</span>
                  </button>
                  <button>
                    <span>Optimize my tracking links</span>
                  </button>
                </div>
                <div className={styles.aiInput}>
                  <input 
                    type="text" 
                    placeholder="Ask me anything about your campaigns..." 
                  />
                  <button>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {activeTab === 'dashboard' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Total Clicks" 
                  value={stats.totalClicks} 
                  change={stats.clicksChange} 
                  icon={<FiTrendingUp />}
                />
                <StatsCard 
                  title="Conversions" 
                  value={stats.totalConversions} 
                  change={stats.conversionsChange} 
                  icon={<FiPieChart />}
                />
                <StatsCard 
                  title="Revenue" 
                  value={`$${stats.revenue.toLocaleString()}`} 
                  change={stats.revenueChange} 
                  icon={<FiDollarSign />}
                />
                <StatsCard 
                  title="Your Payout" 
                  value={`$${stats.payout.toLocaleString()}`} 
                  change={stats.payoutChange} 
                  icon={<FiCreditCard />}
                />
              </section>

              <div className={styles.analyticsGrid}>
                <div className={styles.chartContainer}>
                  <h3>Top Campaigns</h3>
                  <div className={styles.chartPlaceholder}>
                    Top performing campaigns chart
                  </div>
                </div>
                
                <TrafficSources sources={stats.trafficSources} />
              </div>
              
              <div className={styles.tableWrapper}>
                <h3 className={styles.sectionTitle}>Recent Payouts</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayouts.map((payout, index) => (
                      <tr key={index}>
                        <td>{payout.date}</td>
                        <td>${payout.amount.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.status} ${styles.active}`}>
                            {payout.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.reputationCard}>
                <div className={styles.reputationHeader}>
                  <div className={styles.levelInfo}>
                    <h3>Your Reputation Status</h3>
                    <p>Current level: {stats.reputation.level}</p>
                  </div>
                  <div className={styles.levelStatus}>
                    <span className={styles.levelBadge}>{stats.reputation.level}</span>
                    <span className={`${styles.status} ${styles[stats.reputation.status]}`}>
                      {stats.reputation.status === 'reliable' ? 'Reliable' : 
                       stats.reputation.status === 'verification' ? 'Verification' : 'Under Review'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.reputationStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Return Rate</div>
                    <div className={styles.statValue}>{stats.reputation.returnRate}%</div>
                    <div className={styles.statChange}>-0.3% from last month</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Leads Sold</div>
                    <div className={styles.statValue}>{stats.reputation.leadsSold}</div>
                    <div className={styles.statChange}>+12% from last month</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>AI Rating</div>
                    <div className={styles.statValue}>{stats.reputation.aiRating}/5</div>
                    <div className={styles.statChange}>+0.2 from last month</div>
                  </div>
                </div>
                
                <div className={styles.nextLevel}>
                  <h4>Next Level: {stats.reputation.nextLevel}</h4>
                  <p>Reach 500 sold leads with less than 2% return rate to unlock premium features and higher payouts</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'campaigns' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Active Campaigns" 
                  value={campaigns.filter(c => c.status === 'active').length} 
                  change={5} 
                  icon={<FiLink />}
                />
                <StatsCard 
                  title="Avg CTR" 
                  value="2.4%" 
                  change={1.2} 
                  icon={<FiBarChart2 />}
                />
                <StatsCard 
                  title="Total Payout" 
                  value={`$${stats.payout.toLocaleString()}`} 
                  change={stats.payoutChange} 
                  icon={<FiDollarSign />}
                />
              </section>

              <CampaignFilter 
                filter={filter}
                onFilterChange={handleFilterChange}
              />
              
              {filteredCampaigns.length > 0 ? (
                <div className={styles.leadsGrid}>
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onEdit={() => handleCampaignAction(campaign.id, 'edit')}
                      onPause={() => handleCampaignAction(campaign.id, 'pause')}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No campaigns found matching your criteria</p>
                  <button 
                    onClick={() => setFilter({ status: '', dateRange: '30d', searchQuery: '', type: '', niche: '' })}
                    className={styles.resetButton}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'trackingLinks' && (
            <>
              <div className={styles.trackingLinkCard}>
                <div className={styles.linkHeader}>
                  <h3>Create New Tracking Link</h3>
                  <div className={styles.actions}>
                    <button>
                      <FiPlus /> Create
                    </button>
                  </div>
                </div>
                <p>Create a new tracking link for your campaign</p>
              </div>
              
              {trackingLinks.map(link => (
                <div key={link.id} className={styles.trackingLinkCard}>
                  <div className={styles.linkHeader}>
                    <h3>{link.name}</h3>
                    <div className={styles.actions}>
                      <button>
                        <FiEdit /> Edit
                      </button>
                      <button>
                        {link.status === 'active' ? <FiX /> : <FiCheck />}
                        {link.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.linkBody}>
                    <div className={styles.linkUrl}>{link.url}</div>
                    <button 
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(link.url)}
                    >
                      <FiCopy />
                    </button>
                  </div>
                  
                  <div className={styles.linkMeta}>
                    <div className={styles.metaItem}>
                      <div className={styles.metaLabel}>Campaign</div>
                      <div className={styles.metaValue}>{link.campaign}</div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaLabel}>Clicks</div>
                      <div className={styles.metaValue}>{link.clicks}</div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaLabel}>Conversions</div>
                      <div className={styles.metaValue}>{link.conversions}</div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaLabel}>Geo</div>
                      <div className={styles.metaValue}>{link.geo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'earnings' && (
            <>
              <div className={styles.balanceCard}>
                <div className={styles.balanceInfo}>
                  <div className={styles.balanceAmount}>${stats.balance.toLocaleString()}</div>
                  <button 
                    className={styles.payoutButton}
                    onClick={requestPayout}
                    disabled={stats.balance < 100}
                  >
                    Request Payout
                  </button>
                </div>
                <div className={styles.payoutNote}>
                  <strong>Note:</strong> Minimum payout amount is $100. {stats.balance < 100 && `You need $${(100 - stats.balance).toFixed(2)} more to request a payout.`}
                </div>
              </div>
              
              <div className={styles.chartContainer}>
                <h3>Earnings History</h3>
                <div className={styles.chartPlaceholder}>
                  Earnings over time chart
                </div>
              </div>
              
              <div className={styles.tableWrapper}>
                <h3 className={styles.sectionTitle}>Payout History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayouts.map((payout, index) => (
                      <tr key={index}>
                        <td>{payout.date}</td>
                        <td>${payout.amount.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.status} ${styles.active}`}>
                            {payout.status}
                          </span>
                        </td>
                        <td>{payout.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'reputation' && (
            <>
              <div className={styles.reputationCard}>
                <div className={styles.reputationHeader}>
                  <div className={styles.levelInfo}>
                    <h3>{stats.reputation.level}</h3>
                    <p>Your current publisher level</p>
                  </div>
                  <div className={styles.levelStatus}>
                    <span className={styles.levelBadge}>{stats.reputation.level}</span>
                    <span className={`${styles.status} ${styles[stats.reputation.status]}`}>
                      {stats.reputation.status === 'reliable' ? 'Reliable' : 
                       stats.reputation.status === 'verification' ? 'Verification' : 'Under Review'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.reputationStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Return Rate</div>
                    <div className={styles.statValue}>{stats.reputation.returnRate}%</div>
                    <div className={styles.statChange}>-0.3% from last month</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Leads Sold</div>
                    <div className={styles.statValue}>{stats.reputation.leadsSold}</div>
                    <div className={styles.statChange}>+12% from last month</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>AI Rating</div>
                    <div className={styles.statValue}>{stats.reputation.aiRating}/5</div>
                    <div className={styles.statChange}>+0.2 from last month</div>
                  </div>
                </div>
                
                <div className={styles.nextLevel}>
                  <h4>Next Level: {stats.reputation.nextLevel}</h4>
                  <p>Reach 500 sold leads with less than 2% return rate to unlock premium features and higher payouts</p>
                </div>
              </div>
              
              <h3 className={styles.sectionTitle}>Your Badges</h3>
              <div className={styles.badgesContainer}>
                {stats.badges.map(badge => (
                  <div key={badge.id} className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      {badge.earned ? <FiAward /> : <FiAward style={{ opacity: 0.3 }} />}
                    </div>
                    <div className={styles.badgeInfo}>
                      <h4>{badge.name}</h4>
                      <p>{badge.description}</p>
                      <span style={{ color: badge.earned ? '#26DE81' : '#FED330' }}>
                        {badge.earned ? 'Earned' : 'Not earned'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'learning' && (
            <>
              <h3 className={styles.sectionTitle}>Recommended Courses</h3>
              
              {stats.courses.map(course => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseImage}>
                    <FiPlay className={styles.playIcon} />
                  </div>
                  <div className={styles.courseContent}>
                    <h3>{course.title}</h3>
                    <p>{course.duration} • {course.description}</p>
                    
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: `${course.progress}%` }}></div>
                    </div>
                    
                    <div className={styles.progressInfo}>
                      <span>{course.progress}% completed</span>
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className={styles.courseActions}>
                      <button className={styles.primary}>
                        <FiPlay /> Continue
                      </button>
                      <button>
                        <FiDownload /> Resources
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className={styles.chartContainer}>
                <h3>Learning Resources</h3>
                <div className={styles.chartPlaceholder}>
                  Video tutorials, documentation and onboarding materials
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'referrals' && (
            <>
              <div className={styles.referralCard}>
                <div className={styles.referralHeader}>
                  <div className={styles.referralInfo}>
                    <h3>Referral Program</h3>
                    <p>Invite other publishers and earn <strong>+5%</strong> of their income for the first month</p>
                  </div>
                  <div className={styles.earningsBadge}>Earned: ${stats.referrals.reduce((sum, ref) => sum + ref.earnings, 0)}</div>
                </div>
                
                <div className={styles.referralLink}>
                  <input 
                    type="text" 
                    value="https://leadspace.com/join?ref=pub123" 
                    readOnly 
                  />
                  <button onClick={() => copyToClipboard('https://leadspace.com/join?ref=pub123')}>
                    <FiCopy /> Copy
                  </button>
                </div>
                
                <div className={styles.referralStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{stats.referrals.length}</div>
                    <div className={styles.statLabel}>Referred</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {stats.referrals.filter(r => r.status === 'active').length}
                    </div>
                    <div className={styles.statLabel}>Active</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      ${stats.referrals.reduce((sum, ref) => sum + ref.earnings, 0)}
                    </div>
                    <div className={styles.statLabel}>Earned</div>
                  </div>
                </div>
              </div>
              
              <div className={styles.tableWrapper}>
                <h3 className={styles.sectionTitle}>Referral History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Earnings</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.referrals.map(referral => (
                      <tr key={referral.id}>
                        <td>{referral.name}</td>
                        <td>{referral.date}</td>
                        <td>${referral.earnings.toFixed(2)}</td>
                        <td>
                          <span className={`${styles.status} ${referral.status === 'active' ? styles.active : 
                                          referral.status === 'pending' ? styles.paused : styles.archived}`}>
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'documents' && (
            <>
              <div className={styles.tableWrapper}>
                <h3 className={styles.sectionTitle}>Documents & Contracts</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.documents.map(doc => (
                      <tr key={doc.id}>
                        <td>{doc.name}</td>
                        <td>{doc.type}</td>
                        <td>{doc.date}</td>
                        <td>
                          <span className={`${styles.status} ${doc.status === 'signed' ? styles.active : styles.paused}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>
                          <button className={styles.resetButton} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                            {doc.status === 'signed' ? 'View' : 'Sign'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.chartContainer}>
                <h3>Document History</h3>
                <div className={styles.chartPlaceholder}>
                  History of document versions and acceptances
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'settings' && (
            <div className={styles.settingsForm}>
              <div className={styles.formSection}>
                <h3>Personal Information</h3>
                <div className={styles.formGroup}>
                  <div className={styles.inputField}>
                    <label>First Name</label>
                    <input type="text" value={user?.firstName || ''} />
                  </div>
                  <div className={styles.inputField}>
                    <label>Last Name</label>
                    <input type="text" value={user?.lastName || ''} />
                  </div>
                  <div className={styles.inputField}>
                    <label>Email</label>
                    <input type="email" value={user?.email || ''} />
                  </div>
                  <div className={styles.inputField}>
                    <label>Phone</label>
                    <input type="tel" value={user?.phone || '+1 (123) 456-7890'} />
                  </div>
                  <div className={styles.inputField}>
                    <label>Country</label>
                    <select>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3>Payout Settings</h3>
                <div className={styles.formGroup}>
                  <div className={styles.inputField}>
                    <label>Payout Method</label>
                    <select>
                      <option>PayPal</option>
                      <option>Bank Transfer (SEPA)</option>
                      <option>Cryptocurrency</option>
                      <option>Payoneer</option>
                    </select>
                  </div>
                  <div className={styles.inputField}>
                    <label>PayPal Email</label>
                    <input type="email" value="your@paypal.com" />
                  </div>
                  <div className={styles.inputField}>
                    <label>Bank Account (IBAN)</label>
                    <input type="text" placeholder="Enter IBAN for bank transfers" />
                  </div>
                  <div className={styles.inputField}>
                    <label>Crypto Wallet</label>
                    <input type="text" placeholder="Enter wallet address" />
                  </div>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3>Notification Preferences</h3>
                <div className={styles.notificationSettings}>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="new-payout" defaultChecked />
                    <label htmlFor="new-payout">New payouts</label>
                  </div>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="lead-returns" defaultChecked />
                    <label htmlFor="lead-returns">Lead returns</label>
                  </div>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="new-campaigns" defaultChecked />
                    <label htmlFor="new-campaigns">New campaigns</label>
                  </div>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="reputation" defaultChecked />
                    <label htmlFor="reputation">Reputation changes</label>
                  </div>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="new-courses" />
                    <label htmlFor="new-courses">New courses</label>
                  </div>
                  <div className={styles.notificationItem}>
                    <input type="checkbox" id="promotions" />
                    <label htmlFor="promotions">Promotions</label>
                  </div>
                </div>
              </div>
              
              <button className={styles.saveButton}>Save Changes</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublisherDashboard;