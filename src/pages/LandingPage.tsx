
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import HowItWorksSection from '@/components/Landing/HowItWorksSection';
import PopularTagsSection from '@/components/Landing/PopularTagsSection';
import CtaSection from '@/components/Landing/CtaSection';

const LandingPage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PopularTagsSection />
      <CtaSection />
    </MainLayout>
  );
};

export default LandingPage;
