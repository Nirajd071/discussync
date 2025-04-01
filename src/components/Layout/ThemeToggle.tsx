
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user preference is saved in local storage
    const savedMode = localStorage.getItem('color-mode');
    return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-mode', 'light');
    }
  }, [isDarkMode]);

  const toggleColorMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center gap-1">
      <Sun className="h-4 w-4 dark:text-gray-400 text-yellow-500" />
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleColorMode}
        className="data-[state=checked]:bg-red-600"
      />
      <Moon className="h-4 w-4 dark:text-white text-gray-400" />
    </div>
  );
};

export default ThemeToggle;
