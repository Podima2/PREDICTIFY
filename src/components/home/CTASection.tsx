import React from 'react';
import { Video, Search, Award } from 'lucide-react';

interface CTASectionProps {
  onNavigate: (page: 'home' | 'discover' | 'upload' | 'profile') => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-red-900/30 rounded-2xl p-8 text-center animate-slide-up">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl">
             <Award className="w-8 h-8 text-white" />
            </div>
           <h2 className="text-3xl text-sharp text-white">Join TalentFlow</h2>
          </div>
          
          <p className="text-xl text-neutral-300 leading-relaxed font-medium">
           Whether you're an athlete showcasing talent or a scout discovering the next generation, 
           TalentFlow connects you with the future of sports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
             onClick={() => onNavigate('upload')}
              className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-red-500/20 focus:outline-none"
            >
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-red-400/30 via-orange-400/30 to-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 rounded-[10px] transition-all duration-300"></div>
              </div>
              
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
             <Video className="w-4 h-4 relative z-10" />
             <span className="relative z-10">UPLOAD HIGHLIGHTS</span>
            </button>
            
            <button
             onClick={() => onNavigate('discover')}
              className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-red-900/30 hover:border-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
            >
             <Search className="w-4 h-4" />
             <span>DISCOVER TALENT</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
             <span className="font-semibold tracking-wide">AI-POWERED ANALYSIS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
             <span className="font-semibold tracking-wide">TIKTOK-STYLE VIDEOS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
             <span className="font-semibold tracking-wide">GLOBAL TALENT POOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 