import React from 'react';
import { Video } from 'lucide-react';

interface ReviewStepProps {
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
  selectedFile: File | null;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isUploading: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedFile,
  onPrev,
  onSubmit,
  isUploading
}) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl text-sharp text-white mb-6">Review & Upload</h2>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Video className="w-12 h-12 text-red-400" />
          <div>
            <h3 className="text-lg font-bold text-white">{formData.title}</h3>
            <p className="text-neutral-400">{selectedFile?.name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Sport:</span>
            <span className="text-white font-semibold ml-2">{formData.sport}</span>
          </div>
          <div>
            <span className="text-neutral-400">Position:</span>
            <span className="text-white font-semibold ml-2">{formData.position}</span>
          </div>
        </div>

        <div>
          <span className="text-neutral-400 text-sm">Description:</span>
          <p className="text-white mt-1">{formData.description}</p>
        </div>

        {formData.skillsShowcased.length > 0 && (
          <div>
            <span className="text-neutral-400 text-sm">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.skillsShowcased.map((skill) => (
                <span key={skill} className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.opponent && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-400">Opponent:</span>
              <span className="text-white font-semibold ml-2">{formData.opponent}</span>
            </div>
            <div>
              <span className="text-neutral-400">Competition:</span>
              <span className="text-white font-semibold ml-2">{formData.competition}</span>
            </div>
          </div>
        )}
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
            type="submit"
            disabled={isUploading}
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Upload & Mint Highlight
          </button>
      </div>
    </div>
  );
}; 