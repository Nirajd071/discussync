
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<null | {
    id: string;
    email: string;
    name: string;
    username: string;
  }>(null);

  // Test API connection
  const testApiConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8004/api/auth/test/');
      const data = await response.json();

      toast({
        title: 'API Connection Test',
        description: data.message || 'Connection test completed',
        variant: data.status === 'ok' ? 'default' : 'destructive',
      });

      return data;
    } catch (error) {
      console.error('API connection test failed:', error);
      toast({
        title: 'API Connection Failed',
        description: 'Could not connect to the FastAPI backend. Please make sure it is running.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // For now, use mock login
      setIsAuthenticated(true);
      setUser({ id: '1', email, name: 'Test User', username: email });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    testApiConnection
  };
};
