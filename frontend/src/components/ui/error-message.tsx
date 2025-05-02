import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry,
  className 
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={cn('flex flex-col items-start', className)}>
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>{title}</AlertTitle>
      </div>
      <AlertDescription className="mt-2">{message}</AlertDescription>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="mt-2 bg-background hover:bg-background/80"
        >
          Try Again
        </Button>
      )}
    </Alert>
  );
}
