
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/discussions');
    } catch (error) {
      // Error is already handled in AuthContext
      setIsLoading(false);
    }
  };

  // For demo purposes, prefill with mock data
  const handleDemoLogin = () => {
    setEmail('john@example.com');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-forum-primary" />
        <span className="text-xl font-bold bg-gradient-to-r from-forum-primary to-forum-secondary bg-clip-text text-transparent">
          ChatterBox
        </span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto text-xs" asChild>
                  <Link to="/forgot-password">Forgot password?</Link>
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full text-muted-foreground"
              onClick={handleDemoLogin}
              type="button"
            >
              Demo Account (For testing)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
