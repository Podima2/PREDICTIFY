import { useState, useCallback } from 'react';
import { AIVideoAnalysis } from '../types';
import HuggingFaceAnalysisService from '../services/huggingFaceAnalysis';

export interface HuggingFaceAnalysisState {
  isAnalyzing: boolean;
  analysis: AIVideoAnalysis | null;
  error: string | null;
  progress: number;
  modelStatus: {
    actionRecognition: 'idle' | 'loading' | 'success' | 'error';
    poseEstimation: 'idle' | 'loading' | 'success' | 'error';
    objectDetection: 'idle' | 'loading' | 'success' | 'error';
  };
}

export function useHuggingFaceAnalysis() {
  const [analysisState, setAnalysisState] = useState<HuggingFaceAnalysisState>({
    isAnalyzing: false,
    analysis: null,
    error: null,
    progress: 0,
    modelStatus: {
      actionRecognition: 'idle',
      poseEstimation: 'idle',
      objectDetection: 'idle'
    }
  });

  const hfService = HuggingFaceAnalysisService.getInstance();

  /**
   * Analyze a video using Hugging Face models
   */
  const analyzeVideo = useCallback(async (
    videoUrl: string,
    sport: string,
    position: string,
    metadata: {
      title: string;
      description: string;
      skillsShowcased: string[];
    }
  ): Promise<AIVideoAnalysis | null> => {
    try {
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null,
        progress: 0,
        modelStatus: {
          actionRecognition: 'loading',
          poseEstimation: 'loading',
          objectDetection: 'loading'
        }
      }));

      // Check for cached analysis first
      const cachedAnalysis = await getCachedAnalysis(videoUrl);
      if (cachedAnalysis) {
        console.log('📋 Using cached Hugging Face analysis');
        setAnalysisState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysis: cachedAnalysis,
          progress: 100,
          modelStatus: {
            actionRecognition: 'success',
            poseEstimation: 'success',
            objectDetection: 'success'
          }
        }));
        return cachedAnalysis;
      }

      // Simulate progress updates for each model
      const progressInterval = setInterval(() => {
        setAnalysisState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 1000);

      // Update model status as they complete
      setTimeout(() => {
        setAnalysisState(prev => ({
          ...prev,
          modelStatus: {
            ...prev.modelStatus,
            actionRecognition: 'success'
          }
        }));
      }, 2000);

      setTimeout(() => {
        setAnalysisState(prev => ({
          ...prev,
          modelStatus: {
            ...prev.modelStatus,
            poseEstimation: 'success'
          }
        }));
      }, 4000);

      setTimeout(() => {
        setAnalysisState(prev => ({
          ...prev,
          modelStatus: {
            ...prev.modelStatus,
            objectDetection: 'success'
          }
        }));
      }, 6000);

      // Perform Hugging Face analysis
      const analysis = await hfService.analyzeVideo(videoUrl, sport, position, metadata);

      clearInterval(progressInterval);
      
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis,
        progress: 100,
        modelStatus: {
          actionRecognition: 'success',
          poseEstimation: 'success',
          objectDetection: 'success'
        }
      }));

      // Cache the analysis result
      cacheAnalysis(videoUrl, analysis);

      return analysis;
    } catch (error) {
      console.error('❌ Hugging Face analysis failed:', error);
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        progress: 0,
        modelStatus: {
          actionRecognition: 'error',
          poseEstimation: 'error',
          objectDetection: 'error'
        }
      }));
      return null;
    }
  }, [hfService]);

  /**
   * Get cached analysis if available
   */
  const getCachedAnalysis = useCallback(async (videoId: string): Promise<AIVideoAnalysis | null> => {
    const cached = localStorage.getItem(`hf_analysis_${videoId}`);
    if (cached) {
      try {
        const analysis = JSON.parse(cached);
        // Check if analysis is less than 24 hours old
        const analysisDate = new Date(analysis.analysisDate);
        const now = new Date();
        const hoursDiff = (now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return analysis;
        }
      } catch (error) {
        console.error('Failed to parse cached analysis:', error);
      }
    }
    return null;
  }, []);

  /**
   * Cache analysis result
   */
  const cacheAnalysis = useCallback((videoId: string, analysis: AIVideoAnalysis): void => {
    try {
      localStorage.setItem(`hf_analysis_${videoId}`, JSON.stringify(analysis));
    } catch (error) {
      console.error('Failed to cache analysis:', error);
    }
  }, []);

  /**
   * Get analysis for a specific video
   */
  const getAnalysis = useCallback(async (videoId: string): Promise<AIVideoAnalysis | null> => {
    try {
      const cachedAnalysis = await getCachedAnalysis(videoId);
      if (cachedAnalysis) {
        setAnalysisState(prev => ({
          ...prev,
          analysis: cachedAnalysis
        }));
        return cachedAnalysis;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get analysis:', error);
      return null;
    }
  }, [getCachedAnalysis]);

  /**
   * Clear current analysis state
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisState({
      isAnalyzing: false,
      analysis: null,
      error: null,
      progress: 0,
      modelStatus: {
        actionRecognition: 'idle',
        poseEstimation: 'idle',
        objectDetection: 'idle'
      }
    });
  }, []);

  /**
   * Test connection to Hugging Face API
   */
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      return await hfService.testConnection();
    } catch (error) {
      console.error('❌ Failed to test Hugging Face connection:', error);
      return false;
    }
  }, [hfService]);

  /**
   * Check if analysis is available for a video
   */
  const hasAnalysis = useCallback(async (videoId: string): Promise<boolean> => {
    const cachedAnalysis = await getCachedAnalysis(videoId);
    return !!cachedAnalysis;
  }, [getCachedAnalysis]);

  return {
    // State
    isAnalyzing: analysisState.isAnalyzing,
    analysis: analysisState.analysis,
    error: analysisState.error,
    progress: analysisState.progress,
    modelStatus: analysisState.modelStatus,
    
    // Actions
    analyzeVideo,
    getAnalysis,
    clearAnalysis,
    testConnection,
    hasAnalysis,
    getCachedAnalysis,
    cacheAnalysis
  };
} 