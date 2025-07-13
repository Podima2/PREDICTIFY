import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Bookmark, Eye, Share2, MoreVertical } from 'lucide-react';
import { Highlight } from '../../hooks/useHighlights';

interface HighlightCardProps {
  highlight: Highlight;
  onLike?: (highlightId: number) => void;
  onSave?: (highlightId: number) => void;
  onShare?: (highlightId: number) => void;
  onView?: (highlightId: number) => void;
  showActions?: boolean;
  className?: string;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  highlight,
  onLike,
  onSave,
  onShare,
  onView,
  showActions = true,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoAccessible, setVideoAccessible] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        // Pause video
        videoRef.current.pause();
        setIsPlaying(false);
        playPromiseRef.current = null;
      } else {
        // Play video with proper error handling
        setIsLoading(true);
        
        // If there's already a play promise, wait for it
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        // Start new play promise
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
        
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.warn('Video playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      playPromiseRef.current = null;
      
      // Reset video state
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleVideoEvent = (event: string) => {
    switch (event) {
      case 'play':
        setIsPlaying(true);
        setIsLoading(false);
        break;
      case 'pause':
        setIsPlaying(false);
        setIsLoading(false);
        break;
      case 'ended':
        setIsPlaying(false);
        setIsLoading(false);
        playPromiseRef.current = null;
        break;
      case 'error':
        console.error('Video error:', videoRef.current?.error);
        setIsPlaying(false);
        setIsLoading(false);
        playPromiseRef.current = null;
        break;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(highlight.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(highlight.id);
  };

  const handleShare = () => {
    onShare?.(highlight.id);
  };

  const handleView = () => {
    onView?.(highlight.id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Construct video URL if not available
  const videoUrl = highlight.videoUrl && 
    highlight.videoUrl.trim() !== '' && 
    highlight.videoUrl !== 'undefined' && 
    highlight.videoUrl !== 'null' 
    ? highlight.videoUrl 
    : highlight.videoIpfsHash 
      ? `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${highlight.videoIpfsHash}`
      : '';

  // Check if video URL is valid
  const hasValidVideo = videoUrl && 
    (videoUrl.startsWith('http://') || 
     videoUrl.startsWith('https://') || 
     videoUrl.startsWith('ipfs://') ||
     videoUrl.includes('mypinata.cloud'));

  // Test video accessibility
  useEffect(() => {
    if (hasValidVideo && videoUrl) {
      const testVideoAccess = async () => {
        try {
          console.log('Testing video accessibility for:', videoUrl);
          const response = await fetch(videoUrl, { method: 'HEAD' });
          setVideoAccessible(response.ok);
          console.log('Video accessibility test result:', {
            url: videoUrl,
            accessible: response.ok,
            status: response.status,
            statusText: response.statusText
          });
        } catch (error) {
          console.warn('Video accessibility test failed:', error);
          setVideoAccessible(false);
        }
      };
      
      // Add a small delay to avoid too many requests
      const timeoutId = setTimeout(testVideoAccess, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setVideoAccessible(null);
    }
  }, [videoUrl, hasValidVideo]);

  // Debug logging
  useEffect(() => {
    console.log('HighlightCard render debug:', {
      id: highlight.id,
      title: highlight.title,
      originalVideoUrl: highlight.videoUrl,
      constructedVideoUrl: videoUrl,
      videoIpfsHash: highlight.videoIpfsHash,
      metadataIpfsHash: highlight.metadataIpfsHash,
      hasValidVideo,
      videoAccessible,
      thumbnailUrl: highlight.thumbnailUrl
    });
  }, [highlight.videoUrl, videoUrl, hasValidVideo, videoAccessible, highlight.videoIpfsHash, highlight.metadataIpfsHash, highlight.title, highlight.id, highlight.thumbnailUrl]);

  return (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-300 ${className}`}>
      {/* Video Container - Now horizontal */}
      <div className="relative aspect-video bg-black">
        {hasValidVideo ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              poster={highlight.thumbnailUrl}
              onPlay={() => handleVideoEvent('play')}
              onPause={() => handleVideoEvent('pause')}
              onEnded={() => handleVideoEvent('ended')}
              onError={() => handleVideoEvent('error')}
              onClick={handleView}
              preload="metadata"
              muted
            />
            
            {/* Play/Pause Overlay */}
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </button>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {formatDuration(highlight.duration)}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
            <div className="text-center p-4">
              <Play className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm font-medium">Video not available</p>
              {highlight.videoIpfsHash ? (
                <div className="mt-2 space-y-1">
                  <p className="text-neutral-600 text-xs">
                    IPFS Hash: {highlight.videoIpfsHash.substring(0, 12)}...{highlight.videoIpfsHash.substring(highlight.videoIpfsHash.length - 8)}
                  </p>
                  <p className="text-neutral-700 text-xs">
                    Constructed URL: {videoUrl.substring(0, 40)}...
                  </p>
                  {videoAccessible !== null && (
                    <p className={`text-xs ${videoAccessible ? 'text-green-500' : 'text-red-500'}`}>
                      {videoAccessible ? '✓ Accessible' : '✗ Not accessible'}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-neutral-600 text-xs mt-2">No video data found</p>
              )}
              {highlight.videoUrl && highlight.videoUrl !== videoUrl && (
                <p className="text-neutral-600 text-xs mt-1">
                  Original URL: {highlight.videoUrl.substring(0, 30)}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {highlight.sport && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {highlight.sport}
            </span>
          )}
          {highlight.position && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {highlight.position}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {highlight.title}
          </h3>
          <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
            {highlight.description}
          </p>
        </div>

        {/* Game Context */}
        {(highlight.opponent || highlight.competition) && (
          <div className="mb-4 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
            <div className="flex items-center space-x-2 text-sm">
              {highlight.opponent && (
                <span className="text-neutral-300">
                  vs <span className="text-white font-semibold">{highlight.opponent}</span>
                </span>
              )}
              {highlight.competition && (
                <span className="text-neutral-400">• {highlight.competition}</span>
              )}
            </div>
            {highlight.result && (
              <div className="text-xs text-neutral-500 mt-1">
                Result: {highlight.result}
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {highlight.skillsShowcased.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {highlight.skillsShowcased.slice(0, 4).map((skill: string) => (
                <span
                  key={skill}
                  className="bg-red-600/20 text-red-300 text-xs px-3 py-1 rounded-full border border-red-600/30 font-medium"
                >
                  {skill}
                </span>
              ))}
              {highlight.skillsShowcased.length > 4 && (
                <span className="text-neutral-500 text-xs px-2 py-1">
                  +{highlight.skillsShowcased.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats and Date */}
        <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{formatNumber(highlight.views)}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{formatNumber(highlight.likes)}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span className="font-medium">{formatNumber(highlight.saves)}</span>
            </span>
          </div>
          <span className="text-xs text-neutral-600">{formatDate(highlight.uploadedAt)}</span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isLiked ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">Like</span>
              </button>
              
              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isSaved ? 'text-blue-500' : 'text-neutral-400 hover:text-blue-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">Save</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
            
            <button className="text-neutral-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-neutral-800">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};