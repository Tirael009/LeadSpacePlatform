import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import styles from './Layout.module.scss';

export const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <main className={styles.mainContent}>
        <Outlet /> {/* Здесь будут рендериться страницы со своими сайдбарами */}
      </main>
      <Footer />
    </div>
  );
};