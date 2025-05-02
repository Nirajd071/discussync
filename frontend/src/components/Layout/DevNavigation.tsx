import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DevNavigation: React.FC = () => {
  return (
    <Card className="mb-8 border-emerald-100 dark:border-emerald-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-700 dark:text-emerald-400">Developer Tools</CardTitle>
        <CardDescription>
          Navigation links for development and testing
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
          <Link to="/api-test">API Tests</Link>
        </Button>
        <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
          <Link to="/discussions">Discussions</Link>
        </Button>
        <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
          <Link to="/register">Register</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DevNavigation;
