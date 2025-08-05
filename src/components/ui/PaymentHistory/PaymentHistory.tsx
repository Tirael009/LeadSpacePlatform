import React, { useState } from 'react';
import { FiDownload, FiCheck, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './PaymentHistory.module.scss';

export interface Payment {
  id: string;
  date: string;
  publisher: string;
  leadsCount: number;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceId?: string;
  details?: {
    leads: string[];
    paymentMethod: string;
    transactionId: string;
  };
}

interface PaymentHistoryProps {
  payments: Payment[];
}

type SortableKey = 'date' | 'publisher' | 'leadsCount' | 'amount';

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ 
    key: SortableKey; 
    direction: 'asc' | 'desc' 
  } | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  
  const requestSort = (key: SortableKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedPayments = React.useMemo(() => {
    if (!sortConfig) return payments;
    
    return [...payments].sort((a, b) => {
      // Обработка числовых полей
      if (sortConfig.key === 'leadsCount') {
        return sortConfig.direction === 'asc' 
          ? a.leadsCount - b.leadsCount 
          : b.leadsCount - a.leadsCount;
      }
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      
      // Обработка строковых полей
      const valueA = a[sortConfig.key] as string;
      const valueB = b[sortConfig.key] as string;
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [payments, sortConfig]);

  return (
    <div className={styles.paymentHistory}>
      <table className={styles.paymentsTable}>
        <thead>
          <tr>
            <th onClick={() => requestSort('date')}>
              <div className={styles.sortableHeader}>
                Дата
                {sortConfig?.key === 'date' && (
                  <span>{sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}</span>
                )}
              </div>
            </th>
            <th onClick={() => requestSort('publisher')}>
              <div className={styles.sortableHeader}>
                Партнер
                {sortConfig?.key === 'publisher' && (
                  <span>{sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}</span>
                )}
              </div>
            </th>
            <th onClick={() => requestSort('leadsCount')}>
              <div className={styles.sortableHeader}>
                Лидов
                {sortConfig?.key === 'leadsCount' && (
                  <span>{sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}</span>
                )}
              </div>
            </th>
            <th onClick={() => requestSort('amount')}>
              <div className={styles.sortableHeader}>
                Сумма
                {sortConfig?.key === 'amount' && (
                  <span>{sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}</span>
                )}
              </div>
            </th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedPayments.map((payment) => (
            <React.Fragment key={payment.id}>
              <tr onClick={() => toggleExpand(payment.id)} className={styles.expandableRow}>
                <td>{payment.date}</td>
                <td>{payment.publisher}</td>
                <td>{payment.leadsCount}</td>
                <td>${payment.amount.toLocaleString('en-US')}</td>
                <td>
                  <span className={`${styles.status} ${
                    payment.status === 'paid' ? styles.paid : 
                    payment.status === 'pending' ? styles.pending : 
                    styles.failed
                  }`}>
                    {payment.status === 'paid' ? <FiCheck /> : <FiAlertCircle />}
                    {payment.status === 'paid' ? 'Оплачен' : 
                     payment.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    {payment.invoiceId && (
                      <button className={styles.downloadButton}>
                        <FiDownload /> Счет
                      </button>
                    )}
                    <button 
                      className={styles.expandButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(payment.id);
                      }}
                    >
                      {expandedRow === payment.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </td>
              </tr>
              
              {expandedRow === payment.id && payment.details && (
                <tr className={styles.detailsRow}>
                  <td colSpan={6}>
                    <div className={styles.detailsContent}>
                      <div className={styles.detailItem}>
                        <strong>Метод оплаты:</strong> {payment.details.paymentMethod}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>ID транзакции:</strong> {payment.details.transactionId}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Лиды:</strong>
                        <ul className={styles.leadsList}>
                          {payment.details.leads.map((lead, index) => (
                            <li key={index}>{lead}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {payments.length === 0 && (
        <div className={styles.emptyState}>
          <p>Нет данных о платежах</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(PaymentHistory);