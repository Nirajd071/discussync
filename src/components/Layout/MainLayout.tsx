
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ScrollArea className="flex-1">
        <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          {children}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default MainLayout;
