import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, User, Search, Loader2 } from 'lucide-react';
import { UserRole } from '../../types';
import { useUserRegistry } from '../../hooks/useUserRegistry';

interface WelcomeScreenProps {
  userRole: UserRole;
  onComplete?: (userRole: UserRole) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userRole, onComplete }) => {
  const isAthlete = userRole === UserRole.Athlete;
  const { isOnboarded, isLoading } = useUserRegistry();
  const [countdown, setCountdown] = useState(3);
  
  console.log('🎭 WelcomeScreen render:', { userRole, isOnboarded, isLoading, countdown });
  
  // Start countdown when onboarded
  useEffect(() => {
    if (isOnboarded && !isLoading) {
      console.log('⏰ Starting countdown timer...');
      const timer = setInterval(() => {
        setCountdown(prev => {
          console.log('⏰ Countdown:', prev);
          if (prev <= 1) {
            clearInterval(timer);
            console.log('🚀 Countdown finished - calling onComplete');
            if (onComplete) {
              onComplete(userRole);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOnboarded, isLoading, onComplete, userRole]);

  return (
    <div className="bg-neutral-950 border border-red-900/30 rounded-2xl p-8 text-center animate-scale-in">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
        
        <h1 className="text-3xl text-sharp text-white mb-4">
          Welcome to TalentFlow! 🎉
        </h1>
        
        <p className="text-neutral-300 text-lg font-medium max-w-md mx-auto">
          Your {isAthlete ? 'athlete' : 'scout'} profile has been successfully registered on the blockchain.
        </p>
      </div>

      <div className={`bg-gradient-to-r ${
        isAthlete 
          ? 'from-blue-950 to-indigo-950 border-blue-800' 
          : 'from-purple-950 to-pink-950 border-purple-800'
      } rounded-xl p-6 mb-8`}>
        <div className="flex items-center justify-center mb-4">
          {isAthlete ? (
            <User className="w-8 h-8 text-blue-400" />
          ) : (
            <Search className="w-8 h-8 text-purple-400" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-4">
          {isAthlete ? 'Ready to Showcase Your Talent!' : 'Ready to Discover Talent!'}
        </h3>
        
        <ul className={`${
          isAthlete ? 'text-blue-300' : 'text-purple-300'
        } space-y-2 text-sm font-medium`}>
          {isAthlete ? (
            <>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full`}></div>
                <span>Upload your first highlight video</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full`}></div>
                <span>Get AI-powered performance analysis</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full`}></div>
                <span>Connect with scouts worldwide</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-purple-400 rounded-full`}></div>
                <span>Browse TikTok-style talent videos</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-purple-400 rounded-full`}></div>
                <span>Access detailed AI scouting reports</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <div className={`w-1.5 h-1.5 bg-purple-400 rounded-full`}></div>
                <span>Discover the next generation of athletes</span>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="text-neutral-500 text-sm">
        {isLoading ? (
          <>
            <p className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Finalizing your registration...</span>
            </p>
          </>
        ) : isOnboarded ? (
          <>
            <p className="flex items-center justify-center space-x-2">
              <span>Redirecting you to the platform in</span>
              <span className="font-mono font-bold text-red-400 text-lg">{countdown}</span>
              <span>seconds...</span>
            </p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
          </>
        ) : (
          <p>Please wait while we complete your registration...</p>
        )}
      </div>
    </div>
  );
};