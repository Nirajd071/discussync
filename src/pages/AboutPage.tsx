
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Code, Lightbulb, Globe, ChevronRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">About DiscuSync</h1>
        
        <div className="space-y-8">
          <section>
            <p className="text-lg text-muted-foreground">
              DiscuSync is a community platform designed to bring developers, designers, and tech enthusiasts together to share knowledge, collaborate on projects, and build meaningful connections.
            </p>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                We believe in the power of community-driven knowledge sharing. Our mission is to create a space where professionals and enthusiasts can learn from each other, collaborate on innovative ideas, and grow together.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Our Community</h2>
              <p className="text-muted-foreground">
                DiscuSync brings together diverse professionals from various tech fields. From seasoned experts to curious beginners, our platform welcomes everyone who wants to engage in meaningful discussions and collaborative learning.
              </p>
            </div>
          </section>
          
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">What Sets Us Apart</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Technical Excellence</h3>
                <p className="text-muted-foreground">
                  Our platform is built by developers for developers, with features specifically designed to enhance technical discussions.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Quality Content</h3>
                <p className="text-muted-foreground">
                  We emphasize quality over quantity, with community moderation ensuring discussions remain focused and valuable.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Global Community</h3>
                <p className="text-muted-foreground">
                  Connect with professionals from around the world, sharing diverse perspectives and approaches to problem-solving.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mt-12 bg-gradient-to-r from-red-800 to-red-900 p-8 rounded-xl text-white">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              DiscuSync began in 2023 when a group of developers found themselves repeatedly facing the same challenges and realized the power of collaborative problem-solving. What started as a small forum has grown into a thriving community with thousands of active members.
            </p>
            <p>
              Today, we continue to evolve based on community feedback, constantly improving the platform to better serve the needs of our users.
            </p>
          </section>
          
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <span className="text-6xl">👩‍💻</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Alex Rivera</h3>
                  <p className="text-sm text-muted-foreground">Founder & Lead Developer</p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Jamie Chen</h3>
                  <p className="text-sm text-muted-foreground">UX Designer</p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <span className="text-6xl">👩‍💻</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Taylor Patel</h3>
                  <p className="text-sm text-muted-foreground">Community Manager</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-6">Join Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Ready to be part of a growing community of tech professionals? Start discussions, share your knowledge, and connect with like-minded individuals.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
