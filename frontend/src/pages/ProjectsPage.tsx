import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { FileUp, ThumbsUp, MessageSquare, Filter, Search, Upload } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

const ProjectsPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Browse and download projects shared by our community members.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload Project
            </Button>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-10 border-emerald-200 dark:border-emerald-800/30 focus-visible:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
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
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">Django REST Framework API Boilerplate</CardTitle>
              <CardDescription className="mt-2">
                A comprehensive boilerplate for Django REST Framework APIs with authentication, permissions, and documentation. Includes Docker setup for easy deployment and development.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 rounded-md p-3">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="text-sm">django-rest-boilerplate.zip</span>
                </div>
                <span className="text-xs text-muted-foreground">1.5 MB</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1 text-emerald-600" /> 32
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1 text-emerald-600" /> 1
                </span>
              </div>
              <Button size="sm" variant="outline" className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20">
                Download
              </Button>
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
