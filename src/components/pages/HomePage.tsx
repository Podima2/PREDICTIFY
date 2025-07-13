import React from 'react';
import {
  HeroSection,
  HowItWorksSection,
  LiveStatsSection,
  TrendingTalentSection,
  CTASection
} from '../home';

interface HomePageProps {
  onNavigate: (page: 'home' | 'discover' | 'upload' | 'profile') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection onNavigate={onNavigate} />

      <HowItWorksSection />
      <LiveStatsSection />
      <TrendingTalentSection onNavigate={onNavigate} />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
};