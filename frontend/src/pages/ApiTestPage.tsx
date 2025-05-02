import React from 'react';
import ApiConnectionTest from '@/components/ApiConnectionTest';
import ApiIntegrationTest from '@/components/ApiIntegrationTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ApiTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            Test the basic connection to the backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiConnectionTest />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Integration Tests</CardTitle>
          <CardDescription>
            Test various API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiIntegrationTest />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestPage;
