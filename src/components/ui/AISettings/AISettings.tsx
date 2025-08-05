import React from 'react';
import { FiInfo, FiZap, FiSliders, FiChevronDown } from 'react-icons/fi';
import styles from './AISettings.module.scss';

export interface AISetting {
  name: string;
  value: boolean | number | string;
  description: string;
  type: 'toggle' | 'slider' | 'select';
  options?: string[];
  category?: string;
}

interface AISettingsProps {
  settings: AISetting[];
  onUpdate: (name: string, value: boolean | number | string) => void;
}

const AISettings: React.FC<AISettingsProps> = ({ settings, onUpdate }) => {
  // Группировка настроек по категориям
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'Общие';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, AISetting[]>);

  const renderControl = (setting: AISetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={(e) => onUpdate(setting.name, e.target.checked)}
              aria-label={setting.name}
            />
            <span className={styles.slider}></span>
          </label>
        );
        
      case 'slider':
        return (
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="0"
              max="100"
              value={setting.value as number}
              onChange={(e) => onUpdate(setting.name, parseInt(e.target.value))}
              className={styles.sliderInput}
              aria-label={`${setting.name} slider`}
            />
            <div className={styles.sliderValue}>{setting.value}%</div>
            
            {setting.options && (
              <div className={styles.sliderOptions}>
                {setting.options.map((option, index) => (
                  <span key={index}>{option}</span>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div className={styles.selectContainer}>
            <select
              value={setting.value as string}
              onChange={(e) => onUpdate(setting.name, e.target.value)}
              className={styles.selectInput}
              aria-label={setting.name}
            >
              {setting.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FiChevronDown className={styles.selectArrow} />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={styles.aiSettings}>
      <h3>
        <FiZap className={styles.settingsIcon} />
        Настройки AI-менеджера
      </h3>
      
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <div key={category} className={styles.settingsCategory}>
          <div className={styles.categoryHeader}>
            <FiSliders className={styles.categoryIcon} />
            <h4>{category}</h4>
          </div>
          
          <div className={styles.settingsGrid}>
            {categorySettings.map((setting) => (
              <div key={setting.name} className={styles.settingCard}>
                <div className={styles.settingHeader}>
                  <div className={styles.settingName}>{setting.name}</div>
                  {renderControl(setting)}
                </div>
                
                <div className={styles.settingDescription}>
                  <FiInfo className={styles.infoIcon} />
                  {setting.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(AISettings);