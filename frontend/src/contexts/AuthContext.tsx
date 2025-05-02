
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const token = localStorage.getItem('auth_token');
        if (token) {
          console.log('Found token in localStorage, validating...');
          try {
            // Attempt to get current user with the token
            const currentUser = await api.getCurrentUser();
            console.log('Authentication successful, user:', currentUser);
            setUser(currentUser);
            setToken(token);

            // Set up token refresh interval (every 23 hours to be safe)
            const refreshInterval = setInterval(() => {
              // Refresh token silently in the background
              const storedToken = localStorage.getItem('auth_token');
              if (storedToken) {
                console.log('Refreshing auth token in background');
                api.getCurrentUser().catch(err => {
                  console.error('Token refresh failed:', err);
                  // If refresh fails, clear token and user
                  localStorage.removeItem('auth_token');
                  setUser(null);
                  setToken(null);
                  clearInterval(refreshInterval);
                  toast({
                    title: 'Session expired',
                    description: 'Please log in again.',
                    variant: 'destructive',
                  });
                });
              } else {
                clearInterval(refreshInterval);
              }
            }, 23 * 60 * 60 * 1000); // 23 hours

            // Clean up interval on unmount
            return () => clearInterval(refreshInterval);
          } catch (validationError) {
            console.error('Token validation failed:', validationError);
            // Clear invalid token
            localStorage.removeItem('auth_token');
            setUser(null);
            setToken(null);
            toast({
              title: 'Authentication failed',
              description: 'Your session has expired. Please log in again.',
              variant: 'destructive',
            });
          }
        } else {
          console.log('No authentication token found');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid token
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);

      // Track login event
      analytics.trackLogin(loggedInUser.id);

      toast({
        title: 'Welcome back!',
        description: `You're now logged in as ${loggedInUser.name}`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Registering user with data:', userData);
      const newUser = await api.register(userData);
      console.log('AuthContext: Registration successful, user:', newUser);
      setUser(newUser);

      // Set token from localStorage
      const token = localStorage.getItem('auth_token');
      setToken(token);

      // Track registration event
      analytics.trackRegister(newUser.id);

      toast({
        title: 'Registration successful',
        description: `Welcome to the forum, ${newUser.name}!`,
      });
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');

      console.log('AuthContext: Updating user profile with data:', userData);

      // Special handling for avatar updates
      if (userData.avatar !== undefined) {
        console.log('AuthContext: Avatar update detected:', userData.avatar);
      }

      const updatedUser = await api.updateUserProfile(user.id, userData);
      console.log('AuthContext: Profile update successful, updated user:', updatedUser);

      // Update the local user state with the new data
      setUser(prev => {
        if (!prev) return updatedUser;

        // Merge the updated user data with the existing user data
        const mergedUser = {
          ...prev,
          ...updatedUser,
          // Ensure avatar is properly updated
          avatar: updatedUser.avatar !== undefined ? updatedUser.avatar : prev.avatar
        };

        console.log('AuthContext: Updated local user state:', mergedUser);
        return mergedUser;
      });

      // Only show toast if not called from another function that shows its own toast
      if (!userData.suppressToast) {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      }

      return updatedUser;
    } catch (error) {
      console.error('AuthContext: Profile update failed:', error);

      // Only show toast if not called from another function that shows its own toast
      if (!userData.suppressToast) {
        toast({
          title: 'Update failed',
          description: error instanceof Error ? error.message : 'Failed to update profile',
          variant: 'destructive',
        });
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
