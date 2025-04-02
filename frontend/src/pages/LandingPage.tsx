import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileCode, Bell, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';

const LandingPage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="absolute inset-0 bg-grid-emerald-500/[0.02] bg-[size:60px_60px] animate-[grid_20s_linear_infinite]" />
        <div className="container relative">
          <div className="text-center py-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-fade-in">
              Where ideas meet collaboration
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
              Join our community to discuss ideas, share projects, and collaborate with
              other passionate developers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in [animation-delay:400ms]">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group"
                asChild
              >
                <Link to="/register" className="flex items-center">
                  Join the Community
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                asChild
              >
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-lg dark:shadow-emerald-900/10 hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-900 dark:text-emerald-100">Rich Discussions</h3>
            <p className="text-muted-foreground">
              Create, comment and participate in meaningful discussions about any topic with markdown support.
            </p>
          </Card>

          <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-lg dark:shadow-emerald-900/10 hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <FileCode className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-900 dark:text-emerald-100">Project Sharing</h3>
            <p className="text-muted-foreground">
              Upload and share your code projects with the community and receive valuable feedback.
            </p>
          </Card>

          <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-lg dark:shadow-emerald-900/10 hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-emerald-900 dark:text-emerald-100">Real-time Notifications</h3>
            <p className="text-muted-foreground">
              Get notified about mentions, replies, and activity on your discussions instantly.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px] animate-[grid_20s_linear_infinite]" />
        <div className="container relative">
          <div className="py-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our growing community of developers and start sharing your ideas today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-gray-100 group"
              asChild
            >
              <Link to="/register" className="flex items-center">
                Join DiscuSync
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LandingPage;
