import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Users, Tag as TagIcon, Github, ChevronRight, Code, Shield, Globe } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';

const AboutPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
      title: "Rich Discussions",
      description: "Create and participate in meaningful discussions with markdown support, real-time updates, and code highlighting."
    },
    {
      icon: <Code className="h-6 w-6 text-emerald-600" />,
      title: "Project Sharing",
      description: "Share your projects, get feedback, and collaborate with other developers in a supportive environment."
    },
    {
      icon: <TagIcon className="h-6 w-6 text-emerald-600" />,
      title: "Smart Tagging",
      description: "Organize content with our intelligent tagging system that helps you find relevant discussions and projects."
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      title: "Community Focus",
      description: "Connect with developers worldwide, share knowledge, and grow together in a supportive environment."
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Secure Platform",
      description: "Built with security in mind, ensuring your data and discussions are protected with modern security practices."
    },
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: "Global Reach",
      description: "Join a diverse community of developers from around the world, sharing knowledge and experiences."
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            About DiscuSync
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            DiscuSync is a modern platform designed for developers to share projects, engage in meaningful discussions,
            and build a collaborative community. Our mission is to create a space where developers can connect,
            learn, and grow together in a secure and supportive environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              asChild
            >
              <Link to="/register">
                Join the Community <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
              asChild
            >
              <Link to="/discussions">
                Browse Discussions <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-emerald-100 dark:border-emerald-800/30 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                  {feature.icon}
              </div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-900 dark:text-emerald-100">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden mb-16">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid-flow" />
          
          <div className="relative text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg mb-0 max-w-2xl mx-auto">
              To foster a vibrant developer community where knowledge sharing, collaboration,
              and meaningful discussions lead to better software and stronger connections.
              We believe in creating a platform that empowers developers to learn, grow,
              and contribute to the global tech community.
            </p>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Active Users", value: "10,000+" },
            { label: "Discussions", value: "50,000+" },
            { label: "Projects", value: "5,000+" },
            { label: "Daily Posts", value: "1,000+" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-6 border-emerald-100 dark:border-emerald-800/30">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
