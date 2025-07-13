import React, { useState, useEffect } from 'react';
import { UserRole, AthleteProfile, ScoutProfile } from '../../types';
import { RoleSelection } from './RoleSelection';
import { AthleteProfileForm } from './AthleteProfileForm';
import { ScoutProfileForm } from './ScoutProfileForm';
import { WelcomeScreen } from './WelcomeScreen';
import { useUserRegistry } from '../../hooks/useUserRegistry';

interface OnboardingPageProps {
  onComplete: (userRole: UserRole) => void;
}

type OnboardingStep = 'roleSelection' | 'athleteForm' | 'scoutForm' | 'welcome';

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('roleSelection');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.None);
  const { isOnboarded } = useUserRegistry();

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.Athlete) {
      setCurrentStep('athleteForm');
    } else if (role === UserRole.Scout) {
      setCurrentStep('scoutForm');
    }
  };

  const handleRegistrationSuccess = () => {
    setCurrentStep('welcome');
  };

  // Watch for onboarding completion and redirect
  useEffect(() => {
    console.log('🔍 OnboardingPage useEffect triggered:', { currentStep, isOnboarded, selectedRole });
    
    if (currentStep === 'welcome' && isOnboarded) {
      console.log('✅ User is onboarded and on welcome screen - redirect should happen via WelcomeScreen countdown');
    }
  }, [currentStep, isOnboarded, selectedRole]);

  const handleBackToRoleSelection = () => {
    setCurrentStep('roleSelection');
    setSelectedRole(UserRole.None);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {currentStep === 'roleSelection' && (
          <RoleSelection onRoleSelect={handleRoleSelection} />
        )}
        
        {currentStep === 'athleteForm' && (
          <AthleteProfileForm
            onSuccess={handleRegistrationSuccess}
            onBack={handleBackToRoleSelection}
          />
        )}
        
        {currentStep === 'scoutForm' && (
          <ScoutProfileForm
            onSuccess={handleRegistrationSuccess}
            onBack={handleBackToRoleSelection}
          />
        )}
        
        {currentStep === 'welcome' && (
          <WelcomeScreen userRole={selectedRole} onComplete={onComplete} />
        )}
      </div>
    </div>
  );
};