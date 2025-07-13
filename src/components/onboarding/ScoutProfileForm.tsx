import React, { useState } from 'react';
import { ArrowLeft, Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserRegistry } from '../../hooks/useUserRegistry';
import { ScoutProfile } from '../../types';
import { AvatarUpload } from '../ui/AvatarUpload';
import { CustomSelect } from '../ui/CustomSelect';

interface ScoutProfileFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const ScoutProfileForm: React.FC<ScoutProfileFormProps> = ({ onSuccess, onBack }) => {
  const { registerScout, isLoading, error } = useUserRegistry();
  const [formData, setFormData] = useState<ScoutProfile>({
    name: '',
    organization: '',
    position: '',
    avatar: ''
  });

  const organizationTypes = [
    'Professional Club',
    'Academy',
    'University',
    'National Team',
    'Youth Organization',
    'Independent Scout',
    'Sports Agency',
    'Other'
  ];

  const scoutPositions = [
    'Head Scout',
    'Regional Scout',
    'Youth Scout',
    'Performance Analyst',
    'Talent Coordinator',
    'Recruitment Manager',
    'Technical Director',
    'Other'
  ];

  const scoutPositionOptions = scoutPositions.map(position => ({
    value: position,
    label: position
  }));

  const handleInputChange = (field: keyof ScoutProfile, value: string) => {
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
      await registerScout(formData);
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const isFormValid = formData.name && formData.organization && formData.position;

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
          <h2 className="text-2xl text-sharp text-white">Create Scout Profile</h2>
          <p className="text-neutral-400">Tell us about your scouting background</p>
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

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 font-medium focus:outline-none"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Organization *
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            placeholder="e.g., Manchester United, Barcelona Academy, etc."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 font-medium focus:outline-none"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3">
            Position/Role *
          </label>
          <CustomSelect
            value={formData.position}
            onChange={(value) => handleInputChange('position', value)}
            options={scoutPositionOptions}
            placeholder="Select your position"
            required
          />
        </div>

        <div className="bg-gradient-to-r from-purple-950 to-pink-950 border border-purple-800 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>What Happens Next</span>
          </h4>
          <ul className="text-purple-300 space-y-2 text-sm font-medium">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Your profile will be registered on the blockchain</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Browse TikTok-style talent videos</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Access AI-powered scouting reports</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Connect with talented athletes worldwide</span>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 tracking-wide"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Registering on Blockchain...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Register as Scout</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};