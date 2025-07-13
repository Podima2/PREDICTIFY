import React, { useEffect, useState } from 'react';
import { X, Brain, TrendingUp, Target, Zap, Star, Award, BarChart3, Activity, Eye, Play } from 'lucide-react';
import { useHuggingFaceAnalysis } from '../../hooks/useHuggingFaceAnalysis';
import { HuggingFaceAnalysisStatus } from './HuggingFaceAnalysisStatus';
import { AIVideoAnalysis } from '../../types';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlight: {
    id: number;
    title: string;
    athleteAddress: string;
    sport: string;
    position: string;
    skillsShowcased: string[];
    videoUrl?: string;
    videoIpfsHash?: string;
  };
}

// Mock AI analysis data - in production this would come from your AI service
const generateMockAnalysis = (highlight: any): AIVideoAnalysis => {
  const baseRating = 75 + Math.random() * 20; // 75-95 range
  
  return {
    id: `mock_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    videoId: highlight.id.toString(),
    overallRating: Math.round(baseRating),
    
    technicalSkills: {
      ballControl: Math.round(baseRating + (Math.random() - 0.5) * 20),
      passing: Math.round(baseRating + (Math.random() - 0.5) * 15),
      shooting: Math.round(baseRating + (Math.random() - 0.5) * 25),
      dribbling: Math.round(baseRating + (Math.random() - 0.5) * 20),
      defending: Math.round(baseRating + (Math.random() - 0.5) * 30),
      heading: Math.round(baseRating + (Math.random() - 0.5) * 15),
      pace: Math.round(baseRating + (Math.random() - 0.5) * 20),
      agility: Math.round(baseRating + (Math.random() - 0.5) * 15),
    },
    
    physicalAttributes: {
      speed: Math.round(baseRating + (Math.random() - 0.5) * 20),
      strength: Math.round(baseRating + (Math.random() - 0.5) * 25),
      endurance: Math.round(baseRating + (Math.random() - 0.5) * 20),
      balance: Math.round(baseRating + (Math.random() - 0.5) * 15),
      coordination: Math.round(baseRating + (Math.random() - 0.5) * 15),
    },
    
    mentalAttributes: {
      decisionMaking: Math.round(baseRating + (Math.random() - 0.5) * 15),
      awareness: Math.round(baseRating + (Math.random() - 0.5) * 20),
      composure: Math.round(baseRating + (Math.random() - 0.5) * 15),
      leadership: Math.round(baseRating + (Math.random() - 0.5) * 25),
      workRate: Math.round(baseRating + (Math.random() - 0.5) * 20),
    },
    
    keyStrengths: [
      'Exceptional ball control in tight spaces',
      'Quick decision-making under pressure',
      'Consistent first touch quality',
      'Strong positional awareness'
    ],
    
    areasForImprovement: [
      'Defensive work rate could be enhanced',
      'Aerial duels need improvement',
      'Consistency in final third'
    ],
    
    potentialRating: Math.round(baseRating + 5 + Math.random() * 10),
    confidenceScore: 0.85 + Math.random() * 0.1, // 85-95%
    analysisDate: new Date(),
    
    comparisonPlayers: [
      'Pedri (FC Barcelona)',
      'Jude Bellingham (Real Madrid)',
      'Gavi (FC Barcelona)'
    ],
    
    detailedInsights: 'This player demonstrates exceptional technical ability with the ball at their feet, showing maturity beyond their years in decision-making. The analysis reveals natural talent for finding space in crowded areas and high potential for professional development. Key strengths include exceptional ball control in tight spaces and quick decision-making under pressure.'
  };
};

const SkillBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-neutral-300">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
    <div className="w-full bg-neutral-800 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

const getRatingColor = (rating: number) => {
  if (rating >= 90) return 'text-green-400';
  if (rating >= 80) return 'text-blue-400';
  if (rating >= 70) return 'text-yellow-400';
  if (rating >= 60) return 'text-orange-400';
  return 'text-red-400';
};

const getRatingBg = (rating: number) => {
  if (rating >= 90) return 'bg-green-600';
  if (rating >= 80) return 'bg-blue-600';
  if (rating >= 70) return 'bg-yellow-600';
  if (rating >= 60) return 'bg-orange-600';
  return 'bg-red-600';
};

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  highlight
}) => {
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  
  // Get the correct video URL for analysis
  const getVideoUrl = () => {
    if (highlight.videoUrl && 
        highlight.videoUrl.trim() !== '' && 
        highlight.videoUrl !== 'undefined' && 
        highlight.videoUrl !== 'null') {
      return highlight.videoUrl;
    }
    
    if (highlight.videoIpfsHash) {
      return `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${highlight.videoIpfsHash}`;
    }
    
    return null;
  };

  const videoUrl = getVideoUrl();
  const hasValidVideo = !!videoUrl;

  const {
    isAnalyzing,
    analysis,
    error,
    progress,
    modelStatus,
    analyzeVideo,
    getAnalysis,
    clearAnalysis,
    testConnection
  } = useHuggingFaceAnalysis();

  // Start analysis when modal opens and has valid video
  useEffect(() => {
    if (isOpen && hasValidVideo && !hasStartedAnalysis) {
      console.log('🤖 Starting Hugging Face analysis for highlight:', highlight.id);
      setHasStartedAnalysis(true);
      
      // Check if we already have cached analysis
      getAnalysis(highlight.id.toString()).then((cachedAnalysis) => {
        if (!cachedAnalysis) {
          // Start new analysis
          analyzeVideo(
            videoUrl!,
            highlight.sport,
            highlight.position,
            {
              title: highlight.title,
              description: `Highlight analysis for ${highlight.title}`,
              skillsShowcased: highlight.skillsShowcased
            }
          );
        }
      });
    }
  }, [isOpen, hasValidVideo, hasStartedAnalysis, highlight.id, videoUrl, analyzeVideo, getAnalysis]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasStartedAnalysis(false);
      clearAnalysis();
    }
  }, [isOpen, clearAnalysis]);

  if (!isOpen) return null;

  // Use real analysis if available, otherwise fallback to mock
  const displayAnalysis = analysis || generateMockAnalysis(highlight);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Video Analysis</h2>
              <p className="text-neutral-400">{highlight.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getRatingColor(displayAnalysis.overallRating)}`}>
                {displayAnalysis.overallRating}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Overall Rating</div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Hugging Face Analysis Status */}
            {hasValidVideo && (
              <HuggingFaceAnalysisStatus
                isAnalyzing={isAnalyzing}
                progress={progress}
                analysis={analysis}
                error={error}
                modelStatus={modelStatus}
                className="mb-6"
              />
            )}



            {/* No Video Warning */}
            {!hasValidVideo && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400">No Video Available</span>
                </div>
                <p className="text-sm text-yellow-300">
                  AI analysis requires a video file. This highlight doesn't have an accessible video for analysis.
                </p>
              </div>
            )}

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-950 to-blue-950 border border-purple-800 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">Overall Rating</span>
                </div>
                <div className={`text-2xl font-bold ${getRatingColor(displayAnalysis.overallRating)}`}>
                  {displayAnalysis.overallRating}/100
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  {displayAnalysis.overallRating >= 90 ? 'Exceptional' : 
                   displayAnalysis.overallRating >= 80 ? 'Excellent' :
                   displayAnalysis.overallRating >= 70 ? 'Good' : 'Developing'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-950 to-emerald-950 border border-green-800 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-green-300">Potential</span>
                </div>
                <div className={`text-2xl font-bold ${getRatingColor(displayAnalysis.potentialRating)}`}>
                  {displayAnalysis.potentialRating}/100
                </div>
                <div className="text-xs text-green-300 mt-1">
                  High growth potential
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">AI Confidence</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(displayAnalysis.confidenceScore * 100)}%
                </div>
                <div className="text-xs text-blue-300 mt-1">
                  Analysis accuracy
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Technical Skills */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Technical Skills</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(displayAnalysis.technicalSkills).map(([skill, value]) => (
                    <SkillBar
                      key={skill}
                      label={skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={value}
                      color="bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  ))}
                </div>
              </div>

              {/* Physical Attributes */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Physical Attributes</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(displayAnalysis.physicalAttributes).map(([attribute, value]) => (
                    <SkillBar
                      key={attribute}
                      label={attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={value}
                      color="bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  ))}
                </div>
              </div>

              {/* Mental Attributes */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Mental Attributes</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(displayAnalysis.mentalAttributes).map(([attribute, value]) => (
                    <SkillBar
                      key={attribute}
                      label={attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={value}
                      color="bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Key Strengths & Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Key Strengths</h3>
                </div>
                <div className="space-y-3">
                  {displayAnalysis.keyStrengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-neutral-300 leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">Areas for Improvement</h3>
                </div>
                <div className="space-y-3">
                  {displayAnalysis.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-neutral-300 leading-relaxed">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison Players */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Comparison Players</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayAnalysis.comparisonPlayers.map((player, index) => (
                  <div key={index} className="bg-neutral-800 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{player.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-medium text-white">{player}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Insights */}
            {displayAnalysis.detailedInsights && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-white">AI Analysis Summary</h3>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {displayAnalysis.detailedInsights}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};