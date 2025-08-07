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
  FiSettings,
  FiShare2,
  FiCopy,
  FiCheck,
  FiX,
  FiEdit,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMessageCircle,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiHome,
  FiLayers,
  FiFile
} from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard/StatsCard';
import CampaignCard from '../../components/campaigns/CampaignCard/CampaignCard';
import CampaignFilter from '../../components/campaigns/CampaignFilter/CampaignFilter';
import TrafficSources from '../../components/ui/TrafficSources/TrafficSources';
import NotificationPanel from '../../components/ui/NotificationPanel/NotificationPanel';
import styles from './Dashboard.module.scss';

interface Campaign {
  id: string;
  name: string;
  niche: string;
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
  action?: () => void;
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
  leadsGenerated: number;
  epc: number;
  cr: number;
  returnRate: number;
}

const PublisherDashboard = () => {
  const authContext = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'trackingLinks' | 'earnings' | 'documents' | 'settings'>('dashboard');
  const [filter, setFilter] = useState({
    status: '',
    dateRange: '30d',
    searchQuery: '',
    type: '',
    niche: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const niches = Array.from(new Set(campaigns.map(campaign => campaign.niche)));
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
    leadsGenerated: 142,
    epc: 2.15,
    cr: 5.2,
    returnRate: 2.1
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es' | 'ru'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
      if (mobileActionsRef.current && !mobileActionsRef.current.contains(event.target as Node)) {
        setMobileActionsOpen(false);
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
        source: 'Google Ads',
        leadsCount: 142,
        epc: 1.5,
        cr: 5.0
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
        source: 'Facebook Ads',
        leadsCount: 98,
        epc: 1.3,
        cr: 6.4
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
        source: 'Email',
        leadsCount: 43,
        epc: 0.98,
        cr: 4.9
      },
      { 
        id: '4', 
        name: 'Personal Loans AU', 
        niche: 'Personal Loans',
        status: 'moderation', 
        ctr: '0.0%', 
        clicks: 0, 
        conversions: 0, 
        revenue: 0, 
        payout: 0,
        startDate: '2023-06-01',
        landingPage: 'https://example.com/personal-loans',
        source: 'Google Ads',
        leadsCount: 0,
        epc: 0,
        cr: 0
      },
      { 
        id: '5', 
        name: 'Student Loans CA', 
        niche: 'Education',
        status: 'rejected', 
        ctr: '0.0%', 
        clicks: 0, 
        conversions: 0, 
        revenue: 0, 
        payout: 0,
        startDate: '2023-05-25',
        landingPage: 'https://example.com/student-loans',
        source: 'Facebook Ads',
        leadsCount: 0,
        epc: 0,
        cr: 0
      }
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
      leadsGenerated: 142,
      epc: 2.15,
      cr: 5.2,
      returnRate: 2.1
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
        type: 'warning', 
        message: 'Campaign "Student Loans CA" was rejected', 
        time: '2 hours ago', 
        read: false,
        action: () => setActiveTab('campaigns')
      },
      { 
        id: '3', 
        type: 'info', 
        message: 'Campaign "Personal Loans AU" requires moderation', 
        time: '3 hours ago', 
        read: false,
        action: () => setActiveTab('campaigns')
      },
      { 
        id: '4', 
        type: 'success', 
        message: 'Payout $1,250 processed', 
        time: '3 days ago', 
        read: true 
      },
      { 
        id: '5', 
        type: 'warning', 
        message: 'Lead return from Auto Insurance campaign', 
        time: '1 day ago', 
        read: false 
      },
      { 
        id: '6', 
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
    // В реальном приложении здесь будет API запрос
    alert(`Campaign ${action} action triggered for ID: ${campaignId}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  const toggleLanguage = (lang: 'en' | 'es' | 'ru') => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
    alert(`Language changed to ${lang}`);
  };

  const requestPayout = () => {
    if (stats.balance >= 100) {
      console.log('Requesting payout:', stats.balance);
      setStats(prev => ({ ...prev, balance: 0 }));
      alert(`Payout requested for $${stats.balance}`);
    } else {
      console.log('Minimum payout is $100');
      alert('Minimum payout amount is $100');
    }
  };

  const navigate = (path: string) => {
    console.log('Navigating to:', path);
    setProfileMenuOpen(false);
    // В реальном приложении здесь будет навигация
    alert(`Navigating to: ${path}`);
  };
  
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // В реальном приложении здесь будет обновление данных
    alert(`Date range changed to: ${range}`);
  };

  return (
    <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {/* Top Navigation Bar */}
      <div className={styles.topNav}>
        <div className={styles.brand}>
          <span className={styles.logo}>🚀</span>
          <h1>LeadSpace</h1>
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
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        notification.action?.();
                      }}
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
                  <button onClick={() => { 
                    setProfileMenuOpen(false); 
                    setAiAssistantOpen(true);
                  }}>
                    <FiMessageCircle />
                    <span>AI Manager</span>
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
          
          {/* Mobile only actions menu */}
          <button 
            className={styles.mobileActionsMenu}
            onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
          >
            •••
          </button>
        </div>
      </div>
      
      {/* Mobile actions dropdown */}
      {mobileActionsOpen && (
        <div className={styles.mobileActionsDropdown} ref={mobileActionsRef}>
          <button className={styles.actionItem} onClick={() => handleCampaignAction('new', 'create')}>
            <FiPlus />
            <span>Create Campaign</span>
          </button>
          <button className={styles.actionItem} onClick={() => navigate('/tracking-links')}>
            <FiLink />
            <span>Create Tracking Link</span>
          </button>
          <button className={styles.actionItem} onClick={() => setAiAssistantOpen(true)}>
            <FiMessageCircle />
            <span>AI Manager</span>
          </button>
          <button className={styles.actionItem} onClick={() => navigate('/settings')}>
            <FiSettings />
            <span>Settings</span>
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <nav className={styles.primaryNav}>
          <ul>
            <li className={activeTab === 'dashboard' ? styles.active : ''}>
              <button onClick={() => handleTabClick('dashboard')}>
                <FiHome />
                <span>Overview</span>
              </button>
            </li>
            <li className={activeTab === 'campaigns' ? styles.active : ''}>
              <button onClick={() => handleTabClick('campaigns')}>
                <FiLayers />
                <span>My Campaigns</span>
              </button>
            </li>
            <li className={activeTab === 'trackingLinks' ? styles.active : ''}>
              <button onClick={() => handleTabClick('trackingLinks')}>
                <FiShare2 />
                <span>Tracking Links</span>
              </button>
            </li>
            <li className={activeTab === 'earnings' ? styles.active : ''}>
              <button onClick={() => handleTabClick('earnings')}>
                <FiDollarSign />
                <span>Earnings & Payouts</span>
              </button>
            </li>
            <li className={activeTab === 'documents' ? styles.active : ''}>
              <button onClick={() => handleTabClick('documents')}>
                <FiFile />
                <span>Documents</span>
              </button>
            </li>
            <li className={activeTab === 'settings' ? styles.active : ''}>
              <button onClick={() => handleTabClick('settings')}>
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
              {activeTab === 'documents' && 'Documents & Contracts'}
              {activeTab === 'settings' && 'Profile Settings'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Your performance overview'}
              {activeTab === 'campaigns' && 'Manage and track your campaigns'}
              {activeTab === 'trackingLinks' && 'Create and manage your tracking links'}
              {activeTab === 'earnings' && 'View earnings and payout history'}
              {activeTab === 'documents' && 'Legal documents and contracts'}
              {activeTab === 'settings' && 'Update your profile and preferences'}
            </p>
          </div>
          <div className={styles.headerRight}>
            {activeTab !== 'settings' && (
              <div className={styles.dateRangeSelector}>
                <select 
                  value={dateRange} 
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
            )}
            {activeTab === 'campaigns' && (
              <button 
                className={styles.addCampaignButton}
                onClick={() => handleCampaignAction('new', 'create')}
              >
                <FiPlus /> Add Campaign
              </button>
            )}
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
                  title="Leads Generated" 
                  value={stats.leadsGenerated} 
                  change={stats.conversionsChange} 
                  icon={<FiUser />}
                  color="#00F5FF"
                />
                <StatsCard 
                  title="Total Revenue" 
                  value={`$${stats.revenue.toLocaleString()}`} 
                  change={stats.revenueChange} 
                  icon={<FiDollarSign />}
                  color="#9D00FF"
                />
                <StatsCard 
                  title="EPC" 
                  value={`$${stats.epc.toFixed(2)}`} 
                  change={8.5} 
                  icon={<FiTrendingUp />}
                  color="#26DE81"
                />
                <StatsCard 
                  title="CR" 
                  value={`${stats.cr.toFixed(1)}%`} 
                  change={1.2} 
                  icon={<FiPieChart />}
                  color="#FED330"
                />
                <StatsCard 
                  title="Return Rate" 
                  value={`${stats.returnRate.toFixed(1)}%`} 
                  change={-0.3} 
                  icon={<FiBarChart2 />}
                  color="#FF4D9D"
                />
                <StatsCard 
                  title="Balance" 
                  value={`$${stats.balance.toLocaleString()}`} 
                  change={0} 
                  icon={<FiCreditCard />}
                  color="#00F5FF"
                />
              </section>

              <div className={styles.analyticsGrid}>
                <div className={styles.chartContainer}>
                  <h3>Performance Overview</h3>
                  <div className={styles.chartPlaceholder}>
                    <div className={styles.chartLegend}>
                      <span style={{ backgroundColor: '#00F5FF' }}>Leads</span>
                      <span style={{ backgroundColor: '#9D00FF' }}>Revenue</span>
                      <span style={{ backgroundColor: '#26DE81' }}>EPC</span>
                    </div>
                    Performance chart visualization
                  </div>
                </div>
                
                <TrafficSources sources={stats.trafficSources} />
              </div>
              
              <div className={styles.tableWrapper}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Active Campaigns</h3>
                  <button 
                    className={styles.viewAllButton}
                    onClick={() => setActiveTab('campaigns')}
                  >
                    View All
                  </button>
                </div>
                <div className={styles.leadsGrid}>
                  {stats.topCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onEdit={() => handleCampaignAction(campaign.id, 'edit')}
                      onPause={() => handleCampaignAction(campaign.id, 'pause')}
                      onArchive={() => handleCampaignAction(campaign.id, 'archive')}
                    />
                  ))}
                </div>
              </div>
              
              <NotificationPanel notifications={notifications.slice(0, 3)} />
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
                  color="#00F5FF"
                />
                <StatsCard 
                  title="Avg CTR" 
                  value="2.4%" 
                  change={1.2} 
                  icon={<FiBarChart2 />}
                  color="#9D00FF"
                />
                <StatsCard 
                  title="Avg EPC" 
                  value={`$${1.75.toFixed(2)}`} 
                  change={0.8} 
                  icon={<FiTrendingUp />}
                  color="#26DE81"
                />
                <StatsCard 
                  title="Total Payout" 
                  value={`$${stats.payout.toLocaleString()}`} 
                  change={stats.payoutChange} 
                  icon={<FiDollarSign />}
                  color="#FED330"
                />
              </section>

              <CampaignFilter 
                filter={filter}
                onFilterChange={handleFilterChange}
                niches={niches}
              />
              
              {filteredCampaigns.length > 0 ? (
                <div className={styles.leadsGrid}>
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onEdit={() => handleCampaignAction(campaign.id, 'edit')}
                      onPause={() => handleCampaignAction(campaign.id, 'pause')}
                      onArchive={() => handleCampaignAction(campaign.id, 'archive')}
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
                    <tr>
                      <td>Publisher Agreement</td>
                      <td>Contract</td>
                      <td>2023-01-15</td>
                      <td>
                        <span className={`${styles.status} ${styles.active}`}>
                          signed
                        </span>
                      </td>
                      <td>
                        <button className={styles.resetButton} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                          View
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>DPA Compliance</td>
                      <td>Data Agreement</td>
                      <td>2023-01-15</td>
                      <td>
                        <span className={`${styles.status} ${styles.active}`}>
                          signed
                        </span>
                      </td>
                      <td>
                        <button className={styles.resetButton} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                          View
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Exclusive Partnership</td>
                      <td>Contract</td>
                      <td>2023-05-20</td>
                      <td>
                        <span className={`${styles.status} ${styles.paused}`}>
                          pending
                        </span>
                      </td>
                      <td>
                        <button className={styles.resetButton} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                          Sign
                        </button>
                      </td>
                    </tr>
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