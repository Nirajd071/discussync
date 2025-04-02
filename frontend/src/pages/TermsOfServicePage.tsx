import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';

const TermsOfServicePage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: April 2, 2025
          </p>

          <div className="space-y-8">
            <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
              <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using DiscuSync, you agree to be bound by these Terms of Service and all applicable laws and regulations. If
                you do not agree with any of these terms, you are prohibited from using this platform.
              </p>
            </Card>

            <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
              <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">2. User Responsibilities</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  As a user of DiscuSync, you are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the security of your account</li>
                  <li>All content you post or share on the platform</li>
                  <li>Complying with all applicable laws and regulations</li>
                  <li>Respecting other users' intellectual property rights</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
              <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">3. Content Guidelines</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All content posted on DiscuSync must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be relevant to software development and technology</li>
                  <li>Not violate any intellectual property rights</li>
                  <li>Not contain harmful or malicious code</li>
                  <li>Not include offensive or inappropriate material</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-emerald-100 dark:border-emerald-800/30 shadow-lg dark:shadow-emerald-900/10">
              <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">4. Privacy and Data Protection</h2>
              <p className="text-muted-foreground">
                We take your privacy seriously. Our collection and use of personal information is governed by our Privacy Policy.
                By using DiscuSync, you consent to our data practices as described in the Privacy Policy.
              </p>
            </Card>

            <div className="p-6 border rounded-lg border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-950/20">
              <h2 className="text-xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact our support team at{' '}
                <a href="mailto:support@discusync.com" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                  support@discusync.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage; 