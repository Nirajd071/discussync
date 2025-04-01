
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const GuidelinesPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Community Guidelines</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <p>
            At DiscuSync, we're committed to fostering a welcoming and collaborative environment. These guidelines help ensure our community remains respectful, productive, and safe for everyone.
          </p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Be Respectful</h2>
            <p>
              Treat others with respect and kindness. Disagreements are natural, but always focus on the ideas being discussed, not the individuals expressing them. Avoid personal attacks, harassment, or discriminatory language.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Stay On Topic</h2>
            <p>
              Keep discussions relevant to the topic at hand. If you want to discuss something unrelated, create a new discussion with appropriate tags. This helps keep conversations organized and makes it easier for others to find relevant information.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Share Knowledge</h2>
            <p>
              DiscuSync thrives when members share their expertise. If you have relevant knowledge or experience, contribute to discussions. When asking questions, provide context and be specific to help others provide useful answers.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Quality Content</h2>
            <p>
              Take the time to create thoughtful, well-written posts. Check for clarity, grammar, and spelling. Use appropriate formatting like headings, lists, and code blocks to make your content more readable.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Constructive Feedback</h2>
            <p>
              When providing feedback, be constructive and specific. Explain your reasoning and offer alternatives or solutions. Remember that the goal is to help others improve, not to criticize.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">No Spam or Self-Promotion</h2>
            <p>
              Don't post content solely for promotional purposes. While sharing relevant resources is encouraged, excessive self-promotion or posting unrelated links will be considered spam and may be removed.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Respect Privacy</h2>
            <p>
              Do not share personal information about yourself or others without consent. This includes contact details, location information, or any identifying data that could compromise someone's privacy or safety.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Appropriate Content</h2>
            <p>
              Do not post offensive, explicit, or inappropriate content. This includes but is not limited to: hate speech, violent content, adult or sexually explicit material, and graphic images.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
            <p>
              Respect intellectual property rights. When sharing code, articles, or other content created by others, provide proper attribution and links to the original source. Do not share pirated software or content that infringes on copyrights.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Report Violations</h2>
            <p>
              If you encounter content that violates these guidelines, please report it to the moderators. We rely on community members to help maintain a positive environment for everyone.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Consequences</h2>
            <p>
              Violations of these guidelines may result in content removal, warnings, temporary suspension, or permanent banning, depending on the severity and frequency of the violations. Moderators have the final say in enforcing these guidelines.
            </p>
          </section>
          
          <div className="mt-8 p-6 border border-red-500/20 rounded-lg bg-red-500/5">
            <p className="font-semibold text-foreground mb-2">Questions about these guidelines?</p>
            <p>
              If you have any questions or need clarification about these guidelines, please contact our moderation team at moderators@discussync.com.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GuidelinesPage;
