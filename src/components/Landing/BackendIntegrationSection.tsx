
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BackendIntegrationSection = () => {
  const backendFeatures = [
    {
      title: "Django REST Framework",
      description: "Powerful and flexible toolkit for building Web APIs with Django",
      color: "bg-green-100 dark:bg-green-950",
      textColor: "text-green-700 dark:text-green-300",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "FastAPI Microservices",
      description: "High-performance async API with automatic interactive documentation",
      color: "bg-blue-100 dark:bg-blue-950",
      textColor: "text-blue-700 dark:text-blue-300",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "PostgreSQL Database",
      description: "Advanced open source database with JSON support and powerful extensions",
      color: "bg-indigo-100 dark:bg-indigo-950",
      textColor: "text-indigo-700 dark:text-indigo-300",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Backend Integration</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform is built with a modern, scalable backend architecture that powers all the features you love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {backendFeatures.map((feature, index) => (
            <Card key={index} className={`border ${feature.borderColor}`}>
              <CardHeader className={`${feature.color} rounded-t-lg`}>
                <CardTitle className={`${feature.textColor}`}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription>{feature.description}</CardDescription>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>RESTful API endpoints</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>JWT Authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>File uploads & storage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-background border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Backend API Integration</h3>
          <p className="mb-4">Connect your frontend to the backend services using the following environment variable:</p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>VITE_API_BASE_URL=http://localhost:8000/api</code>
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            Make sure your Django/FastAPI backend is running and properly configured with CORS to accept requests from your frontend application.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BackendIntegrationSection;
