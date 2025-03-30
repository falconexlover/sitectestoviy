import React, { ReactNode } from 'react';
import HeaderNav from '../Navigation/HeaderNav';
import Footer from './Footer';

// Типизация пропсов
interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Основной макет приложения, включающий хедер и футер
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`app-layout ${className}`}>
      <HeaderNav />
      
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout; 