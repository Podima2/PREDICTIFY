import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Bookmark, Eye, Share2, MoreVertical, Gift } from 'lucide-react';
import { Highlight } from '../../hooks/useHighlights';
import { TipModal } from './TipModal';

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
  const [videoError, setVideoError] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get the correct video URL
  const getVideoUrl = () => {
    console.log('🎬 Getting video URL for highlight:', highlight.id);
    console.log('🎬 Available URLs:', {
      videoUrl: highlight.videoUrl,
      videoIpfsHash: highlight.videoIpfsHash,
      hasVideoUrl: !!highlight.videoUrl,
      hasIpfsHash: !!highlight.videoIpfsHash
    });

    // Use videoUrl if available and valid
    if (highlight.videoUrl && 
        highlight.videoUrl.trim() !== '' && 
        highlight.videoUrl !== 'undefined' && 
        highlight.videoUrl !== 'null') {
      console.log('✅ Using videoUrl:', highlight.videoUrl);
      return highlight.videoUrl;
    }
    
    // Fallback to constructing from IPFS hash
    if (highlight.videoIpfsHash) {
      const constructedUrl = `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${highlight.videoIpfsHash}`;
      console.log('✅ Using constructed URL from IPFS hash:', constructedUrl);
      return constructedUrl;
    }
    
    console.log('❌ No valid video URL found');
    return null;
  };

  const videoUrl = getVideoUrl();
  const hasValidVideo = !!videoUrl;

  // Reset video state when highlight changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoError(false);
    setVideoLoaded(false);
    setIsLoading(false);
  }, [highlight.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  const handleVideoLoad = () => {
    console.log('🎬 Video loaded successfully');
    setVideoLoaded(true);
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoError = (e: any) => {
    console.error('🎬 Video error:', e);
    console.error('🎬 Video error details:', videoRef.current?.error);
    setVideoError(true);
    setIsLoading(false);
    setIsPlaying(false);
    setVideoLoaded(false);
  };

  const handleVideoLoadStart = () => {
    console.log('🎬 Video load started');
    setIsLoading(true);
    setVideoError(false);
  };

  const handleVideoCanPlay = () => {
    console.log('🎬 Video can play');
    setIsLoading(false);
    setVideoLoaded(true);
  };

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!videoRef.current || !hasValidVideo || videoError) {
      console.log('🎬 Cannot play: no video ref, invalid video, or error');
      return;
    }

    try {
      if (isPlaying) {
        console.log('🎬 Pausing video');
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('🎬 Playing video');
        setIsLoading(true);
        
        // Ensure video is loaded before playing
        if (!videoLoaded) {
          console.log('🎬 Video not loaded yet, waiting...');
          await new Promise((resolve) => {
            const checkLoaded = () => {
              if (videoRef.current && videoRef.current.readyState >= 2) {
                resolve(void 0);
              } else {
                setTimeout(checkLoaded, 100);
              }
            };
            checkLoaded();
          });
        }

        await videoRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        
        // Record view when video starts playing
        if (onView) {
          onView(highlight.id);
        }
      }
    } catch (error) {
      console.error('🎬 Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Try to reload the video source
      if (videoRef.current && videoUrl) {
        console.log('🎬 Attempting to reload video source');
        videoRef.current.load();
      }
    }
  };

  const handleVideoPlay = () => {
    console.log('🎬 Video play event');
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handleVideoPause = () => {
    console.log('🎬 Video pause event');
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleVideoEnded = () => {
    console.log('🎬 Video ended');
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(highlight.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(highlight.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(highlight.id);
  };

  const handleTipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTipModal(true);
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

  // Get athlete name from address
  const athleteName = highlight.athleteAddress 
    ? `${highlight.athleteAddress.substring(0, 6)}...${highlight.athleteAddress.substring(highlight.athleteAddress.length - 4)}`
    : 'Unknown Athlete';

  console.log('🎬 Rendering HighlightCard:', {
    id: highlight.id,
    title: highlight.title,
    hasValidVideo,
    videoUrl,
    videoError,
    isLoading,
    isPlaying
  });

  return (
    <>
      <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 group ${className}`}>
        {/* Video Container */}
        <div className="relative aspect-video bg-neutral-900">
          {hasValidVideo ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={highlight.thumbnailUrl}
                onLoadStart={handleVideoLoadStart}
                onCanPlay={handleVideoCanPlay}
                onLoadedData={handleVideoLoad}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                preload="metadata"
                muted
                playsInline
                crossOrigin="anonymous"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play/Pause Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handlePlayPause}
              >
                <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors duration-200">
                  {isLoading ? (
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : videoError ? (
                    <div className="text-white text-xs text-center px-2">
                      <div className="mb-1">⚠️</div>
                      <div>Error</div>
                    </div>
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </div>

              {/* Duration Badge */}
              {highlight.duration > 0 && (
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {formatDuration(highlight.duration)}
                </div>
              )}


            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <div className="text-center p-6">
                <Play className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm font-medium mb-2">Video not available</p>
                <p className="text-neutral-600 text-xs">
                  No video source found
                </p>
                {/* Debug info */}
                <div className="mt-2 text-xs text-neutral-700">
                  <div>URL: {videoUrl || 'None'}</div>
                  <div>Hash: {highlight.videoIpfsHash || 'None'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sport and Position Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {highlight.sport && (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                {highlight.sport}
              </span>
            )}
            {highlight.position && (
              <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                {highlight.position}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
              {highlight.title}
            </h3>
            <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
              {highlight.description}
            </p>
          </div>

          {/* Game Context */}
          {(highlight.opponent || highlight.competition) && (
            <div className="mb-4 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
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
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">
                    {highlight.result}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {highlight.skillsShowcased.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {highlight.skillsShowcased.slice(0, 3).map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-red-600/20 text-red-300 text-xs px-3 py-1 rounded-full border border-red-600/30 font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {highlight.skillsShowcased.length > 3 && (
                  <span className="text-neutral-500 text-xs px-2 py-1 bg-neutral-800 rounded-full">
                    +{highlight.skillsShowcased.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{formatNumber(highlight.views)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span className="font-medium">{formatNumber(highlight.likes)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Bookmark className="w-4 h-4" />
                <span className="font-medium">{formatNumber(highlight.saves)}</span>
              </span>
            </div>
            <span className="text-xs text-neutral-600">{formatDate(highlight.uploadedAt)}</span>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isLiked 
                      ? 'text-red-500 bg-red-500/10' 
                      : 'text-neutral-400 hover:text-red-500 hover:bg-red-500/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-medium">Like</span>
                </button>
                
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isSaved 
                      ? 'text-blue-500 bg-blue-500/10' 
                      : 'text-neutral-400 hover:text-blue-500 hover:bg-blue-500/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="text-xs font-medium">Save</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Share</span>
                </button>
                
                <button
                  onClick={handleTipClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Gift className="w-4 h-4" />
                  <span className="text-xs font-medium">Tip</span>
                </button>
              </div>
              
              <button className="text-neutral-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-neutral-800">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tip Modal */}
      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        athleteName={athleteName}
        athleteAddress={highlight.athleteAddress || ''}
        highlightId={highlight.id}
      />
    </>
  );
};