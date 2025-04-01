
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Terms of Service</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing or using DiscuSync, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding the password you use to access the platform and for any activities or actions under your password.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Content</h2>
            <p>
              Our platform allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post and its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the platform.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Prohibited Uses</h2>
            <p>You agree not to use the platform:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior consent</li>
              <li>To impersonate or attempt to impersonate another user or person</li>
              <li>In any way that infringes upon the rights of others</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the platform</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p>
              The platform and its original content, features, and functionality are and will remain the exclusive property of DiscuSync and its licensors. The platform is protected by copyright, trademark, and other laws.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Limitation of Liability</h2>
            <p>
              In no event shall DiscuSync, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@discussync.com.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
