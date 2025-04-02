import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mb-8">
            Find answers to the most common questions about using DiscuSync. If you can't find what you're looking for, please contact
            our support team.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="create-account">
              <AccordionTrigger className="text-lg font-semibold hover:text-emerald-600">
                How do I create an account?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                To create an account, click the "Sign up" button in the top right corner. Fill in your email,
                choose a password, and follow the verification steps. Once verified, you can start participating
                in discussions and sharing projects.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="start-discussion">
              <AccordionTrigger className="text-lg font-semibold hover:text-emerald-600">
                How do I start a new discussion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Navigate to the Discussions page and click the "New Discussion" button. Choose a title,
                write your content using markdown, add relevant tags, and submit. Your discussion will
                be visible to the community immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="share-project">
              <AccordionTrigger className="text-lg font-semibold hover:text-emerald-600">
                How can I share my project?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to the Projects section and click "Upload Project". You can share your code,
                add a description, and include documentation. Other members can then view, download,
                and provide feedback on your project.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications">
              <AccordionTrigger className="text-lg font-semibold hover:text-emerald-600">
                How do notifications work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You'll receive notifications when someone mentions you, replies to your discussions,
                or interacts with your projects. You can manage your notification preferences in
                your account settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage; 