import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { readItems } from '@directus/sdk';
import { directus } from "../../api/directus";
import { 
  FiUsers, 
  FiTrendingUp, 
  FiDollarSign, 
  FiSettings,
  FiBell,
  FiHelpCircle,
  FiGrid,
  FiPieChart,
  FiCreditCard,
  FiFileText,
  FiShield,
  FiDatabase
} from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard/StatsCard';
import LeadCard from '../../components/leads/LeadCard';
import LeadFilter from '../../components/leads/LeadFilter';
import NotificationPanel from '../../components/ui/NotificationPanel/NotificationPanel';
import QuickActions from '../../components/ui/QuickActions/QuickActions';
import RecentActivity from '../../components/ui/RecentActivity/RecentActivity';
import ResourceUsage from '../../components/ui/ResourceUsage/ResourceUsage';
import styles from './Dashboard.module.scss';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  date: string;
  value?: number;
}

interface Payment {
  id: string;
  date: string;
  publisher: string;
  leadsCount: number;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
}

interface Stats {
  totalLeads: number;
  leadsChange: number;
  conversionRate: number;
  conversionChange: number;
  revenue: number;
  revenueChange: number;
  totalPaid: number;
  pendingAmount: number;
  recentPayments: Payment[];
  topSources: Array<{ name: string; count: number }>;
  teamPerformance: Array<{ name: string; conversion: number }>;
}

const LenderDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics' | 'payments' | 'settings'>('leads');
  const [filter, setFilter] = useState({
    status: '',
    dateRange: 'all',
    searchQuery: '',
    source: ''
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    leadsChange: 0,
    conversionRate: 0,
    conversionChange: 0,
    revenue: 0,
    revenueChange: 0,
    totalPaid: 0,
    pendingAmount: 0,
    recentPayments: [],
    topSources: [],
    teamPerformance: []
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  useEffect(() => {
    // Переносим моки внутрь useEffect, чтобы избежать ошибки зависимостей
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'new',
        source: 'Google Ads',
        date: '2023-05-15',
        value: 100
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        status: 'contacted',
        source: 'Facebook',
        date: '2023-05-10',
        value: 150
      }
    ];

    const mockStats: Stats = {
      totalLeads: 128,
      leadsChange: 12,
      conversionRate: 32,
      conversionChange: 4,
      revenue: 12500,
      revenueChange: 8,
      totalPaid: 8500,
      pendingAmount: 4000,
      recentPayments: [
        { 
          id: '1', 
          date: '2023-05-10', 
          publisher: 'Publisher A', 
          leadsCount: 15, 
          amount: 1500, 
          status: 'paid' 
        },
        { 
          id: '2', 
          date: '2023-05-05', 
          publisher: 'Publisher B', 
          leadsCount: 10, 
          amount: 1000, 
          status: 'pending' 
        },
      ],
      topSources: [
        { name: 'Google Ads', count: 45 },
        { name: 'Facebook', count: 32 },
        { name: 'Organic', count: 28 },
      ],
      teamPerformance: [
        { name: 'Team A', conversion: 42 },
        { name: 'Team B', conversion: 35 },
        { name: 'Team C', conversion: 28 }
      ]
    };

    const mockNotifications: Notification[] = [
      { 
        id: '1', 
        type: 'info', 
        message: 'New lead from Google Ads', 
        time: '10 min ago', 
        read: false 
      },
      { 
        id: '2', 
        type: 'success', 
        message: 'Payment completed for Publisher A', 
        time: '1 hour ago', 
        read: false 
      },
      { 
        id: '3', 
        type: 'warning', 
        message: 'Low conversion rate from Facebook', 
        time: '3 hours ago', 
        read: true 
      }
    ];

    const fetchLeads = async () => {
      try {
        const response = await directus.request<Lead[]>(readItems('leads'));
        setLeads(response);
      } catch (error) {
        console.error('Error loading leads:', error);
        // Используем моки при ошибке загрузки
        setLeads(mockLeads);
        setStats(mockStats);
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesStatus = !filter.status || lead.status === filter.status;
    const matchesSearch = !filter.searchQuery || 
      lead.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(filter.searchQuery.toLowerCase());
    const matchesSource = !filter.source || lead.source === filter.source;
    return matchesStatus && matchesSearch && matchesSource;
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleContactLead = (leadId: string) => {
    console.log('Contacting lead:', leadId);
  };

  const handleConvertLead = (leadId: string) => {
    console.log('Converting lead:', leadId);
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
          <h1>LeadSpace</h1>
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
            <li className={activeTab === 'leads' ? styles.active : ''}>
              <button onClick={() => setActiveTab('leads')}>
                <FiUsers />
                <span>Leads</span>
              </button>
            </li>
            <li className={activeTab === 'analytics' ? styles.active : ''}>
              <button onClick={() => setActiveTab('analytics')}>
                <FiTrendingUp />
                <span>Analytics</span>
              </button>
            </li>
            <li className={activeTab === 'payments' ? styles.active : ''}>
              <button onClick={() => setActiveTab('payments')}>
                <FiDollarSign />
                <span>Payments</span>
              </button>
            </li>
            <li className={activeTab === 'settings' ? styles.active : ''}>
              <button onClick={() => setActiveTab('settings')}>
                <FiSettings />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.secondaryNav}>
          <h3>Tools</h3>
          <ul>
            <li>
              <button>
                <FiFileText />
                <span>Reports</span>
              </button>
            </li>
            <li>
              <button>
                <FiShield />
                <span>Security</span>
              </button>
            </li>
            <li>
              <button>
                <FiDatabase />
                <span>Data Export</span>
              </button>
            </li>
            <li>
              <button>
                <FiHelpCircle />
                <span>Help Center</span>
              </button>
            </li>
          </ul>
        </div>

        <ResourceUsage 
          leadsUsed={leads.length} 
          leadsLimit={1000} 
          storageUsed={35} 
          storageLimit={100}
        />
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <h1>
              {activeTab === 'leads' && 'Leads Management'}
              {activeTab === 'analytics' && 'Performance Analytics'}
              {activeTab === 'payments' && 'Payments & Invoices'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
            <p>
              {activeTab === 'leads' && 'Manage and track your leads'}
              {activeTab === 'analytics' && 'Analyze your conversion metrics'}
              {activeTab === 'payments' && 'View payment history and reports'}
              {activeTab === 'settings' && 'Configure your account settings'}
            </p>
          </div>
          
          <QuickActions 
            actions={[
              { icon: <FiGrid />, label: 'Add Lead', action: 'add_lead' },
              { icon: <FiPieChart />, label: 'New Report', action: 'new_report' },
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
          {activeTab === 'leads' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Total Leads" 
                  value={stats.totalLeads} 
                  change={stats.leadsChange} 
                  icon="users"
                />
                <StatsCard 
                  title="Conversion Rate" 
                  value={`${stats.conversionRate}%`} 
                  change={stats.conversionChange} 
                  icon="users"
                />
                <StatsCard 
                  title="Revenue" 
                  value={`$${stats.revenue.toLocaleString()}`} 
                  change={stats.revenueChange} 
                  icon="users"
                />
                <StatsCard 
                  title="Avg Lead Value" 
                  value={`$${Math.round(stats.revenue / stats.totalLeads)}`} 
                  change={5} 
                  icon="users"
                />
              </section>

              <LeadFilter 
                filter={filter}
                onFilterChange={handleFilterChange}
                sources={['All', ...stats.topSources.map(s => s.name)]}
              />
              
              {filteredLeads.length > 0 ? (
                <div className={styles.leadsGrid}>
                  {filteredLeads.map((lead) => (
                    <LeadCard 
                      key={lead.id} 
                      lead={lead} 
                      onContact={() => handleContactLead(lead.id)}
                      onConvert={() => handleConvertLead(lead.id)}
                      value={lead.value}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No leads found matching your criteria</p>
                  <button 
                    onClick={() => setFilter({ status: '', dateRange: 'all', searchQuery: '', source: '' })}
                    className={styles.resetButton}
                  >
                    Reset filters
                  </button>
                </div>
              )}

              <RecentActivity 
                activities={[
                  { id: '1', action: 'Added new lead', user: 'You', time: '10 min ago' },
                  { id: '2', action: 'Converted lead #45', user: 'Team Member', time: '1 hour ago' },
                  { id: '3', action: 'Updated filters', user: 'You', time: '2 hours ago' }
                ]}
              />
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Top Source" 
                  value={stats.topSources[0]?.name || 'N/A'} 
                  change={0} 
                  icon="users"
                />
                <StatsCard 
                  title="Best Team" 
                  value={stats.teamPerformance[0]?.name || 'N/A'} 
                  change={0} 
                  icon="users"
                />
                <StatsCard 
                  title="Avg Conversion" 
                  value={`${Math.round(
                    stats.teamPerformance.reduce((acc, curr) => acc + curr.conversion, 0) / stats.teamPerformance.length
                  )}%`} 
                  change={stats.conversionChange} 
                  icon="users"
                />
              </section>

              <div className={styles.analyticsGrid}>
                <div className={styles.chartContainer}>
                  <h3>Leads Overview</h3>
                  <div className={styles.chartPlaceholder}>
                    Leads performance chart will be displayed here
                  </div>
                </div>
                
                <div className={styles.chartContainer}>
                  <h3>Conversion Funnel</h3>
                  <div className={styles.chartPlaceholder}>
                    Conversion funnel visualization
                  </div>
                </div>
              </div>
              
              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Leads Count</th>
                      <th>Conversion Rate</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topSources.map(source => (
                      <tr key={source.name}>
                        <td>{source.name}</td>
                        <td>{source.count}</td>
                        <td>{Math.round((source.count / stats.totalLeads) * 100)}%</td>
                        <td>${Math.round((source.count / stats.totalLeads) * stats.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <>
              <section className={styles.statsSection}>
                <StatsCard 
                  title="Total Paid" 
                  value={`$${stats.totalPaid.toLocaleString()}`} 
                  change={0} // Добавляем пропс change
                  icon="money" // Используем строковый идентификатор
                />
                <StatsCard 
                  title="Pending" 
                  value={`$${stats.pendingAmount.toLocaleString()}`} 
                  change={0} // Добавляем пропс change
                  icon="money" // Используем строковый идентификатор
                />
                <StatsCard 
                  title="Next Payout" 
                  value={stats.recentPayments.find(p => p.status === 'pending')?.date || 'N/A'} 
                  change={0} // Добавляем пропс change
                  icon="chart" // Используем строковый идентификатор
                />
              </section>
              
              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Publisher</th>
                      <th>Leads</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayments.map(payment => (
                      <tr key={payment.id}>
                        <td>{payment.date}</td>
                        <td>{payment.publisher}</td>
                        <td>{payment.leadsCount}</td>
                        <td>${payment.amount.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.status} ${styles[payment.status]}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>
                          {payment.status === 'pending' && (
                            <button className={styles.actionButton}>
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.paymentSummary}>
                <h3>Payment Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <h4>Last 30 Days</h4>
                    <p>${(stats.totalPaid * 0.7).toLocaleString()}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h4>Avg per Publisher</h4>
                    <p>${Math.round(stats.totalPaid / (stats.recentPayments.length || 1)).toLocaleString()}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h4>Highest Payout</h4>
                    <p>${Math.max(...stats.recentPayments.map(p => p.amount), 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsContainer}>
              <h2>Account Settings</h2>
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label>Account Type</label>
                  <select>
                    <option>Premium</option>
                    <option>Business</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Notification Preferences</label>
                  <div className={styles.checkboxGroup}>
                    <label>
                      <input type="checkbox" defaultChecked /> Email Notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Push Notifications
                    </label>
                    <label>
                      <input type="checkbox" /> SMS Alerts
                    </label>
                  </div>
                </div>
                <button className={styles.saveButton}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LenderDashboard;