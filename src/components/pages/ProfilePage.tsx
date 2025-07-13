import React, { useState, useEffect } from 'react';
import { Camera, TrendingUp, Brain, Heart, Bookmark, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { useUserRegistry } from '../../hooks/useUserRegistry';
import { useHighlights } from '../../hooks/useHighlights';
import { useTipping } from '../../hooks/useTipping';
import { HighlightCard } from '../ui/HighlightCard';
import { UserRole } from '../../types';

export const ProfilePage: React.FC = () => {
  const { address, isConnected } = useWallet();
  const { userRole, getAthleteProfile, getScoutProfile } = useUserRegistry();
  const { getAthleteHighlights, deactivateHighlight } = useHighlights();
  const { sendTip } = useTipping();
  
  const [activeTab, setActiveTab] = useState<'videos' | 'stats' | 'reports'>('videos');
  const [profile, setProfile] = useState<any>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightsLoading, setHighlightsLoading] = useState(false);

  const isAthlete = userRole === UserRole.Athlete;

  useEffect(() => {
    if (isConnected && address) {
      loadProfile();
    }
  }, [isConnected, address, userRole]);

  const loadProfile = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      if (isAthlete) {
        const athleteProfile = await getAthleteProfile(address);
        setProfile(athleteProfile);
        
        // Load athlete's highlights
        setHighlightsLoading(true);
        try {
          const athleteHighlights = await getAthleteHighlights(address);
          setHighlights(athleteHighlights);
          console.log('Loaded athlete highlights:', athleteHighlights);
        } catch (error) {
          console.error('Failed to load athlete highlights:', error);
          setHighlights([]);
        } finally {
          setHighlightsLoading(false);
        }
      } else if (userRole === UserRole.Scout) {
        const scoutProfile = await getScoutProfile(address);
        setProfile(scoutProfile);
        setHighlights([]); // Scouts don't have highlights
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateHighlight = async (highlightId: number) => {
    try {
      await deactivateHighlight(highlightId);
      // Refresh highlights
      if (address && isAthlete) {
        setHighlightsLoading(true);
        try {
          const athleteHighlights = await getAthleteHighlights(address);
          setHighlights(athleteHighlights);
        } catch (error) {
          console.error('Failed to refresh highlights:', error);
        } finally {
          setHighlightsLoading(false);
        }
      }
    } catch (error) {
      console.error('Failed to deactivate highlight:', error);
    }
  };

  const handleLike = async (highlightId: number) => {
    // Like functionality handled by HighlightCard
  };

  const handleSave = async (highlightId: number) => {
    // Save functionality handled by HighlightCard
  };

  const handleShare = (highlightId: number) => {
    // Share functionality
    console.log('Sharing highlight:', highlightId);
  };

  const handleView = async (highlightId: number) => {
    // View functionality handled by HighlightCard
  };

  const handleTip = async (highlightId: number, amount: number, tokenType: string) => {
    try {
      // Find the highlight to get the athlete's address
      const highlight = highlights.find(h => h.id === highlightId);
      if (!highlight) {
        throw new Error('Highlight not found');
      }

      if (!highlight.athleteAddress) {
        throw new Error('Athlete address not available');
      }

      console.log(`Sending tip: ${amount} ${tokenType} to ${highlight.athleteAddress}`);
      
      const result = await sendTip(highlightId, amount, tokenType, highlight.athleteAddress);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send tip');
      }

      console.log(`Tip sent successfully: ${result.transactionHash}`);
      
    } catch (error) {
      console.error('Failed to send tip:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to send tip. Please try again.');
    }
  };

  // Convert CompleteHighlight to Highlight for HighlightCard compatibility
  const convertToHighlightCard = (completeHighlight: any): any => {
    return {
      id: completeHighlight.id,
      videoIpfsHash: completeHighlight.videoIpfsHash,
      metadataIpfsHash: completeHighlight.metadataIpfsHash,
      title: completeHighlight.title || 'Untitled Highlight',
      description: completeHighlight.description || 'No description available',
      sport: completeHighlight.sport || 'Unknown',
      position: completeHighlight.position || '',
      skillsShowcased: completeHighlight.skillsShowcased || [],
      tags: completeHighlight.tags || [],
      duration: completeHighlight.duration || 0,
      uploadedAt: completeHighlight.uploadedAt ? new Date(completeHighlight.uploadedAt).getTime() / 1000 : Date.now() / 1000,
      views: completeHighlight.views || 0,
      likes: completeHighlight.likes || 0,
      saves: completeHighlight.saves || 0,
      isActive: completeHighlight.isActive !== false,
      athleteAddress: completeHighlight.athleteAddress || '',
      opponent: completeHighlight.opponent || '',
      gameDate: completeHighlight.gameDate ? new Date(completeHighlight.gameDate).getTime() / 1000 : Date.now() / 1000,
      competition: completeHighlight.competition || '',
      result: completeHighlight.result || '',
      videoUrl: completeHighlight.videoUrl,
      thumbnailUrl: completeHighlight.thumbnailUrl
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 mb-8">
            <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile?.name?.charAt(0) || 'U'
              )}
              </div>
              
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{profile?.name || 'Unknown User'}</h1>
                  <div className="flex items-center space-x-4 text-neutral-400">
                    {isAthlete ? (
                      <>
                    <span>{profile?.sport || 'Unknown Sport'}</span>
                        <span>•</span>
                    <span>{profile?.position || 'Unknown Position'}</span>
                        <span>•</span>
                    <span>{profile?.age || 'Unknown Age'} years old</span>
                      </>
                    ) : (
                      <>
                    <span>{profile?.organization || 'Unknown Organization'}</span>
                        <span>•</span>
                    <span>{profile?.position || 'Unknown Position'}</span>
                      </>
                    )}
              </div>
              {profile?.bio && (
                <p className="text-neutral-300 mt-3 max-w-2xl">{profile.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{highlights.length}</div>
                  <div className="text-neutral-400 text-sm">Highlights</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {highlights.reduce((sum: number, h: any) => sum + h.views, 0).toLocaleString()}
                </div>
                  <div className="text-neutral-400 text-sm">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {highlights.reduce((sum: number, h: any) => sum + h.likes, 0).toLocaleString()}
                </div>
                  <div className="text-neutral-400 text-sm">Likes</div>
                </div>
                </div>
                </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl mb-8">
          <div className="flex border-b border-neutral-800">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
                activeTab === 'videos'
                  ? 'text-white border-b-2 border-red-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Videos
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'text-white border-b-2 border-red-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Stats
            </button>
                <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'text-white border-b-2 border-red-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Brain className="w-5 h-5 inline mr-2" />
              Reports
                </button>
          </div>

          <div className="p-6">
            {activeTab === 'videos' && (
              <div>
                {/* Video Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">My Highlights</h3>
                  {isAthlete && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={async () => {
                          if (address) {
                            setHighlightsLoading(true);
                            try {
                              const athleteHighlights = await getAthleteHighlights(address);
                              setHighlights(athleteHighlights);
                            } catch (error) {
                              console.error('Failed to refresh highlights:', error);
                            } finally {
                              setHighlightsLoading(false);
                            }
                          }
                        }}
                        disabled={highlightsLoading}
                        className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <div className={`w-4 h-4 border-2 border-white/30 border-t-white rounded-full ${highlightsLoading ? 'animate-spin' : ''}`}></div>
                        <span>{highlightsLoading ? 'Loading...' : 'Refresh'}</span>
                      </button>
                      <button
                        onClick={() => window.location.href = '/upload'}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload New</span>
                      </button>
                    </div>
                  )}
                </div>

                {highlightsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400">Loading highlights...</p>
                  </div>
                ) : highlights.length > 0 ? (
                  <div>
                    <div className="mb-4 text-sm text-neutral-400">
                      Showing {highlights.length} highlight{highlights.length !== 1 ? 's' : ''}
                    </div>
                    <div className={`grid gap-6 ${
                      highlights.length === 1 
                        ? 'grid-cols-1 max-w-md mx-auto' 
                        : highlights.length === 2 
                          ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
                          : highlights.length === 3 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {highlights.map((completeHighlight: any) => {
                        const highlight = convertToHighlightCard(completeHighlight);
                        return (
                          <div key={highlight.id} className="relative group">
                            <HighlightCard
                              highlight={highlight}
                              onLike={handleLike}
                              onSave={handleSave}
                              onShare={handleShare}
                              onView={handleView}
                              onTip={handleTip}
                              showActions={false}
                              className="hover:scale-[1.02] transition-transform duration-300"
                            />
                            
                            {/* Edit/Delete Overlay for Athletes */}
                            {isAthlete && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => console.log('Edit highlight:', highlight.id)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeactivateHighlight(highlight.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl text-sharp text-white mb-4">No Videos Yet</h3>
                <p className="text-neutral-400 font-medium mb-6">
                  {isAthlete 
                    ? "Upload your first highlight video to showcase your talent!"
                    : "No videos have been uploaded yet."
                  }
                </p>
                {isAthlete && (
                      <button 
                        onClick={() => window.location.href = '/upload'}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Upload Video</span>
                  </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl text-sharp text-white mb-4">Performance Analytics</h3>
                <p className="text-neutral-400 font-medium mb-6">
                  Detailed performance statistics and analytics will appear here.
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {highlights.reduce((sum: number, h: any) => sum + h.views, 0).toLocaleString()}
                    </div>
                    <div className="text-neutral-400 text-sm">Total Views</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {highlights.reduce((sum: number, h: any) => sum + h.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-neutral-400 text-sm">Total Likes</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {highlights.reduce((sum: number, h: any) => sum + h.saves, 0).toLocaleString()}
                    </div>
                    <div className="text-neutral-400 text-sm">Total Saves</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl text-sharp text-white mb-4">AI Scouting Reports</h3>
                <p className="text-neutral-400 font-medium">
                  {isAthlete 
                    ? "AI-generated scouting reports will appear here once scouts review your highlights."
                    : "Your scouting reports and analysis will appear here."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};