import React, { useState } from 'react';
import { useUserRegistry } from './hooks/useUserRegistry';
import { useWallet } from './hooks/useWallet';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { UserRole } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { DiscoverPage } from './components/pages/DiscoverPage';
import UploadPage from './components/pages/UploadPage';
import { ProfilePage } from './components/pages/ProfilePage';

type Page = 'home' | 'discover' | 'upload' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isConnected } = useWallet();
  const { userRole, isOnboarded, isLoading } = useUserRegistry();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleOnboardingComplete = (role: UserRole) => {
    // Onboarding completion is handled by the useUserRegistry hook
    // The hook will automatically update isOnboarded state after successful registration
    console.log('🎉 App: Onboarding completed for role:', role);
    console.log('🎉 App: Current state - isConnected:', isConnected, 'isOnboarded:', isOnboarded);
  };

  // Show loading state while checking registration status
  if (isConnected && isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Checking registration status...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if user is connected but not onboarded
  if (isConnected && !isOnboarded) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'discover' && (
        <DiscoverPage />
      )}
      
      {currentPage === 'upload' && (
        <UploadPage />
      )}
      
      {currentPage === 'profile' && (
        <ProfilePage />
      )}
      
      <Footer />
    </div>
  );
}

export default App;