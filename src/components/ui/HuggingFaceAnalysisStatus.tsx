import React from 'react';
import { Brain, CheckCircle, AlertCircle, Loader, Zap, Target, Eye } from 'lucide-react';
import { AIVideoAnalysis } from '../../types';

interface HuggingFaceAnalysisStatusProps {
  isAnalyzing: boolean;
  progress: number;
  analysis: AIVideoAnalysis | null;
  error: string | null;
  modelStatus: {
    actionRecognition: 'idle' | 'loading' | 'success' | 'error';
    poseEstimation: 'idle' | 'loading' | 'success' | 'error';
    objectDetection: 'idle' | 'loading' | 'success' | 'error';
  };
  className?: string;
}

export const HuggingFaceAnalysisStatus: React.FC<HuggingFaceAnalysisStatusProps> = ({
  isAnalyzing,
  progress,
  analysis,
  error,
  modelStatus,
  className = ''
}) => {
  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className="w-6 h-6 text-red-400" />;
    }
    if (analysis) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
    if (isAnalyzing) {
      return <Loader className="w-6 h-6 text-blue-400 animate-spin" />;
    }
    return <Brain className="w-6 h-6 text-neutral-400" />;
  };

  const getStatusText = () => {
    if (error) {
      return 'AI Analysis Failed';
    }
    if (analysis) {
      return 'AI Analysis Complete';
    }
    if (isAnalyzing) {
      return 'Analyzing with AI Models...';
    }
    return 'Waiting for AI Analysis';
  };

  const getStatusColor = () => {
    if (error) {
      return 'text-red-400';
    }
    if (analysis) {
      return 'text-green-400';
    }
    if (isAnalyzing) {
      return 'text-blue-400';
    }
    return 'text-neutral-400';
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'actionRecognition':
        return <Zap className="w-4 h-4" />;
      case 'poseEstimation':
        return <Target className="w-4 h-4" />;
      case 'objectDetection':
        return <Eye className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getModelStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'loading':
        return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <div className="w-4 h-4 bg-neutral-600 rounded-full" />;
    }
  };

  const getModelName = (model: string) => {
    switch (model) {
      case 'actionRecognition':
        return 'Action Recognition';
      case 'poseEstimation':
        return 'Pose Estimation';
      case 'objectDetection':
        return 'Object Detection';
      default:
        return model;
    }
  };

  return (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          {getStatusIcon()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Hugging Face AI Analysis</h3>
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isAnalyzing && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Processing video with AI models...</span>
            <span className="text-sm font-bold text-neutral-300">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Model Status */}
      {isAnalyzing && (
        <div className="mb-4 space-y-3">
          <h4 className="text-sm font-bold text-white">AI Models Status</h4>
          {Object.entries(modelStatus).map(([model, status]) => (
            <div key={model} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
              <div className="flex items-center space-x-3">
                {getModelIcon(model)}
                <span className="text-sm text-neutral-300">{getModelName(model)}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getModelStatusIcon(status)}
                <span className="text-xs text-neutral-400">
                  {status === 'success' && 'Complete'}
                  {status === 'loading' && 'Processing...'}
                  {status === 'error' && 'Failed'}
                  {status === 'idle' && 'Waiting'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">Analysis Error</span>
          </div>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Analysis Results Preview */}
      {analysis && (
        <div className="space-y-4">
          {/* Overall Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-neutral-300">Overall Rating</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-green-400">
                  {analysis.overallRating}
                </span>
                <span className="text-sm text-neutral-500">/ 100</span>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-neutral-300">AI Confidence</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-blue-400">
                  {Math.round(analysis.confidenceScore * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Key Strengths Preview */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">AI-Detected Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyStrengths.slice(0, 3).map((strength, index) => (
                <span
                  key={index}
                  className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30"
                >
                  {strength}
                </span>
              ))}
              {analysis.keyStrengths.length > 3 && (
                <span className="text-neutral-500 text-xs px-2 py-1">
                  +{analysis.keyStrengths.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* AI Analysis Details */}
          <div className="bg-neutral-900 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-2">AI Analysis Summary</h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {analysis.detailedInsights.substring(0, 200)}...
            </p>
          </div>
        </div>
      )}

      {/* Processing Steps */}
      {isAnalyzing && (
        <div className="space-y-3 text-sm text-neutral-400">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
            <span>Extracting video frames for AI processing...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
            <span>Running action recognition models...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
            <span>Analyzing player poses and movements...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
            <span>Detecting objects and game context...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
            <span>Generating comprehensive insights...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 