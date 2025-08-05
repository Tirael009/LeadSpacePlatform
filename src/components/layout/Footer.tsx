import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© {currentYear} SpaceLeads Pro. Все права защищены.</p>
        <div className={styles.links}>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Условия использования</a>
          <a href="#">Контакты</a>
        </div>
      </div>
    </footer>
  );
};