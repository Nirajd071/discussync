
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ApiConnectionTest: React.FC = () => {
  const { testApiConnection } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message?: string; status?: string } | null>(null);
  
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const response = await testApiConnection();
      setResult(response);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the FastAPI backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <div className={`p-4 rounded-md ${result.status === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{result.message || 'Connection test completed'}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnection}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test API Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConnectionTest;
