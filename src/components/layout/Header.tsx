import React from 'react';
import { Home, Trophy, Target, User, Zap } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { WalletButton } from '../wallet/WalletButton';

interface HeaderProps {
  currentPage: 'home' | 'predictions' | 'leaderboard' | 'profile';
  onNavigate: (page: 'home' | 'predictions' | 'leaderboard' | 'profile') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl">
                <Logo size="md" variant="white" />
              </div>
              <div>
                <h1 className="text-xl brand-text text-white">PREDICTIFY</h1>
                <p className="brand-subtitle text-red-400">FOOTBALL PROPHET CHAIN</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1 bg-neutral-950 border border-red-900/30 rounded-xl p-1">
              <button
                onClick={() => onNavigate('home')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'home'
                    ? 'bg-red-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-red-900/20 hover:scale-[1.01]'
                }`}
              >
                <Home className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'home' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">HOME</span>
                {currentPage === 'home' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => onNavigate('predictions')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'predictions'
                    ? 'bg-red-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-red-900/20 hover:scale-[1.01]'
                }`}
              >
                <Target className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'predictions' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">PREDICT</span>
                {currentPage === 'predictions' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => onNavigate('leaderboard')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'leaderboard'
                    ? 'bg-red-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-red-900/20 hover:scale-[1.01]'
                }`}
              >
                <Trophy className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'leaderboard' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">PROPHETS</span>
                {currentPage === 'leaderboard' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              
              <button
                onClick={() => onNavigate('profile')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'profile'
                    ? 'bg-red-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-red-900/20 hover:scale-[1.01]'
                }`}
              >
                <User className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'profile' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">PROFILE</span>
                {currentPage === 'profile' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl animate-pulse" />
                )}
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};