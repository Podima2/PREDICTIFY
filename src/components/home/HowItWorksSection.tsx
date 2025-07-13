import React from 'react';
import { Video, Brain, Search } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Video,
      title: 'Upload Highlights',
      description: 'Athletes upload short highlight videos showcasing their best skills and performances.',
      color: 'from-red-900 to-red-800 border-red-700'
    },
    {
      step: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI generates comprehensive scouting reports with ratings and insights.',
      color: 'from-blue-900 to-indigo-900 border-blue-800'
    },
    {
      step: '03',
      icon: Search,
      title: 'Scout Discovery',
      description: 'Scouts discover talent through personalized feeds and connect directly with athletes.',
      color: 'from-purple-900 to-pink-900 border-purple-800'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl text-sharp text-white mb-4">How It Works</h2>
        <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
          Three simple steps to revolutionize talent discovery and scouting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={step.step}
            className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-4 right-4 text-6xl font-black text-white/10">
              {step.step}
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-white/80 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 