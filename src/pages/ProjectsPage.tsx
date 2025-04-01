
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { FileUp, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProjectsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Browse and download projects shared by our community members.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <span>Upload Project</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Developer</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
              </div>
              <CardTitle className="text-xl">Django REST Framework API Boilerplate</CardTitle>
              <CardDescription className="mt-2">
                A comprehensive boilerplate for Django REST Framework APIs with authentication, permissions, and documentation. Includes Docker setup for easy deployment and development.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between bg-muted/30 rounded-md p-3">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">django-rest-boilerplate.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">1.5 MB</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" /> 32
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> 1
                </span>
              </div>
              <Button size="sm" variant="outline">Download</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Jane Doe</div>
                  <div className="text-xs text-muted-foreground">about 2 years ago</div>
                </div>
              </div>
              <CardTitle className="text-xl">FastAPI Microservices Starter Kit</CardTitle>
              <CardDescription className="mt-2">
                A starter kit for building microservices with FastAPI. Includes authentication, database integration, and API documentation. Perfect for creating robust backend services.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between bg-muted/30 rounded-md p-3">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">fastapi-microservices.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">1.2 MB</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" /> 28
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> 1
                </span>
              </div>
              <Button size="sm" variant="outline">Download</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Michael Smith</div>
                  <div className="text-xs text-muted-foreground">about 1 year ago</div>
                </div>
              </div>
              <CardTitle className="text-xl">React Component Library</CardTitle>
              <CardDescription className="mt-2">
                A reusable React component library with TypeScript support, Storybook documentation, and comprehensive test coverage. Perfect for jumpstarting new projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between bg-muted/30 rounded-md p-3">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">react-component-lib.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">2.3 MB</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" /> 45
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> 3
                </span>
              </div>
              <Button size="sm" variant="outline">Download</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>ET</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Emma Thompson</div>
                  <div className="text-xs text-muted-foreground">about 8 months ago</div>
                </div>
              </div>
              <CardTitle className="text-xl">Next.js E-commerce Starter</CardTitle>
              <CardDescription className="mt-2">
                A complete e-commerce starter kit built with Next.js, including cart functionality, product filtering, and Stripe payment integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between bg-muted/30 rounded-md p-3">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">nextjs-ecommerce.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">3.7 MB</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" /> 56
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> 7
                </span>
              </div>
              <Button size="sm" variant="outline">Download</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectsPage;
