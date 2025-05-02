import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

const ApiIntegrationTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      // Test 1: Connection Test
      try {
        const response = await fetch('http://localhost:8004/api/auth/test/');
        const data = await response.json();
        setResults(prev => [...prev, {
          endpoint: '/api/auth/test/',
          status: 'success',
          message: data.message || 'Connection successful',
          data
        }]);
      } catch (error) {
        setResults(prev => [...prev, {
          endpoint: '/api/auth/test/',
          status: 'error',
          message: 'Connection failed'
        }]);
      }

      // Test 2: Get Tags
      try {
        const tags = await api.getTags();
        setResults(prev => [...prev, {
          endpoint: '/api/tags/',
          status: 'success',
          message: `Retrieved ${tags.length} tags`,
          data: tags
        }]);
      } catch (error) {
        setResults(prev => [...prev, {
          endpoint: '/api/tags/',
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to get tags'
        }]);
      }

      // Test 3: Get Discussions
      try {
        const discussions = await api.getDiscussions();
        setResults(prev => [...prev, {
          endpoint: '/api/discussions/',
          status: 'success',
          message: `Retrieved ${discussions.length} discussions`,
          data: discussions
        }]);
      } catch (error) {
        setResults(prev => [...prev, {
          endpoint: '/api/discussions/',
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to get discussions'
        }]);
      }

      toast({
        title: 'API Tests Completed',
        description: 'Check the results below',
      });
    } catch (error) {
      console.error('Test execution error:', error);
      toast({
        title: 'Test Execution Failed',
        description: 'An error occurred while running the tests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Integration Tests</CardTitle>
        <CardDescription>
          Test various API endpoints to ensure proper integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  result.status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <h3 className="font-medium">{result.endpoint}</h3>
                <p>{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">View Response Data</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Click the button below to run API integration tests</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={runTests}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run API Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiIntegrationTest;
