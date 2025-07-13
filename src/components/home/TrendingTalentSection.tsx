import React from 'react';
import { ArrowRight, Star, Video, Brain } from 'lucide-react';

interface TrendingTalentSectionProps {
  onNavigate: (page: 'home' | 'discover' | 'upload' | 'profile') => void;
}

export const TrendingTalentSection: React.FC<TrendingTalentSectionProps> = ({ onNavigate }) => {
  const trendingAthletes = [
    {
      athlete: 'Marcus Silva',
      position: 'Attacking Midfielder',
      highlight: 'Incredible solo goal vs rivals - beat 4 defenders and curled shot into top corner',
      location: 'São Paulo, Brazil',
      time: '2h ago',
      views: 15420,
      rating: 87
    },
    {
      athlete: 'Emma Thompson',
      position: 'Center Back',
      highlight: 'Defensive masterclass - perfect timing on tackles and aerial duels throughout match',
      location: 'Manchester, England',
      time: '4h ago',
      views: 8930,
      rating: 85
    },
    {
      athlete: 'Kai Nakamura',
      position: 'Goalkeeper',
      highlight: 'Series of world-class saves including penalty stop - incredible reflexes on display',
      location: 'Tokyo, Japan',
      time: '6h ago',
      views: 12650,
      rating: 89
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12 animate-slide-up">
        <div>
          <h2 className="text-3xl text-sharp text-white mb-4">Trending Talent</h2>
          <p className="text-neutral-400 font-medium">
            Rising stars catching scouts' attention
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('discover')}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-semibold text-sm tracking-wide hover:scale-105 active:scale-95"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trendingAthletes.map((athlete, index) => (
          <div
            key={athlete.athlete}
            className="bg-neutral-950 border border-red-900/30 rounded-2xl p-6 hover:bg-neutral-900 hover:border-red-700 transition-all duration-300 animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {athlete.athlete.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold">{athlete.athlete}</div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 text-xs font-bold">{athlete.position}</span>
                  </div>
                </div>
              </div>
              <div className="text-neutral-400 text-sm">{athlete.time}</div>
            </div>

            <div className="mb-4">
              <div className="text-neutral-400 text-sm mb-2">{athlete.location}</div>
              <p className="text-white leading-relaxed">{athlete.highlight}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-red-900/30">
              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <div className="flex items-center space-x-1">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>{athlete.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-green-400" />
                  <span>AI Rating: {athlete.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 