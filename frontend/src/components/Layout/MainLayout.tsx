import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate content loading
  useEffect(() => {
    // Set a timeout to hide the loader after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <ScrollArea className="flex-1">
        <main className={`
          mx-auto py-8
          ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'}
          ${fullWidth ? 'container-fluid' : 'container max-w-7xl'}
        `}>
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <span className="ml-2 text-emerald-600">Loading content...</span>
            </div>
          ) : (
            <div className="animate-fade-in">
              {children}
            </div>
          )}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default MainLayout;
