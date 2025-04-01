
import React from 'react';
import { MessageSquare, FileUp, Bell } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-red-500" />,
      title: "Rich Discussions",
      description: "Create, comment and participate in meaningful discussions about any topic with markdown support.",
      bgColor: "bg-red-500/10",
    },
    {
      icon: <FileUp className="h-6 w-6 text-red-700" />,
      title: "Project Sharing",
      description: "Upload and share your code projects with the community and receive valuable feedback.",
      bgColor: "bg-red-700/10",
    },
    {
      icon: <Bell className="h-6 w-6 text-red-800" />,
      title: "Real-time Notifications",
      description: "Get notified about mentions, replies, and activity on your discussions instantly.",
      bgColor: "bg-red-800/10",
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className={`h-12 w-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
