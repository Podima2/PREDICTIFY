import React from 'react';
import { Video, Search, TrendingUp, Brain, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: 'home' | 'discover' | 'upload' | 'profile') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const features = [
    { icon: Video, text: 'TikTok-Style Videos', color: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
    { icon: Brain, text: 'AI Scouting Reports', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
    { icon: Search, text: 'Smart Discovery', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
    { icon: TrendingUp, text: 'Global Talent Pool', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8 animate-slide-up">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl text-sharp text-white leading-tight">
              Discover the Next
              <span className="block text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
                Generation of Athletes
              </span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
              AI-powered talent discovery platform combining TikTok-style highlight videos 
              with intelligent scouting reports for the future of sports recruitment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.text}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} rounded-full border backdrop-blur-sm animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onNavigate('discover')}
              className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-red-500/20 focus:outline-none"
            >
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-red-400/30 via-orange-400/30 to-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 rounded-[10px] transition-all duration-300"></div>
              </div>
              
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">DISCOVER TALENT</span>
            </button>
            
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-red-900/30 hover:border-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
            >
              <Video className="w-5 h-5" />
              <span>UPLOAD HIGHLIGHTS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 