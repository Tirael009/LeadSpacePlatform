import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiPieChart,
  FiSettings,
  FiBell,
  FiHelpCircle,
  FiPlus,
  FiBarChart2,
  FiCreditCard,
  FiLink,
  FiUsers
} from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard/StatsCard';
import CampaignCard from '../../components/campaigns/CampaignCard/CampaignCard';
import CampaignFilter from '../../components/campaigns/CampaignFilter/CampaignFilter';
import NotificationPanel from '../../components/ui/NotificationPanel/NotificationPanel';
import QuickActions from '../../components/ui/QuickActions/QuickActions';
import TrafficSources from '../../components/ui/TrafficSources/TrafficSources';
import ResourceUsage from '../../components/ui/ResourceUsage/ResourceUsage';
import styles from './Dashboard.module.scss';

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

interface TrafficSource {
  name: string;
  value: number;
  change: number;
  color: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
}

const PublisherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'traffic' | 'earnings'>('dashboard');
  const [filter, setFilter] = useState({
    status: '',
    dateRange: '30d',
    searchQuery: '',
    type: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    clicksChange: 0,
    totalConversions: 0,
    conversionsChange: 0,
    revenue: 0,
    revenueChange: 0,
    payout: 0,
    payoutChange: 0,
    topCampaigns: [] as Campaign[],
    trafficSources: [] as TrafficSource[],
    recentPayouts: [] as Array<{date: string; amount: number; status: string}>
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      { 
        id: '1', 
        name: 'Mortgage Leads US', 
        status: 'active', 
        ctr: '3.2%', 
        clicks: 2845, 
        conversions: 142, 
        revenue: 2840, 
        payout: 2130,
        startDate: '2023-04-15'
      },
      { 
        id: '2', 
        name: 'Auto Insurance CA', 
        status: 'active', 
        ctr: '2.1%', 
        clicks: 1532, 
        conversions: 98, 
        revenue: 1960, 
        payout: 1470,
        startDate: '2023-05-01'
      },
      { 
        id: '3', 
        name: 'Credit Cards UK', 
        status: 'paused', 
        ctr: '1.8%', 
        clicks: 876, 
        conversions: 43, 
        revenue: 860, 
        payout: 645,
        startDate: '2023-03-10',
        endDate: '2023-05-20'
      },
    ];

    const mockStats = {
      totalClicks: 5253,
      clicksChange: 8,
      totalConversions: 283,
      conversionsChange: 12,
      revenue: 5660,
      revenueChange: 15,
      payout: 4245,
      payoutChange: 10,
      topCampaigns: mockCampaigns.slice(0, 2),
      trafficSources: [
        { name: 'Organic', value: 45, change: 5, color: '#00F5FF' },
        { name: 'Social', value: 25, change: -2, color: '#9D00FF' },
        { name: 'Email', value: 15, change: 3, color: '#FF4D9D' },
        { name: 'Referral', value: 10, change: 1, color: '#26DE81' },
        { name: 'Direct', value: 5, change: -1, color: '#FED330' }
      ],
      recentPayouts: [
        { date: '2023-05-15', amount: 1250, status: 'processed' },
        { date: '2023-04-30', amount: 980, status: 'processed' },
        { date: '2023-04-15', amount: 1100, status: 'processed' }
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
      }
    ];

    setCampaigns(mockCampaigns);
    setStats(mockStats);
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = !filter.status || campaign.status === filter.status;
    const matchesSearch = !filter.searchQuery || 
      campaign.name.toLowerCase().includes(filter.searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
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
  };

  return (
    <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {/* Top Navigation Bar */}
      <div className={styles.topNav}>
        <div className={styles.brand}>
          <span className={styles.logo}>🚀</span>
          <h1>LeadSpace Publisher</h1>
        </div>
        
        <div className={styles.navControls}>
          <button 
            className={styles.notificationButton}
            onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          >
            <FiBell />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          
          <div className={styles.userMenu}>
            <img 
              src={user?.avatar || 'https://i.pravatar.cc/300'} 
              alt="User" 
              className={styles.avatar}
            />
            <span>{user?.firstName} {user?.lastName}</span>
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
                <span>Dashboard</span>
              </button>
            </li>
            <li className={activeTab === 'campaigns' ? styles.active : ''}>
              <button onClick={() => setActiveTab('campaigns')}>
                <FiLink />
                <span>Campaigns</span>
              </button>
            </li>
            <li className={activeTab === 'traffic' ? styles.active : ''}>
              <button onClick={() => setActiveTab('traffic')}>
                <FiBarChart2 />
                <span>Traffic</span>
              </button>
            </li>
            <li className={activeTab === 'earnings' ? styles.active : ''}>
              <button onClick={() => setActiveTab('earnings')}>
                <FiDollarSign />
                <span>Earnings</span>
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
          campaignsUsed={campaigns.length} 
          campaignsLimit={50} 
          trafficUsed={85} 
          trafficLimit={100}
        />
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <h1>
              {activeTab === 'dashboard' && 'Publisher Dashboard'}
              {activeTab === 'campaigns' && 'Campaign Management'}
              {activeTab === 'traffic' && 'Traffic Analytics'}
              {activeTab === 'earnings' && 'Earnings & Payouts'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Your performance overview'}
              {activeTab === 'campaigns' && 'Manage and track your campaigns'}
              {activeTab === 'traffic' && 'Analyze your traffic sources'}
              {activeTab === 'earnings' && 'View earnings and payout history'}
            </p>
          </div>
          
          <QuickActions 
            actions={[
              { icon: <FiPlus />, label: 'New Campaign', action: 'new_campaign' },
              { icon: <FiLink />, label: 'Tracking Link', action: 'tracking_link' },
              { icon: <FiCreditCard />, label: 'Request Payout', action: 'request_payout' }
            ]} 
            onAction={handleQuickAction}
          />
        </header>

        {/* Notification Panel */}
        {notificationPanelOpen && (
          <NotificationPanel 
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onClose={() => setNotificationPanelOpen(false)}
          />
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
                    onClick={() => setFilter({ status: '', dateRange: '30d', searchQuery: '', type: '' })}
                    className={styles.resetButton}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'traffic' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Total Traffic" 
                  value={stats.totalClicks} 
                  change={stats.clicksChange} 
                  icon={<FiTrendingUp />}
                />
                <StatsCard 
                  title="Conversion Rate" 
                  value={`${Math.round((stats.totalConversions / stats.totalClicks) * 100)}%`} 
                  change={stats.conversionsChange} 
                  icon={<FiPieChart />}
                />
                <StatsCard 
                  title="Top Source" 
                  value={stats.trafficSources[0]?.name || 'N/A'} 
                  change={stats.trafficSources[0]?.change || 0} 
                  icon={<FiBarChart2 />}
                />
              </section>

              <div className={styles.analyticsGrid}>
                <div className={styles.chartContainer}>
                  <h3>Traffic Sources</h3>
                  <div className={styles.chartPlaceholder}>
                    Traffic sources breakdown chart
                  </div>
                </div>
                
                <div className={styles.chartContainer}>
                  <h3>Daily Traffic</h3>
                  <div className={styles.chartPlaceholder}>
                    Daily traffic trends chart
                  </div>
                </div>
              </div>
              
              <div className={styles.tableWrapper}>
                <h3 className={styles.sectionTitle}>Source Performance</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Clicks</th>
                      <th>Conversions</th>
                      <th>Conversion Rate</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.trafficSources.map(source => (
                      <tr key={source.name}>
                        <td>{source.name}</td>
                        <td>{Math.round(source.value * stats.totalClicks / 100)}</td>
                        <td>{Math.round(source.value * stats.totalConversions / 100)}</td>
                        <td>{Math.round((stats.totalConversions / stats.totalClicks) * 100)}%</td>
                        <td>${Math.round(source.value * stats.revenue / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'earnings' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Total Earnings" 
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
                <StatsCard 
                  title="Next Payout" 
                  value="June 30" 
                  change={0} 
                  icon={<FiCreditCard />}
                />
              </section>

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
                        <td>Bank Transfer</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublisherDashboard;