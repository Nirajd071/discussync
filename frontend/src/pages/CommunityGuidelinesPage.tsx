import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Shield, MessageSquare, Users, AlertTriangle } from 'lucide-react';

const CommunityGuidelinesPage = () => {
  const guidelines = [
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Be Respectful",
      description: "Treat others with respect and kindness. Disagreements are natural, but always focus on the ideas being discussed, not the people discussing them."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
      title: "Keep Discussions Constructive",
      description: "Contribute meaningfully to discussions. Share your knowledge and experience while remaining open to different perspectives."
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      title: "Foster Collaboration",
      description: "Help create a welcoming environment for all members. Encourage learning and support fellow developers in their journey."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-emerald-600" />,
      title: "Report Violations",
      description: "If you see content that violates our guidelines, please report it. Help us maintain a safe and productive environment."
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Community Guidelines
          </h1>
          <p className="text-muted-foreground mb-8">
            At DiscuSync, we're committed to fostering a welcoming and collaborative environment. These guidelines help ensure our
            community remains respectful, productive, and safe for everyone.
          </p>

          <div className="grid gap-6">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="p-6 border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                    {guideline.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-emerald-900 dark:text-emerald-100">{guideline.title}</h2>
                    <p className="text-muted-foreground">{guideline.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 border rounded-lg border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-950/20">
            <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">Enforcement</h2>
            <p className="text-muted-foreground">
              Violations of these guidelines may result in content removal, temporary suspension, or permanent account termination,
              depending on the severity and frequency of the violations. We strive to be fair and consistent in our enforcement
              while maintaining the quality and safety of our community.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityGuidelinesPage; 