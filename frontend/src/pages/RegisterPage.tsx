import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState('');
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Test connection to backend
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:8004/api/auth/test/');
        const data = await response.json();
        setTestResult(`Backend connection successful: ${JSON.stringify(data)}`);
        console.log('Test connection successful:', data);

        // Test direct registration
        try {
          const testEmail = `test${Date.now()}@example.com`;
          const testUsername = `testuser${Date.now()}`;
          const directResponse = await fetch('http://localhost:8004/api/auth/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: testUsername,
              email: testEmail,
              password: 'Password123',
              first_name: 'Test',
              last_name: 'User'
            })
          });

          if (directResponse.ok) {
            const directData = await directResponse.json();
            console.log('Direct registration test successful:', directData);
          } else {
            const errorData = await directResponse.json();
            console.error('Direct registration test failed:', errorData);
          }
        } catch (regError) {
          console.error('Direct registration test error:', regError);
        }
      } catch (error) {
        setTestResult(`Backend connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Test connection failed:', error);
      }
    };

    testBackendConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !username || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Split the full name into first and last name
      const firstName = name.split(' ')[0];
      const lastName = name.split(' ').slice(1).join(' ') || undefined;

      // Log the data being sent
      console.log('Sending registration data:', {
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName
      });

      // Try direct fetch with the correct backend URL and data format
      try {
        const directResponse = await fetch('http://localhost:8004/api/auth/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName
          })
        });

        if (directResponse.ok) {
          const data = await directResponse.json();
          console.log('Direct registration successful:', data);
          localStorage.setItem('auth_token', data.token);
          toast({
            title: 'Registration successful',
            description: `Welcome to the forum, ${firstName}!`,
          });
          navigate('/discussions');
          return;
        } else {
          const errorData = await directResponse.json();
          console.error('Direct registration failed:', errorData);

          // Display a more user-friendly error message
          let errorMessage = 'Registration failed';
          if (errorData.detail && typeof errorData.detail === 'string') {
            if (errorData.detail.includes('Email already registered')) {
              errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            } else if (errorData.detail.includes('Username already taken')) {
              errorMessage = 'This username is already taken. Please choose a different username.';
            } else {
              errorMessage = errorData.detail;
            }
          } else {
            errorMessage = JSON.stringify(errorData);
          }

          toast({
            title: 'Registration failed',
            description: errorMessage,
            variant: 'destructive',
          });

          // Don't throw an error, just return so the user can try again
          setIsLoading(false);
          return;
        }
      } catch (directError) {
        console.error('Direct registration error:', directError);

        // Display a user-friendly error message
        toast({
          title: 'Registration failed',
          description: 'There was an error connecting to the server. Please try again later.',
          variant: 'destructive',
        });

        setIsLoading(false);
        return;
      }

      // Send only the fields that the backend expects
      await register({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName
      });
      navigate('/discussions');
    } catch (error) {
      console.error('Registration error:', error);

      // Display a user-friendly error message
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Email already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.message.includes('Username already taken')) {
          errorMessage = 'This username is already taken. Please choose a different username.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-emerald-600" />
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          ChatterBox
        </span>
      </Link>

      <Card className="w-full max-w-md border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join our community to start discussions and collaborate
          </CardDescription>
          {testResult && (
            <div className={`mt-2 p-2 text-xs rounded ${testResult.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {testResult}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                required
                className="border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="mb-2">Password must have:</p>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <CheckCircle2 className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className={`h-3 w-3 mr-1 ${/[A-Z]/.test(password) ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className={`h-3 w-3 mr-1 ${/[0-9]/.test(password) ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  One number
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 text-xs"
              onClick={async () => {
                try {
                  const testEmail = `test${Date.now()}@example.com`;
                  const testUsername = `testuser${Date.now()}`;

                  toast({
                    title: 'Testing direct registration',
                    description: `Using ${testEmail} and ${testUsername}`,
                  });

                  const directResponse = await fetch('http://localhost:8004/api/auth/register/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      username: testUsername,
                      email: testEmail,
                      password: 'Password123',
                      first_name: 'Test',
                      last_name: 'User'
                    })
                  });

                  if (directResponse.ok) {
                    const directData = await directResponse.json();
                    console.log('Manual direct registration test successful:', directData);
                    toast({
                      title: 'Direct registration successful',
                      description: `Created user ${testUsername}`,
                    });
                  } else {
                    const errorData = await directResponse.json();
                    console.error('Manual direct registration test failed:', errorData);
                    toast({
                      title: 'Direct registration failed',
                      description: errorData.detail || JSON.stringify(errorData),
                      variant: 'destructive',
                    });
                  }
                } catch (regError) {
                  console.error('Manual direct registration test error:', regError);
                  toast({
                    title: 'Direct registration error',
                    description: regError instanceof Error ? regError.message : 'Unknown error',
                    variant: 'destructive',
                  });
                }
              }}
            >
              Test Direct Registration
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-emerald-100 dark:border-emerald-800/30 p-4">
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-950/20"
        >
          <Link to="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
