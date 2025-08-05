import React, { useState } from 'react';
import { FiFilter, FiSave, FiTrash, FiX, FiEdit } from 'react-icons/fi';
import styles from './FilterManager.module.scss';

export interface Filter {
  id: string;
  name: string;
  lastUsed: string;
  criteria: string;
  isDefault: boolean;
}

interface FilterManagerProps {
  filters: Filter[];
  onSave: (filter: Filter) => void;
  onApply: (filter: Filter) => void;
  onDelete: (id: string) => void;
}

const FilterManager: React.FC<FilterManagerProps> = ({ 
  filters, 
  onSave, 
  onApply,
  onDelete
}) => {
  const [newFilterName, setNewFilterName] = useState('');
  const [newFilterCriteria, setNewFilterCriteria] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFilterName && newFilterCriteria) {
      onSave({
        id: editingFilter?.id || `f${Date.now()}`,
        name: newFilterName,
        criteria: newFilterCriteria,
        lastUsed: new Date().toISOString().split('T')[0],
        isDefault: editingFilter?.isDefault || false
      });
      resetForm();
    }
  };

  const handleEdit = (filter: Filter) => {
    setEditingFilter(filter);
    setNewFilterName(filter.name);
    setNewFilterCriteria(filter.criteria);
    setShowForm(true);
  };

  const resetForm = () => {
    setNewFilterName('');
    setNewFilterCriteria('');
    setShowForm(false);
    setEditingFilter(null);
  };

  return (
    <div className={styles.filterManager}>
      <div className={styles.filterList}>
        {filters.map(filter => (
          <div key={filter.id} className={styles.filterItem}>
            <div className={styles.filterInfo}>
              <div className={styles.filterName}>{filter.name}</div>
              <div className={styles.filterCriteria}>{filter.criteria}</div>
              <div className={styles.filterMeta}>
                <span>Последнее использование: {filter.lastUsed}</span>
                {filter.isDefault && <span className={styles.defaultBadge}>По умолчанию</span>}
              </div>
            </div>
            <div className={styles.filterActions}>
              <button 
                className={styles.applyButton}
                onClick={() => onApply(filter)}
              >
                <FiFilter /> Применить
              </button>
              <div className={styles.secondaryActions}>
                {!filter.isDefault && (
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit(filter)}
                  >
                    <FiEdit />
                  </button>
                )}
                {!filter.isDefault && (
                  <button 
                    className={styles.deleteButton}
                    onClick={() => onDelete(filter.id)}
                  >
                    <FiTrash />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form className={styles.newFilterForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h3>{editingFilter ? 'Редактировать фильтр' : 'Новый фильтр'}</h3>
            <button 
              type="button" 
              className={styles.closeButton}
              onClick={resetForm}
            >
              <FiX />
            </button>
          </div>
          
          <div className={styles.formGroup}>
            <label>Название фильтра</label>
            <input
              type="text"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              placeholder="Например: Премиум ипотека"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Критерии фильтрации</label>
            <textarea
              value={newFilterCriteria}
              onChange={(e) => setNewFilterCriteria(e.target.value)}
              placeholder="Опишите параметры фильтрации..."
              rows={4}
              required
            />
          </div>
          
          <button type="submit" className={styles.saveButton}>
            <FiSave /> {editingFilter ? 'Обновить фильтр' : 'Сохранить фильтр'}
          </button>
        </form>
      ) : (
        <button 
          className={styles.addFilterButton}
          onClick={() => setShowForm(true)}
        >
          + Создать новый фильтр
        </button>
      )}
    </div>
  );
};

export default React.memo(FilterManager);