import React from 'react';
import { CustomSelect } from '../ui/CustomSelect';

interface VideoDetailsStepProps {
  formData: {
    title: string;
    description: string;
    sport: string;
    position: string;
    skillsShowcased: string[];
    tags: string[];
    opponent: string;
    gameDate: string;
    competition: string;
    result: string;
  };
  onInputChange: (field: string, value: any) => void;
  onToggleSkill: (skill: string) => void;
  onToggleTag: (tag: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const VideoDetailsStep: React.FC<VideoDetailsStepProps> = ({
  formData,
  onInputChange,
  onToggleSkill,
  onToggleTag,
  onPrev,
  onNext
}) => {
  const sportOptions = [
    { value: 'Soccer', label: 'Soccer' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Tennis', label: 'Tennis' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Hockey', label: 'Hockey' },
    { value: 'Football', label: 'Football' },
    { value: 'Volleyball', label: 'Volleyball' },
    { value: 'Rugby', label: 'Rugby' },
    { value: 'Cricket', label: 'Cricket' }
  ];
  
  const positionOptions = [
    { value: '', label: 'Select Position' },
    { value: 'Goalkeeper', label: 'Goalkeeper' },
    { value: 'Center Back', label: 'Center Back' },
    { value: 'Full Back', label: 'Full Back' },
    { value: 'Defensive Midfielder', label: 'Defensive Midfielder' },
    { value: 'Central Midfielder', label: 'Central Midfielder' },
    { value: 'Attacking Midfielder', label: 'Attacking Midfielder' },
    { value: 'Winger', label: 'Winger' },
    { value: 'Striker', label: 'Striker' }
  ];

  const availableSkills = ['Dribbling', 'Shooting', 'Passing', 'Defending', 'Heading', 'Ball Control', 'Speed', 'Agility', 'Leadership', 'Positioning', 'Vision', 'Tackling'];

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl text-sharp text-white mb-6">Video Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Video Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., Amazing Solo Goal vs Rivals"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Sport *
          </label>
          <CustomSelect
            value={formData.sport}
            onChange={(value) => onInputChange('sport', value)}
            options={sportOptions}
            placeholder="Select sport"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Position
          </label>
          <CustomSelect
            value={formData.position}
            onChange={(value) => onInputChange('position', value)}
            options={positionOptions}
            placeholder="Select position"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Opponent
          </label>
          <input
            type="text"
            value={formData.opponent}
            onChange={(e) => onInputChange('opponent', e.target.value)}
            placeholder="e.g., Manchester United"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Game Date
          </label>
          <input
            type="date"
            value={formData.gameDate}
            onChange={(e) => onInputChange('gameDate', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Competition
          </label>
          <input
            type="text"
            value={formData.competition}
            onChange={(e) => onInputChange('competition', e.target.value)}
            placeholder="e.g., Premier League"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-3">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe what happens in this highlight video..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 resize-none font-medium"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-3">
          Skills Showcased
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleSkill(skill)}
              className={`p-3 rounded-xl border transition-all duration-200 font-medium ${
                formData.skillsShowcased.includes(skill)
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-red-600 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.title || !formData.description}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}; 