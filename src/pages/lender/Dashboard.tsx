import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiSettings,
  FiBell,
  FiHelpCircle,
  FiCreditCard,
  FiFileText,
  FiShield,
  FiDatabase,
  FiShoppingCart,
  FiBriefcase,
  FiBarChart2,
  FiFilter,
  FiAward,
  FiStar,
  FiShoppingBag,
  FiUser,
  FiX,
  FiSearch,
  FiLock,
  FiCode,
  FiLogOut,
  FiMessageSquare,
  FiBookOpen,
  FiGlobe,
  FiZap,
  FiPlus,
  FiTrendingUp,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiTrash,
  FiEye,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiActivity,
  FiPercent
} from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard/StatsCard';
import NotificationPanel from '../../components/ui/NotificationPanel/NotificationPanel';
import QuickActions from '../../components/ui/QuickActions/QuickActions';
import ResourceUsage from '../../components/ui/ResourceUsage/ResourceUsage';
import LeadCard from '../../components/ui/LeadCard/LeadCard';
import AnalyticsChart from '../../components/ui/AnalyticsChart/AnalyticsChart';
import FilterManager from '../../components/ui/FilterManager/FilterManager';
import AISettings from '../../components/ui/AISettings/AISettings';
import PaymentHistory from '../../components/ui/PaymentHistory/PaymentHistory';
import styles from './Dashboard.module.scss';
import classNames from 'classnames';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  date: string;
  value?: number;
  purchasedDate?: string;
  lastContact?: string;
  notes?: string;
}

interface MarketplaceLead {
  id: string;
  type: string;
  region: string;
  city: string;
  time: string;
  aiScore: number;
  price: number;
  salesCount: number;
  description: string;
  badges: string[];
  income: number;
  age: number;
  creditScore?: number;
  loanAmount?: number;
  urgency?: number;
  isExclusive?: boolean;
}

interface Payment {
  id: string;
  date: string;
  publisher: string;
  leadsCount: number;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceId?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  read: boolean;
  action?: () => void;
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
  topSources: Array<{ name: string; count: number; percentage: number }>;
  teamPerformance: Array<{ name: string; conversion: number; leads: number }>;
  balance: number;
  dailyBudget: number;
  weeklyBudget: number;
  spentToday: number;
  leadsToday: number;
  roi: number;
  avgLeadPrice: number;
  bestSource: string;
  refundRate: number;
}

interface Filter {
  id: string;
  name: string;
  lastUsed: string;
  criteria: string;
  isDefault: boolean;
}

interface AISetting {
  name: string;
  value: boolean | number | string;
  description: string;
  type: 'toggle' | 'slider' | 'select';
  options?: string[];
}

interface Purchase {
  id: string;
  date: string;
  leads: MarketplaceLead[];
  totalAmount: number;
  status: 'completed' | 'pending' | 'failed';
}

const LenderDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'leads_marketplace' | 
    'my_leads' | 
    'analytics' | 
    'balance' | 
    'filters' | 
    'settings' | 
    'ai_manager'
  >('leads_marketplace');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [marketplaceLeads, setMarketplaceLeads] = useState<MarketplaceLead[]>([]);
  const [cart, setCart] = useState<string[]>([]);
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
    teamPerformance: [],
    balance: 1250,
    dailyBudget: 300,
    weeklyBudget: 1500,
    spentToday: 85,
    leadsToday: 7,
    roi: 42,
    avgLeadPrice: 75,
    bestSource: 'Google Ads',
    refundRate: 2.5
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [marketplaceFilters, setMarketplaceFilters] = useState({
    loanType: '',
    region: '',
    city: '',
    minScore: 0,
    maxScore: 100,
    minPrice: 0,
    maxPrice: 1000,
    minIncome: 0,
    age: '',
    uniqueness: 'all',
    period: 'today',
    minCreditScore: 0,
    maxCreditScore: 850,
    minUrgency: 0,
    maxUrgency: 10,
    salesCount: 'all'
  });
  const [savedFilters, setSavedFilters] = useState<Filter[]>([]);
  const [aiSettings, setAiSettings] = useState<AISetting[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [balanceHistoryOpen, setBalanceHistoryOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [auctionNotification] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supportChatOpen, setSupportChatOpen] = useState(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  
  const closeAllMenus = () => {
    setProfileMenuOpen(false);
    setBalanceHistoryOpen(false);
    setQuickActionsOpen(false);
    setHelpMenuOpen(false);
    setNotificationPanelOpen(false);
  };
  
  const balanceHistory = [
    { id: 1, date: '2023-06-15', description: 'Пополнение баланса', amount: '+$500', status: 'completed' },
    { id: 2, date: '2023-06-12', description: 'Покупка лидов (3 шт)', amount: '-$210', status: 'completed' },
    { id: 3, date: '2023-06-10', description: 'Пополнение баланса', amount: '+$1000', status: 'completed' },
    { id: 4, date: '2023-06-05', description: 'Вывод средств', amount: '-$500', status: 'pending' },
    { id: 5, date: '2023-06-01', description: 'Покупка лидов (5 шт)', amount: '-$375', status: 'completed' },
    { id: 6, date: '2023-05-28', description: 'Пополнение баланса', amount: '+$750', status: 'completed' },
  ];

  useEffect(() => {
    const mockMarketplaceLeads: MarketplaceLead[] = [
      {
        id: 'm1',
        type: 'Ипотека',
        region: 'Центральный',
        city: 'Москва',
        time: '10 мин назад',
        aiScore: 92,
        price: 85,
        salesCount: 0,
        description: 'Молодая семья ищет ипотеку на квартиру до 15 млн рублей. Стабильный доход, первоначальный взнос 30%.',
        badges: ['new', 'premium', 'unique'],
        income: 150000,
        age: 32,
        creditScore: 780,
        loanAmount: 10500000,
        urgency: 9,
        isExclusive: true
      },
      {
        id: 'm2',
        type: 'Автокредит',
        region: 'Северо-Западный',
        city: 'Санкт-Петербург',
        time: '45 мин назад',
        aiScore: 78,
        price: 65,
        salesCount: 2,
        description: 'Мужчина 45 лет хочет купить внедорожник. Рассматривает кредит на 5 лет. Требуется страховка.',
        badges: ['new'],
        income: 90000,
        age: 45,
        creditScore: 690,
        loanAmount: 1500000,
        urgency: 7
      },
      {
        id: 'm3',
        type: 'Потребительский',
        region: 'Приволжский',
        city: 'Казань',
        time: '1 час назад',
        aiScore: 85,
        price: 55,
        salesCount: 1,
        description: 'Срочно нужны деньги на лечение. Готова предоставить документы. Ищет кредит до 500 тыс рублей.',
        badges: ['unique'],
        income: 60000,
        age: 41,
        creditScore: 710,
        loanAmount: 500000,
        urgency: 10
      },
      {
        id: 'm4',
        type: 'Рефинансирование',
        region: 'Южный',
        city: 'Сочи',
        time: '2 часа назад',
        aiScore: 88,
        price: 75,
        salesCount: 3,
        description: 'Хочет объединить несколько кредитов в один с более низкой ставкой. Текущая задолженность 1.2 млн рублей.',
        badges: ['premium'],
        income: 120000,
        age: 38,
        creditScore: 730,
        loanAmount: 1200000,
        urgency: 6
      },
      {
        id: 'm5',
        type: 'Ипотека',
        region: 'Центральный',
        city: 'Москва',
        time: '3 часа назад',
        aiScore: 95,
        price: 120,
        salesCount: 0,
        description: 'IT-специалист, ищет квартиру в новостройке. Первоначальный взнос 50%. Стаж работы 5 лет.',
        badges: ['premium', 'unique', 'hot'],
        income: 250000,
        age: 29,
        creditScore: 820,
        loanAmount: 8000000,
        urgency: 8,
        isExclusive: true
      },
      {
        id: 'm6',
        type: 'Бизнес-кредит',
        region: 'Сибирский',
        city: 'Новосибирск',
        time: '5 часов назад',
        aiScore: 82,
        price: 90,
        salesCount: 1,
        description: 'Владелец малого бизнеса ищет кредит на развитие. Оборот 2 млн/мес, опыт работы 3 года.',
        badges: ['new', 'premium'],
        income: 180000,
        age: 44,
        creditScore: 760,
        loanAmount: 3000000,
        urgency: 7
      }
    ];

    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+79991234567',
        status: 'new',
        source: 'Google Ads',
        date: '2023-06-15',
        purchasedDate: '2023-06-15',
        value: 100,
        lastContact: '2023-06-15',
        notes: 'Заинтересован в рефинансировании ипотеки'
      },
      {
        id: '2',
        name: 'Екатерина Смирнова',
        email: 'ekaterina@example.com',
        phone: '+79997654321',
        status: 'contacted',
        source: 'Marketplace',
        date: '2023-06-14',
        purchasedDate: '2023-06-14',
        value: 150,
        lastContact: '2023-06-15',
        notes: 'Хочет автокредит на новую машину'
      },
      {
        id: '3',
        name: 'Алексей Васнецов',
        email: 'alexey@example.com',
        phone: '+79995554433',
        status: 'converted',
        source: 'Facebook',
        date: '2023-06-10',
        purchasedDate: '2023-06-10',
        value: 200,
        lastContact: '2023-06-12',
        notes: 'Одобрен кредит на 500 тыс руб.'
      },
      {
        id: '4',
        name: 'Ольга Кузнецова',
        email: 'olga@example.com',
        phone: '+79993332211',
        status: 'lost',
        source: 'Organic',
        date: '2023-06-05',
        purchasedDate: '2023-06-05',
        value: 75,
        lastContact: '2023-06-07',
        notes: 'Выбрал конкурента с более низкой ставкой'
      },
      {
        id: '5',
        name: 'Дмитрий Соколов',
        email: 'dmitry@example.com',
        phone: '+79998887766',
        status: 'contacted',
        source: 'Marketplace',
        date: '2023-06-14',
        purchasedDate: '2023-06-14',
        value: 120,
        lastContact: '2023-06-15',
        notes: 'Интересуется ипотекой для ИЖС'
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
      spentToday: 85,
      leadsToday: 7,
      roi: 42,
      avgLeadPrice: 75,
      bestSource: 'Google Ads',
      refundRate: 2.5,
      recentPayments: [
        { 
          id: '1', 
          date: '2023-06-10', 
          publisher: 'Publisher A', 
          leadsCount: 15, 
          amount: 1500, 
          status: 'paid',
          invoiceId: 'INV-20230610-001'
        },
        { 
          id: '2', 
          date: '2023-06-05', 
          publisher: 'Publisher B', 
          leadsCount: 10, 
          amount: 1000, 
          status: 'pending',
          invoiceId: 'INV-20230605-002'
        },
        { 
          id: '3', 
          date: '2023-05-28', 
          publisher: 'Publisher C', 
          leadsCount: 8, 
          amount: 800, 
          status: 'paid',
          invoiceId: 'INV-20230528-003'
        }
      ],
      topSources: [
        { name: 'Google Ads', count: 45, percentage: 35 },
        { name: 'Facebook', count: 32, percentage: 25 },
        { name: 'Organic', count: 28, percentage: 22 },
        { name: 'Marketplace', count: 15, percentage: 12 },
        { name: 'Email', count: 8, percentage: 6 }
      ],
      teamPerformance: [
        { name: 'Team A', conversion: 42, leads: 48 },
        { name: 'Team B', conversion: 35, leads: 40 },
        { name: 'Team C', conversion: 28, leads: 32 }
      ],
      balance: 1250,
      dailyBudget: 300,
      weeklyBudget: 1500
    };

    const mockNotifications: Notification[] = [
      { 
        id: '1', 
        type: 'info', 
        message: 'Новый лид по ипотеке в Москве с рейтингом 92%', 
        time: '5 мин назад', 
        read: false,
        action: () => setActiveTab('leads_marketplace')
      },
      { 
        id: '2', 
        type: 'success', 
        message: 'Пополнение баланса на $500 успешно завершено', 
        time: '1 час назад', 
        read: false 
      },
      { 
        id: '3', 
        type: 'warning', 
        message: 'Достигнут дневной лимит бюджета (85%)', 
        time: '3 часа назад', 
        read: true 
      },
      { 
        id: '4', 
        type: 'success', 
        message: 'Лиды #L-342, #L-343, #L-344 успешно приобретены', 
        time: 'Вчера', 
        read: false 
      },
      { 
        id: '5', 
        type: 'error', 
        message: 'Ошибка при обработке платежа. Попробуйте еще раз', 
        time: '2 дня назад', 
        read: true 
      }
    ];

    const mockSavedFilters: Filter[] = [
      {
        id: 'f1',
        name: 'Премиум ипотека',
        lastUsed: '2023-06-14',
        criteria: 'Тип: Ипотека, Рейтинг: >85, Цена: <100',
        isDefault: true
      },
      {
        id: 'f2',
        name: 'Срочные заявки',
        lastUsed: '2023-06-10',
        criteria: 'Рейтинг: >90, Срочность: >8',
        isDefault: false
      },
      {
        id: 'f3',
        name: 'Рефинансирование',
        lastUsed: '2023-06-05',
        criteria: 'Тип: Рефинансирование, Доход: >100000',
        isDefault: false
      }
    ];

    const mockAiSettings: AISetting[] = [
      {
        name: 'Автопокупка лидов',
        value: false,
        description: 'Автоматически покупать лиды, соответствующие вашим критериям',
        type: 'toggle'
      },
      {
        name: 'Минимальный рейтинг',
        value: 75,
        description: 'Минимальный AI-рейтинг для автопокупки',
        type: 'slider',
        options: ['0', '25', '50', '75', '100']
      },
      {
        name: 'Максимальная цена',
        value: 90,
        description: 'Максимальная цена за лид для автопокупки',
        type: 'slider',
        options: ['50', '75', '100', '125', '150']
      },
      {
        name: 'Уведомления о горящих лидах',
        value: true,
        description: 'Получать уведомления о лидах с высокой срочностью',
        type: 'toggle'
      },
      {
        name: 'Стратегия покупки',
        value: 'balanced',
        description: 'Выберите стратегию покупки лидов',
        type: 'select',
        options: ['экономичная', 'сбалансированная', 'агрессивная']
      },
      {
        name: 'Автопополнение баланса',
        value: true,
        description: 'Автоматически пополнять баланс при достижении минимального уровня',
        type: 'toggle'
      }
    ];

    const mockPurchaseHistory: Purchase[] = [
      {
        id: 'p1',
        date: '2023-06-15',
        leads: [mockMarketplaceLeads[0], mockMarketplaceLeads[1]],
        totalAmount: 150,
        status: 'completed'
      },
      {
        id: 'p2',
        date: '2023-06-10',
        leads: [mockMarketplaceLeads[2], mockMarketplaceLeads[3]],
        totalAmount: 130,
        status: 'completed'
      },
      {
        id: 'p3',
        date: '2023-06-05',
        leads: [mockMarketplaceLeads[4]],
        totalAmount: 120,
        status: 'completed'
      }
    ];

    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setLeads(mockLeads);
        setMarketplaceLeads(mockMarketplaceLeads);
        setStats(mockStats);
        setNotifications(mockNotifications);
        setSavedFilters(mockSavedFilters);
        setAiSettings(mockAiSettings);
        setPurchaseHistory(mockPurchaseHistory);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading data:', error);
        setLeads(mockLeads);
        setMarketplaceLeads(mockMarketplaceLeads);
        setStats(mockStats);
        setNotifications(mockNotifications);
        setSavedFilters(mockSavedFilters);
        setAiSettings(mockAiSettings);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cartOpen]);

  const filteredMarketplaceLeads = marketplaceLeads.filter(lead => {
    return (
      (!marketplaceFilters.loanType || lead.type === marketplaceFilters.loanType) &&
      (!marketplaceFilters.region || lead.region === marketplaceFilters.region) &&
      (!marketplaceFilters.city || lead.city === marketplaceFilters.city) &&
      lead.aiScore >= marketplaceFilters.minScore &&
      lead.aiScore <= marketplaceFilters.maxScore &&
      lead.price >= marketplaceFilters.minPrice &&
      lead.price <= marketplaceFilters.maxPrice &&
      lead.income >= marketplaceFilters.minIncome &&
      (!marketplaceFilters.age || 
        (marketplaceFilters.age === 'under30' && lead.age < 30) ||
        (marketplaceFilters.age === '30-50' && lead.age >= 30 && lead.age <= 50) ||
        (marketplaceFilters.age === 'over50' && lead.age > 50)) &&
      lead.creditScore !== undefined && 
        lead.creditScore >= marketplaceFilters.minCreditScore && 
        lead.creditScore <= marketplaceFilters.maxCreditScore &&
      lead.urgency !== undefined && 
        lead.urgency >= marketplaceFilters.minUrgency && 
        lead.urgency <= marketplaceFilters.maxUrgency &&
      (marketplaceFilters.salesCount === 'all' || 
        (marketplaceFilters.salesCount === 'exclusive' && lead.salesCount === 0))
    );
  });

  const toggleCartItem = (leadId: string) => {
    if (cart.includes(leadId)) {
      setCart(cart.filter(id => id !== leadId));
    } else {
      setCart([...cart, leadId]);
    }
  };

  const buyLeads = () => {
    if (cart.length === 0) return;
    
    const totalCost = cart.reduce((total, leadId) => {
      const lead = marketplaceLeads.find(l => l.id === leadId);
      return total + (lead?.price || 0);
    }, 0);
    
    if (stats.balance >= totalCost) {
      setStats(prev => ({
        ...prev,
        balance: prev.balance - totalCost,
        spentToday: prev.spentToday + totalCost,
        leadsToday: prev.leadsToday + cart.length
      }));
      
      const newNotification: Notification = {
        id: `n${notifications.length + 1}`,
        type: 'success',
        message: `Успешно приобретено ${cart.length} лидов на сумму $${totalCost}`,
        time: 'Только что',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Добавляем покупку в историю
      const purchasedLeads = cart.map(id => marketplaceLeads.find(lead => lead.id === id)).filter(Boolean) as MarketplaceLead[];
      const newPurchase: Purchase = {
        id: `p${purchaseHistory.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        leads: purchasedLeads,
        totalAmount: totalCost,
        status: 'completed'
      };
      
      setPurchaseHistory(prev => [newPurchase, ...prev]);
      
      setCart([]);
      setCartOpen(false);
      
      alert(`Покупка успешна! Куплено лидов: ${cart.length} на сумму $${totalCost}`);
    } else {
      const newNotification: Notification = {
        id: `n${notifications.length + 1}`,
        type: 'error',
        message: 'Недостаточно средств для покупки лидов',
        time: 'Только что',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      alert('Недостаточно средств на балансе. Пополните счет.');
    }
  };

  const _markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'add_lead') {
      alert('Добавление нового лида...');
    } else if (action === 'new_report') {
      alert('Создание нового отчета...');
    } else if (action === 'request_payout') {
      alert('Запрос вывода средств...');
    } else if (action === 'top_up') {
      topUpBalance(500);
    } else if (action === 'open_support') {
      setSupportChatOpen(true);
    }
  };

  const topUpBalance = (amount: number) => {
    setStats(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
    
    const newNotification: Notification = {
      id: `n${notifications.length + 1}`,
      type: 'success',
      message: `Баланс пополнен на $${amount}`,
      time: 'Только что',
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    alert(`Баланс пополнен на $${amount}`);
  };

  const handleLeadAction = (leadId: string, action: string) => {
    if (action === 'contact') {
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId ? { ...lead, status: 'contacted', lastContact: new Date().toISOString() } : lead
        )
      );
      alert(`Лид ${leadId} отмечен как контактированный`);
    } else if (action === 'convert') {
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId ? { ...lead, status: 'converted' } : lead
        )
      );
      alert(`Лид ${leadId} отмечен как конвертированный`);
    } else if (action === 'delete') {
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      alert(`Лид ${leadId} удален`);
    }
  };

  const saveFilter = (filter: Filter) => {
    setSavedFilters(prev => [...prev, filter]);
  };

  const applyFilter = (filter: Filter) => {
    alert(`Применен фильтр: ${filter.name}`);
  };

  const deleteFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const updateAiSetting = (name: string, value: boolean | number | string) => {
    setAiSettings(prev => 
      prev.map(setting => 
        setting.name === name ? { ...setting, value } : setting
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (!target.closest(`.${styles.dropdownContainer}`)) {
        closeAllMenus();
      }
      
      if (cartRef.current && !cartRef.current.contains(target) && 
          !target.closest(`.${styles.cartButton}`)) {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartTotal = cart.reduce((total, leadId) => {
    const lead = marketplaceLeads.find(l => l.id === leadId);
    return total + (lead?.price || 0);
  }, 0);

  const cartItems = cart.map(id => marketplaceLeads.find(lead => lead.id === id)).filter(Boolean);

  const onboardingText = {
    'leads_marketplace': 'Здесь вы можете покупать лиды по заданным критериям. Используйте фильтры для поиска наиболее релевантных заявок.',
    'my_leads': 'Управляйте приобретенными лидами. Отмечайте статусы обработки и отслеживайте конверсию.',
    'analytics': 'Анализируйте эффективность ваших инвестиций. Отслеживайте ROI и ключевые метрики.',
    'balance': 'Управляйте балансом, платежами и настройками бюджета.',
    'filters': 'Создавайте и управляйте сохраненными фильтрами для быстрого доступа к нужным лидам.',
    'settings': 'Настройте параметры вашего аккаунта и интеграции.',
    'ai_manager': 'Настройте AI-ассистента для автоматической покупки лидов по вашим критериям.'
  };

  return (
    <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.topNav}>
        <div className={styles.brand}>
          <span className={styles.logo}>🚀</span>
          <h1>LeadSpace</h1>
          <span className={styles.betaBadge}>Pro</span>
        </div>
        
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Поиск по лидам, платежам, настройкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.searchShortcut}>Ctrl+/</div>
        </div>
        
        <div className={styles.navControls}>
          <button 
            className={styles.notificationButton}
            onClick={(e) => {
              e.stopPropagation();
              setNotificationPanelOpen(!notificationPanelOpen);
            }}
          >
            <FiBell />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          
          <div 
            className={styles.dropdownContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.actionIcon}
              onClick={(e) => {
                e.stopPropagation();
                setQuickActionsOpen(!quickActionsOpen);
              }}
            >
              <FiZap />
              <span className={styles.actionText}>Действия</span>
            </button>
            
            {quickActionsOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li>
                    <button onClick={() => handleQuickAction('add_lead')}>
                      <FiPlus /> Добавить лид
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleQuickAction('new_report')}>
                      <FiTrendingUp /> Создать отчет
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleQuickAction('request_payout')}>
                      <FiCreditCard /> Вывод средств
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleQuickAction('top_up')}>
                      <FiDollarSign /> Пополнить баланс
                    </button>
                  </li>
                </ul>
                <div className={styles.dropdownFooter}>
                  <button className={styles.settingsButton}>
                    <FiSettings /> Настроить быстрые действия
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className={styles.balanceContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={styles.balanceInfo}
              onClick={(e) => {
                e.stopPropagation();
                setBalanceHistoryOpen(!balanceHistoryOpen);
              }}
            >
              <div className={styles.balanceAmount}>${stats.balance.toLocaleString()}</div>
              <div className={styles.autoTopUp}>
                <FiRefreshCw size={12} /> Автопополнение: ВКЛ
              </div>
              <div className={styles.balanceToggle}>
                {balanceHistoryOpen ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>
            
            {balanceHistoryOpen && (
              <div className={styles.historyDropdown}>
                <div className={styles.historyHeader}>
                  <h4>История операций</h4>
                  <button className={styles.downloadButton}>
                    <FiDownload /> Выгрузить
                  </button>
                </div>
                <ul>
                  {balanceHistory.map(item => (
                    <li key={item.id}>
                      <div className={styles.historyDate}>{item.date}</div>
                      <div className={styles.historyDesc}>{item.description}</div>
                      <div 
                        className={`${styles.historyAmount} ${item.amount.startsWith('+') ? styles.positive : styles.negative}`}
                      >
                        {item.amount}
                      </div>
                      <div className={`${styles.historyStatus} ${item.status === 'completed' ? styles.completed : styles.pending}`}>
                        {item.status === 'completed' ? <FiCheck /> : <FiAlertCircle />}
                        {item.status === 'completed' ? 'Завершено' : 'Ожидание'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className={styles.dropdownContainer}>
            <button className={styles.actionIcon}>
              <FiGlobe />
              <span className={styles.actionText}>Язык</span>
            </button>
          </div>
          
          <div 
            className={styles.dropdownContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.actionIcon}
              onClick={(e) => {
                e.stopPropagation();
                setHelpMenuOpen(!helpMenuOpen);
              }}
            >
              <FiHelpCircle />
              <span className={styles.actionText}>Помощь</span>
            </button>
            
            {helpMenuOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li>
                    <button>
                      <FiHelpCircle /> Техподдержка
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleQuickAction('open_support')}>
                      <FiMessageSquare /> Онлайн-чат
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiBookOpen /> База знаний
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiCode /> API документация
                    </button>
                  </li>
                </ul>
                <div className={styles.dropdownFooter}>
                  <button className={styles.settingsButton}>
                    <FiSettings /> Настроить уведомления
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className={styles.dropdownContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={styles.userMenu}
              onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen(!profileMenuOpen);
              }}
            >
              <img 
                src={user?.avatar || 'https://i.pravatar.cc/300'} 
                alt="User" 
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.first_name} {user?.last_name}</span>
                <span className={styles.userRole}>
                  <FiStar size={12} /> Премиум аккаунт
                </span>
              </div>
            </div>
            
            {profileMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.userPreview}>
                  <img 
                    src={user?.avatar || 'https://i.pravatar.cc/300'} 
                    alt="User" 
                    className={styles.avatarLarge}
                  />
                  <div>
                    <div className={styles.userNameLarge}>{user?.first_name} {user?.last_name}</div>
                    <div className={styles.userEmail}>{user?.email}</div>
                    <div className={styles.accountStatus}>
                      <span className={styles.statusBadge}>Premium</span>
                      <span className={styles.accountBalance}>${stats.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <ul>
                  <li>
                    <button>
                      <FiUser /> Мой профиль
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiLock /> Безопасность
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiFileText /> Документы
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiCode /> API / Webhooks
                    </button>
                  </li>
                  <li>
                    <button>
                      <FiShield /> Права доступа
                    </button>
                  </li>
                  <li>
                    <button onClick={logout}>
                      <FiLogOut /> Выход
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <button 
            className={styles.menuToggle}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={styles.sidebar}>
        <button 
          className={styles.closeSidebar}
          onClick={() => setSidebarOpen(false)}
        >
          <FiX />
        </button>
        
        <button 
          className={styles.supportButton}
          onClick={() => setSupportChatOpen(true)}
        >
          <FiMessageSquare />
          <span>Поддержка</span>
        </button>
        
        <nav className={styles.primaryNav}>
          <ul>
            <li className={activeTab === 'leads_marketplace' ? styles.active : ''}>
              <button onClick={() => setActiveTab('leads_marketplace')}>
                <FiShoppingBag />
                <span>Магазин лидов</span>
                {auctionNotification && (
                  <span className={styles.auctionBadge}>🔥</span>
                )}
                {activeTab === 'leads_marketplace' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'my_leads' ? styles.active : ''}>
              <button onClick={() => setActiveTab('my_leads')}>
                <FiBriefcase />
                <span>Мои лиды</span>
                <span className={styles.badge}>{leads.length}</span>
                {activeTab === 'my_leads' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'analytics' ? styles.active : ''}>
              <button onClick={() => setActiveTab('analytics')}>
                <FiBarChart2 />
                <span>Аналитика</span>
                {activeTab === 'analytics' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'balance' ? styles.active : ''}>
              <button onClick={() => setActiveTab('balance')}>
                <FiCreditCard />
                <span>Баланс</span>
                <span className={styles.badge}>${stats.balance}</span>
                {activeTab === 'balance' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'filters' ? styles.active : ''}>
              <button onClick={() => setActiveTab('filters')}>
                <FiFilter />
                <span>Фильтры</span>
                <span className={styles.badge}>{savedFilters.length}</span>
                {activeTab === 'filters' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'settings' ? styles.active : ''}>
              <button onClick={() => setActiveTab('settings')}>
                <FiSettings />
                <span>Настройки</span>
                {activeTab === 'settings' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
            <li className={activeTab === 'ai_manager' ? styles.active : ''}>
              <button onClick={() => setActiveTab('ai_manager')}>
                <FiAward />
                <span>AI-менеджер</span>
                <span className={styles.badge}>Beta</span>
                {activeTab === 'ai_manager' && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.secondaryNav}>
          <h3>Инструменты</h3>
          <ul>
            <li>
              <button>
                <FiFileText />
                <span>Отчеты</span>
              </button>
            </li>
            <li>
              <button>
                <FiShield />
                <span>Безопасность</span>
              </button>
            </li>
            <li>
              <button>
                <FiDatabase />
                <span>Экспорт данных</span>
              </button>
            </li>
            <li>
              <button>
                <FiShoppingBag />
                <span>История покупок</span>
              </button>
            </li>
            <li>
              <button>
                <FiHelpCircle />
                <span>Помощь</span>
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

      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <h1>
              {activeTab === 'leads_marketplace' && 'Магазин лидов'}
              {activeTab === 'my_leads' && 'Мои лиды'}
              {activeTab === 'analytics' && 'Аналитика'}
              {activeTab === 'balance' && 'Баланс и платежи'}
              {activeTab === 'filters' && 'Сохраненные фильтры'}
              {activeTab === 'settings' && 'Настройки аккаунта'}
              {activeTab === 'ai_manager' && 'AI-менеджер'}
            </h1>
            <p>
              {onboardingText[activeTab]}
            </p>
          </div>
          
          {activeTab !== 'balance' && activeTab !== 'settings' && (
            <QuickActions 
              actions={[
                { icon: <FiPlus />, label: 'Добавить лид', action: 'add_lead' },
                { icon: <FiTrendingUp />, label: 'Создать отчет', action: 'new_report' },
                { icon: <FiDollarSign />, label: 'Пополнить баланс', action: 'top_up' },
                { icon: <FiMessageSquare />, label: 'Поддержка', action: 'open_support' }
              ]} 
              onAction={handleQuickAction}
            />
          )}
        </header>

        {notificationPanelOpen && (
          <NotificationPanel 
            notifications={notifications}
            onClose={() => setNotificationPanelOpen(false)}
          />
        )}

        <div className={styles.dashboardContent}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Загрузка данных...</p>
            </div>
          ) : (
            <>
              {activeTab === 'leads_marketplace' && (
                <div className={styles.marketplaceContainer}>
                  <div className={styles.welcomeBlock}>
                    <h2>Добро пожаловать в LeadSpace!</h2>
                    <p>Ваш центр для покупки и управления лидами. Используйте фильтры, AI и аналитику, чтобы найти нужных клиентов.</p>
                  </div>
                  
                  <div className={styles.marketplaceHeader}>
                    <div className={styles.statsRow}>
                      <StatsCard 
                        icon={<FiShoppingBag />}
                        title="Лидов сегодня"
                        value={stats.leadsToday.toString()}
                        change={12}
                      />
                      <StatsCard 
                        icon={<FiDollarSign />}
                        title="Потрачено сегодня"
                        value={`$${stats.spentToday}`}
                        change={-5}
                      />
                      <StatsCard 
                        icon={<FiPercent />}
                        title="ROI"
                        value={`${stats.roi}%`}
                        change={3}
                      />
                      <StatsCard 
                        icon={<FiActivity />}
                        title="Средняя цена"
                        value={`$${stats.avgLeadPrice}`}
                        change={2}
                      />
                    </div>

                    <div className={styles.marketplaceActions}>
                      
                      <button 
                        className={classNames(styles.cartButton, cart.length > 0 && styles.hasItems)}
                        onClick={() => setCartOpen(!cartOpen)}
                      >
                        <FiShoppingCart />
                        <span>Корзина</span>
                        {cart.length > 0 && <span className={styles.cartBadge}>{cart.length}</span>}
                      </button>
                    </div>
                  </div>

                  {cartOpen && cartItems.length > 0 && (
                    <div ref={cartRef} className={styles.cartPanel}>
                      <div className={styles.cartHeader}>
                        <h3>Ваша корзина</h3>
                        <button className={styles.closeCart} onClick={() => setCartOpen(false)}>
                          <FiX />
                        </button>
                      </div>
                      <div className={styles.cartItems}>
                        {cartItems.map((item, index) => (
                          <div key={item?.id || index} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                              <div className={styles.itemName}>{item?.type} в {item?.city}</div>
                              <div className={styles.itemDesc}>{item?.description.substring(0, 60)}...</div>
                            </div>
                            <div className={styles.itemPrice}>${item?.price}</div>
                            <button 
                              className={styles.removeItem}
                              onClick={() => toggleCartItem(item?.id || '')}
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className={styles.cartFooter}>
                        <div className={styles.cartTotal}>
                          <span>Итого:</span>
                          <span>${cartTotal}</span>
                        </div>
                        <button 
                          className={styles.buyButton}
                          onClick={buyLeads}
                          disabled={cartTotal > stats.balance}
                        >
                          Купить сейчас
                        </button>
                        {cartTotal > stats.balance && (
                          <div className={styles.balanceWarning}>
                            Недостаточно средств. Пополните баланс.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.filtersSection}>
                    <h3>Фильтры лидов</h3>
                    <div className={styles.filterGrid}>
                      <div className={styles.filterGroup}>
                        <label>Тип кредита</label>
                        <select 
                          value={marketplaceFilters.loanType}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, loanType: e.target.value})}
                        >
                          <option value="">Все типы</option>
                          <option value="Ипотека">Ипотека</option>
                          <option value="Автокредит">Автокредит</option>
                          <option value="Потребительский">Потребительский</option>
                          <option value="Рефинансирование">Рефинансирование</option>
                          <option value="Бизнес-кредит">Бизнес-кредит</option>
                        </select>
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Регион</label>
                        <select 
                          value={marketplaceFilters.region}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, region: e.target.value})}
                        >
                          <option value="">Все регионы</option>
                          <option value="Центральный">Центральный</option>
                          <option value="Северо-Западный">Северо-Западный</option>
                          <option value="Южный">Южный</option>
                          <option value="Приволжский">Приволжский</option>
                          <option value="Уральский">Уральский</option>
                          <option value="Сибирский">Сибирский</option>
                          <option value="Дальневосточный">Дальневосточный</option>
                        </select>
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Город</label>
                        <input 
                          type="text" 
                          placeholder="Введите город"
                          value={marketplaceFilters.city}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, city: e.target.value})}
                        />
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Рейтинг AI</label>
                        <div className={styles.rangeInputs}>
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={marketplaceFilters.minScore}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, minScore: parseInt(e.target.value) || 0})}
                          />
                          <span>-</span>
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={marketplaceFilters.maxScore}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, maxScore: parseInt(e.target.value) || 100})}
                          />
                        </div>
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Цена ($)</label>
                        <div className={styles.rangeInputs}>
                          <input 
                            type="number" 
                            min="0" 
                            max="1000" 
                            value={marketplaceFilters.minPrice}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, minPrice: parseInt(e.target.value) || 0})}
                          />
                          <span>-</span>
                          <input 
                            type="number" 
                            min="0" 
                            max="1000" 
                            value={marketplaceFilters.maxPrice}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, maxPrice: parseInt(e.target.value) || 1000})}
                          />
                        </div>
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Доход (₽)</label>
                        <input 
                          type="number" 
                          placeholder="Минимальный доход"
                          value={marketplaceFilters.minIncome}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, minIncome: parseInt(e.target.value) || 0})}
                        />
                      </div>

                      <div className={styles.filterGroup}>
                        <label>Возраст</label>
                        <select 
                          value={marketplaceFilters.age}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, age: e.target.value})}
                        >
                          <option value="">Любой</option>
                          <option value="under30">До 30 лет</option>
                          <option value="30-50">30-50 лет</option>
                          <option value="over50">Старше 50</option>
                        </select>
                      </div>
                      
                      <div className={styles.filterGroup}>
                        <label>Кредитный рейтинг</label>
                        <div className={styles.rangeInputs}>
                          <input 
                            type="number" 
                            min="0" 
                            max="850" 
                            value={marketplaceFilters.minCreditScore}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, minCreditScore: parseInt(e.target.value) || 0})}
                          />
                          <span>-</span>
                          <input 
                            type="number" 
                            min="0" 
                            max="850" 
                            value={marketplaceFilters.maxCreditScore}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, maxCreditScore: parseInt(e.target.value) || 850})}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.filterGroup}>
                        <label>Срочность</label>
                        <div className={styles.rangeInputs}>
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            value={marketplaceFilters.minUrgency}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, minUrgency: parseInt(e.target.value) || 0})}
                          />
                          <span>-</span>
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            value={marketplaceFilters.maxUrgency}
                            onChange={(e) => setMarketplaceFilters({...marketplaceFilters, maxUrgency: parseInt(e.target.value) || 10})}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.filterGroup}>
                        <label>Эксклюзивность</label>
                        <select 
                          value={marketplaceFilters.salesCount}
                          onChange={(e) => setMarketplaceFilters({...marketplaceFilters, salesCount: e.target.value})}
                        >
                          <option value="all">Все лиды</option>
                          <option value="exclusive">Только эксклюзивные</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.filterActions}>
                      <button className={styles.resetButton}>
                        Сбросить
                      </button>
                      <button className={styles.applyButton}>
                        Применить фильтры
                      </button>
                    </div>
                  </div>

                  <div className={styles.leadsGrid}>
                    <h3>Доступные лиды <span className={styles.countBadge}>{filteredMarketplaceLeads.length}</span></h3>
                    
                    <div className={styles.leadsContainer}>
                      {filteredMarketplaceLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead}
                          inCart={cart.includes(lead.id)}
                          onAddToCart={() => toggleCartItem(lead.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'my_leads' && (
                <div className={styles.myLeadsContainer}>
                  <div className={styles.leadsSummary}>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryValue}>{leads.length}</div>
                      <div className={styles.summaryLabel}>Всего лидов</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryValue}>32%</div>
                      <div className={styles.summaryLabel}>Конверсия</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryValue}>${stats.revenue}</div>
                      <div className={styles.summaryLabel}>Общий доход</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryValue}>8.2</div>
                      <div className={styles.summaryLabel}>Средний ROI</div>
                    </div>
                  </div>

                  <div className={styles.leadsTableContainer}>
                    <div className={styles.tableHeader}>
                      <h3>Активные лиды</h3>
                      <div className={styles.tableActions}>
                        <button className={styles.exportButton}>
                          <FiDownload /> Экспорт
                        </button>
                        <button className={styles.filterButton}>
                          <FiFilter /> Фильтры
                        </button>
                      </div>
                    </div>
                    
                    <table className={styles.leadsTable}>
                      <thead>
                        <tr>
                          <th>Имя</th>
                          <th>Контакты</th>
                          <th>Источник</th>
                          <th>Статус</th>
                          <th>Дата</th>
                          <th>Ценность</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(lead => (
                          <tr key={lead.id}>
                            <td>
                              <div className={styles.leadName}>{lead.name}</div>
                              <div className={styles.leadNote}>{lead.notes}</div>
                            </td>
                            <td>
                              <div>{lead.email}</div>
                              <div>{lead.phone}</div>
                            </td>
                            <td>{lead.source}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
                                {lead.status === 'new' && 'Новый'}
                                {lead.status === 'contacted' && 'Контакт'}
                                {lead.status === 'converted' && 'Конверт'}
                                {lead.status === 'lost' && 'Потерян'}
                              </span>
                            </td>
                            <td>
                              <div>{new Date(lead.date).toLocaleDateString()}</div>
                              {lead.lastContact && (
                                <div className={styles.lastContact}>
                                  Контакт: {new Date(lead.lastContact).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                            <td>${lead.value}</td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button 
                                  className={styles.actionButton}
                                  onClick={() => handleLeadAction(lead.id, 'contact')}
                                  disabled={lead.status === 'contacted' || lead.status === 'converted'}
                                >
                                  <FiEye /> Контакт
                                </button>
                                <button 
                                  className={styles.actionButton}
                                  onClick={() => handleLeadAction(lead.id, 'convert')}
                                  disabled={lead.status === 'converted'}
                                >
                                  <FiCheck /> Конверт
                                </button>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => handleLeadAction(lead.id, 'delete')}
                                >
                                  <FiTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className={styles.analyticsContainer}>
                  <div className={styles.statsRow}>
                    <StatsCard 
                      icon={<FiShoppingBag />}
                      title="Всего лидов"
                      value={stats.totalLeads.toString()}
                      change={stats.leadsChange}
                    />
                    <StatsCard 
                      icon={<FiTrendingUp />}
                      title="Конверсия"
                      value={`${stats.conversionRate}%`}
                      change={stats.conversionChange}
                    />
                    <StatsCard 
                      icon={<FiDollarSign />}
                      title="Доход"
                      value={`$${stats.revenue}`}
                      change={stats.revenueChange}
                    />
                    <StatsCard 
                      icon={<FiActivity />}
                      title="ROI"
                      value={`${stats.roi}%`}
                      change={3}
                    />
                  </div>

                  <div className={styles.chartRow}>
                    <div className={styles.chartContainer}>
                      <h3>Конверсия по источникам</h3>
                      <AnalyticsChart 
                        data={stats.topSources.map(s => s.percentage)}
                        labels={stats.topSources.map(s => s.name)}
                        type="doughnut"
                      />
                    </div>
                    <div className={styles.chartContainer}>
                      <h3>Эффективность команд</h3>
                      <AnalyticsChart 
                        data={stats.teamPerformance.map(t => t.conversion)}
                        labels={stats.teamPerformance.map(t => t.name)}
                        type="bar"
                      />
                    </div>
                  </div>

                  <div className={styles.fullWidthChart}>
                    <h3>Динамика лидов и конверсии</h3>
                    <AnalyticsChart 
                      data={[65, 59, 80, 81, 56, 55, 40, 75, 82, 78, 85, 90]}
                      labels={['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']}
                      type="line"
                      secondDataSet={[28, 32, 35, 30, 38, 42, 45, 40, 48, 45, 50, 55]}
                    />
                  </div>

                  <div className={styles.sourcePerformance}>
                    <h3>Эффективность источников</h3>
                    <table className={styles.performanceTable}>
                      <thead>
                        <tr>
                          <th>Источник</th>
                          <th>Лиды</th>
                          <th>Конверсия</th>
                          <th>Средняя ценность</th>
                          <th>ROI</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topSources.map((source, index) => (
                          <tr key={index}>
                            <td>{source.name}</td>
                            <td>{source.count}</td>
                            <td>{(source.percentage * 0.8).toFixed(1)}%</td>
                            <td>${(index * 25 + 85).toFixed(0)}</td>
                            <td>{(source.percentage * 0.6).toFixed(1)}%</td>
                            <td>
                              <span className={source.percentage > 25 ? styles.statusActive : styles.statusWarning}>
                                {source.percentage > 25 ? 'Активный' : 'Требует внимания'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'balance' && (
                <div className={styles.balanceContainer}>
                  <div className={styles.balanceOverview}>
                    <div className={styles.balanceCard}>
                      <div className={styles.balanceHeader}>
                        <FiCreditCard className={styles.balanceIcon} />
                        <h3>Баланс счета</h3>
                      </div>
                      <div className={styles.balanceAmount}>${stats.balance.toLocaleString()}</div>
                      <div className={styles.balanceActions}>
                        <button 
                          className={styles.topUpButton}
                          onClick={() => topUpBalance(500)}
                        >
                          Пополнить баланс
                        </button>
                        <button className={styles.payoutButton}>
                          Запросить выплату
                        </button>
                      </div>
                    </div>

                    <div className={styles.budgetCard}>
                      <div className={styles.budgetHeader}>
                        <div>
                          <h3>Бюджет на сегодня</h3>
                          <p>${stats.spentToday} из ${stats.dailyBudget}</p>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${(stats.spentToday / stats.dailyBudget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={styles.budgetFooter}>
                        <div>
                          <h3>Недельный бюджет</h3>
                          <p>${stats.spentToday * 3} из ${stats.weeklyBudget}</p>
                        </div>
                        <button className={styles.settingsButton}>
                          <FiSettings /> Настроить
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.paymentHistory}>
                    <h3>История платежей</h3>
                    <PaymentHistory payments={stats.recentPayments} />
                  </div>
                  
                  <div className={styles.purchaseHistory}>
                    <h3>История покупок лидов</h3>
                    <table className={styles.purchaseTable}>
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Кол-во лидов</th>
                          <th>Сумма</th>
                          <th>Статус</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseHistory.map(purchase => (
                          <tr key={purchase.id}>
                            <td>{purchase.date}</td>
                            <td>{purchase.leads.length}</td>
                            <td>${purchase.totalAmount}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${purchase.status === 'completed' ? styles.completed : styles.pending}`}>
                                {purchase.status === 'completed' ? 'Завершено' : 'Ожидание'}
                              </span>
                            </td>
                            <td>
                              <button className={styles.detailsButton}>
                                <FiEye /> Подробности
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.invoiceSection}>
                    <h3>Неоплаченные счета</h3>
                    <div className={styles.invoiceGrid}>
                      <div className={styles.invoiceCard}>
                        <div className={styles.invoiceHeader}>
                          <div className={styles.invoiceId}>INV-20230615-001</div>
                          <div className={styles.invoiceStatusPending}>Ожидает оплаты</div>
                        </div>
                        <div className={styles.invoiceDetails}>
                          <div>
                            <span>Дата:</span>
                            <span>15.06.2023</span>
                          </div>
                          <div>
                            <span>Сумма:</span>
                            <span className={styles.invoiceAmount}>$450</span>
                          </div>
                          <div>
                            <span>Срок оплаты:</span>
                            <span>22.06.2023</span>
                          </div>
                        </div>
                        <div className={styles.invoiceActions}>
                          <button className={styles.payButton}>Оплатить сейчас</button>
                          <button className={styles.downloadButton}>
                            <FiDownload /> Счет
                          </button>
                        </div>
                      </div>

                      <div className={styles.invoiceCard}>
                        <div className={styles.invoiceHeader}>
                          <div className={styles.invoiceId}>INV-20230610-002</div>
                          <div className={styles.invoiceStatusWarning}>Просрочен</div>
                        </div>
                        <div className={styles.invoiceDetails}>
                          <div>
                            <span>Дата:</span>
                            <span>10.06.2023</span>
                          </div>
                          <div>
                            <span>Сумма:</span>
                            <span className={styles.invoiceAmount}>$320</span>
                          </div>
                          <div>
                            <span>Срок оплаты:</span>
                            <span>15.06.2023</span>
                          </div>
                        </div>
                        <div className={styles.invoiceActions}>
                          <button className={styles.payButton}>Оплатить сейчас</button>
                          <button className={styles.downloadButton}>
                            <FiDownload /> Счет
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'filters' && (
                <div className={styles.filtersManagerContainer}>
                  <div className={styles.filtersHeader}>
                    <h2>Управление фильтрами</h2>
                    <button className={styles.newFilterButton}>
                      <FiPlus /> Создать фильтр
                    </button>
                  </div>

                  <div className={styles.filtersDescription}>
                    <p>
                      Сохраняйте часто используемые фильтры для быстрого доступа к нужным лидам. 
                      Настройте параметры один раз и используйте их в любое время.
                    </p>
                  </div>

                  <FilterManager 
                    filters={savedFilters} 
                    onSave={saveFilter}
                    onApply={applyFilter}
                    onDelete={deleteFilter}
                  />

                  <div className={styles.defaultFilters}>
                    <h3>Системные фильтры</h3>
                    <div className={styles.defaultFilterGrid}>
                      <div className={styles.filterCard}>
                        <div className={styles.filterHeader}>
                          <div className={styles.filterName}>Горящие лиды</div>
                          <div className={styles.filterBadge}>Системный</div>
                        </div>
                        <div className={styles.filterCriteria}>
                          Рейтинг: {'>'}90, Цена: {'>'}75, Срочность: {'>'}8
                        </div>
                        <button className={styles.applyFilterButton}>
                          Применить фильтр
                        </button>
                      </div>

                      <div className={styles.filterCard}>
                        <div className={styles.filterHeader}>
                          <div className={styles.filterName}>Высокий доход</div>
                          <div className={styles.filterBadge}>Системный</div>
                        </div>
                        <div className={styles.filterCriteria}>
                          Доход: {'>'}150000, Возраст: 30-50, Регион: Центральный
                        </div>
                        <button className={styles.applyFilterButton}>
                          Применить фильтр
                        </button>
                      </div>

                      <div className={styles.filterCard}>
                        <div className={styles.filterHeader}>
                          <div className={styles.filterName}>Эконом-сегмент</div>
                          <div className={styles.filterBadge}>Системный</div>
                        </div>
                        <div className={styles.filterCriteria}>
                          Цена: {'<'}60, Рейтинг: {'>'}70, Тип: Потребительский
                        </div>
                        <button className={styles.applyFilterButton}>
                          Применить фильтр
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai_manager' && (
                <div className={styles.aiManagerContainer}>
                  <div className={styles.aiHeader}>
                    <h2>AI-менеджер лидов</h2>
                    <div className={styles.aiStatus}>
                      <span className={styles.statusActive}>Активен</span>
                      <span className={styles.aiBadge}>Beta</span>
                    </div>
                  </div>

                  <div className={styles.aiDescription}>
                    <p>
                      Наш AI-менеджер автоматически анализирует и покупает лиды, соответствующие вашим критериям.
                      Экономьте время и увеличивайте эффективность с помощью искусственного интеллекта.
                    </p>
                  </div>

                  <div className={styles.aiStats}>
                    <div className={styles.aiStatCard}>
                      <div className={styles.statValue}>128</div>
                      <div className={styles.statLabel}>Лидов куплено AI</div>
                    </div>
                    <div className={styles.aiStatCard}>
                      <div className={styles.statValue}>37%</div>
                      <div className={styles.statLabel}>Конверсия</div>
                    </div>
                    <div className={styles.aiStatCard}>
                      <div className={styles.statValue}>8.5x</div>
                      <div className={styles.statLabel}>ROI</div>
                    </div>
                    <div className={styles.aiStatCard}>
                      <div className={styles.statValue}>$12.4K</div>
                      <div className={styles.statLabel}>Сгенерировано доходов</div>
                    </div>
                  </div>

                  <AISettings 
                    settings={aiSettings} 
                    onUpdate={updateAiSetting} 
                  />

                  <div className={styles.aiRecommendations}>
                    <h3>Рекомендации AI</h3>
                    <div className={styles.recommendationsGrid}>
                      <div className={styles.recommendationCard}>
                        <div className={styles.recommendationHeader}>
                          <div className={styles.recommendationTitle}>Увеличьте бюджет</div>
                          <div className={styles.recommendationBadge}>Финансы</div>
                        </div>
                        <div className={styles.recommendationContent}>
                          <p>
                            Ваш текущий ROI составляет 8.5x. Увеличение дневного бюджета на $50 
                            может принести дополнительно $425 дохода ежемесячно.
                          </p>
                          <button className={styles.applyRecommendation}>
                            Применить рекомендацию
                          </button>
                        </div>
                      </div>

                      <div className={styles.recommendationCard}>
                        <div className={styles.recommendationHeader}>
                          <div className={styles.recommendationTitle}>Оптимизация фильтров</div>
                          <div className={styles.recommendationBadge}>Фильтры</div>
                        </div>
                        <div className={styles.recommendationContent}>
                          <p>
                            Добавьте критерий "Кредитный рейтинг {'>'} 700" к вашим фильтрам. 
                            Это увеличит конверсию на 15% согласно историческим данным.
                          </p>
                          <button className={styles.applyRecommendation}>
                            Применить рекомендацию
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className={styles.settingsContainer}>
                  <div className={styles.settingsSection}>
                    <h3>Интеграции</h3>
                    <div className={styles.integrationsGrid}>
                      <div className={styles.integrationCard}>
                        <div className={styles.integrationHeader}>
                          <FiCode className={styles.integrationIcon} />
                          <h4>API & Webhooks</h4>
                        </div>
                        <p>Настройте интеграцию с вашей CRM системой через API</p>
                        <button className={styles.configureButton}>
                          Настроить
                        </button>
                      </div>
                      
                      <div className={styles.integrationCard}>
                        <div className={styles.integrationHeader}>
                          <FiDatabase className={styles.integrationIcon} />
                          <h4>Экспорт данных</h4>
                        </div>
                        <p>Настройте автоматический экспорт лидов в нужном формате</p>
                        <button className={styles.configureButton}>
                          Настроить
                        </button>
                      </div>
                      
                      <div className={styles.integrationCard}>
                        <div className={styles.integrationHeader}>
                          <FiActivity className={styles.integrationIcon} />
                          <h4>Аналитика</h4>
                        </div>
                        <p>Интеграция с Google Analytics и другими аналитическими системами</p>
                        <button className={styles.configureButton}>
                          Настроить
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.settingsSection}>
                    <h3>Настройки уведомлений</h3>
                    <div className={styles.notificationSettings}>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" defaultChecked />
                          <span>Уведомления о новых лидах</span>
                        </label>
                      </div>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" defaultChecked />
                          <span>Уведомления о пополнении баланса</span>
                        </label>
                      </div>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" defaultChecked />
                          <span>Уведомления о достижении лимитов</span>
                        </label>
                      </div>
                      <div className={styles.settingItem}>
                        <label>
                          <input type="checkbox" />
                          <span>Ежедневные отчеты</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.settingsSection}>
                    <h3>Безопасность</h3>
                    <div className={styles.securitySettings}>
                      <div className={styles.securityItem}>
                        <div>
                          <h4>Двухфакторная аутентификация</h4>
                          <p>Добавьте дополнительный уровень безопасности к вашему аккаунту</p>
                        </div>
                        <button className={styles.enableButton}>
                          Включить
                        </button>
                      </div>
                      
                      <div className={styles.securityItem}>
                        <div>
                          <h4>История входов</h4>
                          <p>Последние действия в вашем аккаунте</p>
                        </div>
                        <button className={styles.viewButton}>
                          Просмотреть
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {supportChatOpen && (
        <div className={styles.supportChat}>
          <div className={styles.chatHeader}>
            <h3>Чат поддержки</h3>
            <button onClick={() => setSupportChatOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className={styles.chatMessages}>
            <div className={styles.message}>
              <div className={styles.avatar}>S</div>
              <div className={styles.content}>
                <div className={styles.name}>Поддержка LeadSpace</div>
                <div className={styles.text}>Здравствуйте! Чем могу помочь?</div>
                <div className={styles.time}>Сейчас</div>
              </div>
            </div>
          </div>
          <div className={styles.chatInput}>
            <input type="text" placeholder="Введите сообщение..." />
            <button>
              <FiMessageSquare />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LenderDashboard;