import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  const isAdmin = user?.isAdmin;
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg inline-flex mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You don't have permission to access the analytics dashboard. 
            This area is restricted to administrators only.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
