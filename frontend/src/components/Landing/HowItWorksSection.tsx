
import React from 'react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up to join our community and get full access to all features.",
      bgColor: "bg-red-600",
    },
    {
      number: 2,
      title: "Share or Discuss",
      description: "Create new discussions, share projects, or participate in existing conversations.",
      bgColor: "bg-red-700",
    },
    {
      number: 3,
      title: "Collaborate",
      description: "Get feedback, connect with other developers, and improve your skills together.",
      bgColor: "bg-red-800",
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <div className={`h-16 w-16 rounded-full ${step.bgColor} text-white flex items-center justify-center mb-4`}>
                <span className="text-xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
