
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Upload, Users, ChevronRight, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            A community for developers<br />
            to discuss and collaborate
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of developers sharing knowledge, solving problems, and building 
            projects together
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Start Exploring <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Create Discussion
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to collaborate</h2>
          <p className="text-center text-muted-foreground mb-12">
            A complete platform for technical discussions, knowledge sharing, and project collaboration
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discussions & Comments</h3>
              <p className="text-muted-foreground">
                Create and participate in discussions with other developers on any topic
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Sharing</h3>
              <p className="text-muted-foreground">
                Upload and share your projects to get feedback and collaborate with others
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with like-minded developers and build your professional network
              </p>
            </div>
          </div>
        </div>

        {/* Featured Discussions */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Discussions</h2>
            <Link to="/discussions" className="text-indigo-600 flex items-center hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">John Developer</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
                <div className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Backend</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best practices for Django and FastAPI integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                I'm working on a project that requires both Django for user authentication and FastAPI for high-performance APIs. What are some best practices for...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">Django</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">FastAPI</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">APIs</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">Architecture</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">👍 24</span>
                <span className="flex items-center">💬 2</span>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">Jane Doe</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
                <div className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Frontend</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">React vs. Vue.js for frontend development</h3>
              <p className="text-sm text-muted-foreground mb-4">
                I'm starting a new project and trying to decide between React and Vue.js for the frontend. What are the pros and cons of each in 2023? Has anyone...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">React</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">Vue.js</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">JavaScript</span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">Frontend</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">👍 18</span>
                <span className="flex items-center">💬 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Link to="/projects" className="text-indigo-600 flex items-center hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">John Developer</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Django REST Framework API Boilerplate</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A comprehensive boilerplate for Django REST Framework APIs with authentication, permissions, and documentation. Includes Docker setup for...
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                  <span className="text-sm">django-rest-boilerplate.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">1.5 MB</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex items-center mr-4">👍 32</span>
                  <span className="flex items-center">💬 1</span>
                </div>
                <Button size="sm" variant="outline">Download</Button>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">Jane Doe</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">FastAPI Microservices Starter Kit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A starter kit for building microservices with FastAPI. Includes authentication, database integration, and API documentation.
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                  <span className="text-sm">fastapi-microservices.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">1.2 MB</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex items-center mr-4">👍 28</span>
                  <span className="flex items-center">💬 1</span>
                </div>
                <Button size="sm" variant="outline">Download</Button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center border-t pt-16 pb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to join the discussion?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start a discussion, upload your project, or join the conversation today.
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Get Started
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
