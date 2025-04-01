
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';

const ProjectsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <p className="text-muted-foreground mb-8">
          Browse and download projects shared by our community members.
        </p>

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
              A comprehensive boilerplate for Django REST Framework APIs with authentication, permissions, and documentation. Includes Docker setup for easy deployment and development.
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
              A starter kit for building microservices with FastAPI. Includes authentication, database integration, and API documentation. Perfect for creating robust backend services.
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
    </MainLayout>
  );
};

export default ProjectsPage;
