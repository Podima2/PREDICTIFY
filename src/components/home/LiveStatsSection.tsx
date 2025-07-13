import React from 'react';
import { Video, Users, Search, Brain } from 'lucide-react';

export const LiveStatsSection: React.FC = () => {
  const stats = [
    {
      icon: Video,
      title: 'Talent Videos',
      value: '45,230',
      subtitle: 'Uploaded this month',
      color: 'from-blue-900 to-indigo-900 border-blue-800',
      iconColor: 'text-blue-300',
      valueColor: 'text-blue-400'
    },
    {
      icon: Users,
      title: 'Active Athletes',
      value: '8,940',
      subtitle: 'Showcasing talent',
      color: 'from-purple-900 to-pink-900 border-purple-800',
      iconColor: 'text-purple-300',
      valueColor: 'text-purple-400'
    },
    {
      icon: Search,
      title: 'Scout Discoveries',
      value: '2,156',
      subtitle: 'This week',
      color: 'from-orange-900 to-red-900 border-orange-800',
      iconColor: 'text-orange-300',
      valueColor: 'text-orange-400'
    },
    {
      icon: Brain,
      title: 'AI Reports Generated',
      value: '12,847',
      subtitle: 'Scouting insights',
      color: 'from-green-900 to-emerald-900 border-green-800',
      iconColor: 'text-green-300',
      valueColor: 'text-green-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12 animate-slide-up">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h2 className="text-3xl text-sharp text-white">Live Prophet Stats</h2>
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-950 border border-red-800 rounded-full">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-400 font-bold tracking-wide">LIVE</span>
          </div>
        </div>
        <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
          Real-time insights from our talent discovery ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
              <div className={`text-3xl font-mono font-bold ${stat.valueColor} transition-all duration-500`}>
                {stat.value}
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">{stat.title}</h3>
              <p className={`${stat.iconColor} text-sm font-medium opacity-80`}>
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 