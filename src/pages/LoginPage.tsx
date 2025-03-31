
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { MessageSquare, ArrowRight, Eye, EyeOff, UserCircle, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ThreeJsBackground from '@/components/ThreeJsBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
        variant: 'default',
      });
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30 overflow-hidden">
      <ThreeJsBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
            <MessageSquare className="h-6 w-6 text-forum-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-forum-primary to-forum-secondary bg-clip-text text-transparent">
              ChatterBox
            </span>
          </Link>
          
          <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl animate-scale-in border-opacity-30">
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
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs" asChild>
                      <Link to="/forgot-password">Forgot password?</Link>
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-forum-primary to-forum-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </form>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full text-muted-foreground hover:bg-primary/10 transition-all duration-300"
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
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/20 backdrop-blur-sm">
            <Link to="/">
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
