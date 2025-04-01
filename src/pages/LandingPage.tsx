
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  FileUp, 
  ThumbsUp, 
  Bell, 
  Users, 
  Tag,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Where ideas meet collaboration
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join our community to discuss ideas, share projects, and collaborate with other passionate developers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button size="lg" className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600" asChild>
                  <Link to="/discussions">
                    Explore Discussions <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/projects">
                    Browse Projects <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600" asChild>
                  <Link to="/register">
                    Join the Community <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">
                    Log In
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rich Discussions</h3>
              <p className="text-muted-foreground">
                Create, comment and participate in meaningful discussions about any topic with markdown support.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-red-700/10 flex items-center justify-center mb-4">
                <FileUp className="h-6 w-6 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Project Sharing</h3>
              <p className="text-muted-foreground">
                Upload and share your code projects with the community and receive valuable feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-red-800/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-red-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Notifications</h3>
              <p className="text-muted-foreground">
                Get notified about mentions, replies, and activity on your discussions instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-16 w-16 rounded-full bg-red-600 text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up to join our community and get full access to all features.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-16 w-16 rounded-full bg-red-700 text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share or Discuss</h3>
              <p className="text-muted-foreground">
                Create new discussions, share projects, or participate in existing conversations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-16 w-16 rounded-full bg-red-800 text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-muted-foreground">
                Get feedback, connect with other developers, and improve your skills together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Tags</h2>
            <Button variant="ghost" asChild>
              <Link to="/tags">
                View all tags <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              to="/discussions?tag=React"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-500/10 mb-3">
                <Tag className="h-5 w-5 text-red-500" />
              </div>
              <span className="font-medium">React</span>
              <span className="text-xs text-muted-foreground">145 discussions</span>
            </Link>
            
            <Link
              to="/discussions?tag=Python"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-600/10 mb-3">
                <Tag className="h-5 w-5 text-red-600" />
              </div>
              <span className="font-medium">Python</span>
              <span className="text-xs text-muted-foreground">98 discussions</span>
            </Link>
            
            <Link
              to="/discussions?tag=DevOps"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-700/10 mb-3">
                <Tag className="h-5 w-5 text-red-700" />
              </div>
              <span className="font-medium">DevOps</span>
              <span className="text-xs text-muted-foreground">67 discussions</span>
            </Link>
            
            <Link
              to="/discussions?tag=UI/UX"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-800/10 mb-3">
                <Tag className="h-5 w-5 text-red-800" />
              </div>
              <span className="font-medium">UI/UX</span>
              <span className="text-xs text-muted-foreground">54 discussions</span>
            </Link>
            
            <Link
              to="/discussions?tag=JavaScript"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-500/10 mb-3">
                <Tag className="h-5 w-5 text-red-500" />
              </div>
              <span className="font-medium">JavaScript</span>
              <span className="text-xs text-muted-foreground">124 discussions</span>
            </Link>
            
            <Link
              to="/discussions?tag=Database"
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-red-700/10 mb-3">
                <Tag className="h-5 w-5 text-red-700" />
              </div>
              <span className="font-medium">Database</span>
              <span className="text-xs text-muted-foreground">36 discussions</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-red-800 to-red-600 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Discussion?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Become part of our growing community today and start connecting with other developers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/discussions/new">
                      Start a Discussion
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                    <Link to="/projects">
                      Share a Project
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/register">
                      Sign Up Now
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                    <Link to="/about">
                      Learn More
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
