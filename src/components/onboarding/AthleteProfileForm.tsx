import React, { useState } from 'react';
import { ArrowLeft, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserRegistry } from '../../hooks/useUserRegistry';
import { AthleteProfile } from '../../types';
import { AvatarUpload } from '../ui/AvatarUpload';
import { CustomSelect } from '../ui/CustomSelect';

interface AthleteProfileFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AthleteProfileForm: React.FC<AthleteProfileFormProps> = ({ onSuccess, onBack }) => {
  const { registerAthlete, isLoading, error } = useUserRegistry();
  const [formData, setFormData] = useState<AthleteProfile>({
    name: '',
    age: 18,
    sport: 'Football',
    position: '',
    bio: '',
    avatar: ''
  });

  const sports = ['Football', 'Basketball', 'Tennis', 'Baseball', 'Hockey', 'Swimming', 'Track & Field'];
  const footballPositions = [
    'Goalkeeper', 'Center Back', 'Full Back', 'Defensive Midfielder', 
    'Central Midfielder', 'Attacking Midfielder', 'Winger', 'Striker'
  ];

  const sportOptions = sports.map(sport => ({
    value: sport,
    label: sport
  }));

  const positionOptions = formData.sport === 'Football' 
    ? footballPositions.map(position => ({
        value: position,
        label: position
      }))
    : [{ value: 'Player', label: 'Player' }];

  const handleInputChange = (field: keyof AthleteProfile, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await registerAthlete(formData);
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const isFormValid = formData.name && formData.position && formData.bio && formData.age >= 13 && formData.age <= 50;

  return (
    <div className="bg-neutral-950 border border-red-900/30 rounded-2xl p-8 animate-scale-in">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </button>
        <div>
          <h2 className="text-2xl text-sharp text-white">Create Athlete Profile</h2>
          <p className="text-neutral-400">Tell us about yourself to get started</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-red-300 font-medium">Registration Failed</p>
            <p className="text-red-400 text-sm break-words overflow-hidden">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <AvatarUpload
            currentAvatar={formData.avatar}
            onAvatarChange={handleAvatarChange}
            size="lg"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 font-medium focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Age *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
              min="13"
              max="50"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 font-medium focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Sport *
            </label>
            <CustomSelect
              value={formData.sport}
              onChange={(value) => handleInputChange('sport', value)}
              options={sportOptions}
              placeholder="Select your sport"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Position *
            </label>
            <CustomSelect
              value={formData.position}
              onChange={(value) => handleInputChange('position', value)}
              options={positionOptions}
              placeholder="Select your position"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Bio *
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell scouts about your playing style, achievements, and goals..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 resize-none font-medium focus:outline-none"
            rows={4}
            required
            disabled={isLoading}
          />
          <div className="text-xs text-neutral-500 mt-2">
            {formData.bio.length}/500 characters
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>What Happens Next</span>
          </h4>
          <ul className="text-blue-300 space-y-2 text-sm font-medium">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Your profile will be registered on the blockchain</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Upload highlight videos to showcase your talent</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Get AI-powered scouting reports</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Connect with scouts worldwide</span>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 tracking-wide"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Registering on Blockchain...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Register as Athlete</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};