
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Find answers to the most common questions about using DiscuSync. If you can't find what you're looking for, please contact our support team.
          </p>
          
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How do I create an account?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  To create an account, click on the "Sign up" button in the top right corner of the page. Fill out the registration form with your name, email address, and password. Once submitted, you'll receive a verification email to confirm your account.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How do I start a new discussion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  After logging in, navigate to the "Discussions" page and click on the "New Discussion" button. Enter a title, content, and select relevant tags for your discussion. You can use markdown formatting for the content and attach files if needed.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How do tags work on DiscuSync?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Tags help organize discussions by topic. When creating a discussion, you can add relevant tags to make it easier for others to find. You can also browse discussions by tag by clicking on a tag name or visiting the Tags page to see a list of all available tags.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                Can I upload files to my discussions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Yes, you can upload files up to 50MB when creating or commenting on a discussion. Supported file types include images, PDFs, documents, and code files. Simply use the file upload button when composing your content.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How do notifications work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  You'll receive notifications when someone replies to your discussions, mentions you in a comment, or upvotes your content. You can view your notifications by clicking the bell icon in the header. You can also adjust notification settings in your profile.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How can I change my password or update my profile?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  To update your profile or change your password, click on your avatar in the top right corner and select "Profile" from the dropdown menu. From your profile page, you can edit your information, change your avatar, and update your password.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                What is the upvote system?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  The upvote system allows users to indicate useful or insightful discussions and comments. When you find content valuable, you can click the upvote button. Popular content with many upvotes may be featured more prominently on the platform.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                Can I delete a discussion or comment I've posted?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Yes, you can delete your own discussions and comments. Navigate to the content you want to delete, click on the menu icon (three dots), and select "Delete". Note that once deleted, the content cannot be recovered.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How can I report inappropriate content?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  If you encounter content that violates our Community Guidelines, you can report it by clicking the menu icon (three dots) on the discussion or comment and selecting "Report". Please provide details about why you're reporting the content.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-medium text-foreground">
                How can I contact support?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  For any issues or questions not covered in the FAQ, you can contact our support team at support@discussync.com. We aim to respond to all inquiries within 24 hours.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
};

export default FaqPage;
