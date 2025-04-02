import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  fullWidth = false,
  noPadding = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <ScrollArea className="flex-1">
        <main className={`
          mx-auto py-8 
          ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'} 
          ${fullWidth ? 'container-fluid' : 'container max-w-7xl'}
        `}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default MainLayout;
