import React from 'react';
import { User, Search, Trophy, Target, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  return (
    <div className="bg-neutral-950 border border-red-900/30 rounded-2xl p-8 animate-scale-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl text-sharp text-white">Welcome to TalentFlow</h1>
        </div>
        <p className="text-neutral-400 text-lg font-medium max-w-md mx-auto">
          Choose your role to get started with AI-powered talent discovery
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Athlete Option */}
        <button
          onClick={() => onRoleSelect(UserRole.Athlete)}
          className="group relative bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800 hover:border-blue-600 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
        >
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">I'm an Athlete</h3>
            <p className="text-blue-300 mb-6 leading-relaxed">
              Showcase your talent through highlight videos and get discovered by scouts worldwide with AI-powered analysis.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-blue-300 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Upload highlight videos</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-300 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Get AI scouting reports</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-300 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Connect with scouts</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </button>

        {/* Scout Option */}
        <button
          onClick={() => onRoleSelect(UserRole.Scout)}
          className="group relative bg-gradient-to-br from-purple-950 to-pink-950 border border-purple-800 hover:border-purple-600 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
        >
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">I'm a Scout</h3>
            <p className="text-purple-300 mb-6 leading-relaxed">
              Discover the next generation of talent through TikTok-style videos and AI-powered insights.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-purple-300 text-sm">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Browse talent feeds</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-300 text-sm">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Access AI scouting reports</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-300 text-sm">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Connect with athletes</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-neutral-500 text-sm">
          Your role will be registered on the blockchain for transparency and security
        </p>
      </div>
    </div>
  );
};