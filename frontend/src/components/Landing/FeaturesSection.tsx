import React from 'react';
import { MessageSquare, FileUp, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-red-600" />,
      title: "Rich Discussions",
      description: "Create, comment and participate in meaningful discussions about any topic with markdown support.",
      bgColor: "bg-red-100 dark:bg-red-500/10",
      delay: 0,
    },
    {
      icon: <FileUp className="h-6 w-6 text-red-600" />,
      title: "Project Sharing",
      description: "Upload and share your code projects with the community and receive valuable feedback.",
      bgColor: "bg-red-100 dark:bg-red-500/10",
      delay: 200,
    },
    {
      icon: <Bell className="h-6 w-6 text-red-600" />,
      title: "Real-time Notifications",
      description: "Get notified about mentions, replies, and activity on your discussions instantly.",
      bgColor: "bg-red-100 dark:bg-red-500/10",
      delay: 400,
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Key Features
          </h2>
          <p className="text-muted-foreground">
            Everything you need to connect, share, and grow with other developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-red-100 dark:border-red-950 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in opacity-0" 
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <CardContent className="pt-6">
                <div className={`h-12 w-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
