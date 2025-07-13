import React, { useState, useEffect } from 'react';
import { Search, Heart, TrendingUp, Clock } from 'lucide-react';
import { useHighlights } from '../../hooks/useHighlights';
import { useTipping } from '../../hooks/useTipping';
import { HighlightCard } from '../ui/HighlightCard';
import { Highlight } from '../../hooks/useHighlights';
import { CustomSelect } from '../ui/CustomSelect';

export const DiscoverPage: React.FC = () => {
  const { fetchRecentHighlights, likeHighlight, saveHighlight, recordView } = useHighlights();
  const { sendTip } = useTipping();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [filterSport, setFilterSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sportOptions = [
    { value: 'all', label: 'All Sports' },
    { value: 'Football', label: 'Football' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Tennis', label: 'Tennis' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Hockey', label: 'Hockey' },
    { value: 'Soccer', label: 'Soccer' },
    { value: 'Volleyball', label: 'Volleyball' },
    { value: 'Track', label: 'Track & Field' },
    { value: 'Swimming', label: 'Swimming' }
  ];

  // Load highlights on component mount
  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recentHighlights = await fetchRecentHighlights(0, 20);
      setHighlights(recentHighlights);
    } catch (err) {
      setError('Failed to load highlights');
      console.error('Error loading highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (highlightId: number) => {
    try {
      await likeHighlight(highlightId);
      // Update local state
      setHighlights(prev => prev.map(h => 
        h.id === highlightId ? { ...h, likes: h.likes + 1 } : h
      ));
    } catch (err) {
      console.error('Failed to like highlight:', err);
    }
  };

  const handleSave = async (highlightId: number) => {
    try {
      await saveHighlight(highlightId);
      // Update local state
      setHighlights(prev => prev.map(h => 
        h.id === highlightId ? { ...h, saves: h.saves + 1 } : h
      ));
    } catch (err) {
      console.error('Failed to save highlight:', err);
    }
  };

  const handleView = async (highlightId: number) => {
    try {
      await recordView(highlightId);
      // Update local state
      setHighlights(prev => prev.map(h => 
        h.id === highlightId ? { ...h, views: h.views + 1 } : h
      ));
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  };

  const handleShare = (highlightId: number) => {
    // Implement share functionality
    console.log('Sharing highlight:', highlightId);
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

  const filteredAndSortedHighlights = highlights
    .filter(highlight => {
      // Filter by sport
      if (filterSport !== 'all' && highlight.sport !== filterSport) {
        return false;
      }
      
              // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            highlight.title.toLowerCase().includes(query) ||
            highlight.description.toLowerCase().includes(query) ||
            highlight.skillsShowcased.some((skill: string) => skill.toLowerCase().includes(query)) ||
            highlight.tags.some((tag: string) => tag.toLowerCase().includes(query))
          );
        }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'trending':
          return b.views - a.views;
        case 'recent':
        default:
          return b.uploadedAt - a.uploadedAt;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading highlights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadHighlights}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">Discover Talent</h1>
            <button
              onClick={loadHighlights}
              disabled={loading}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <div className={`w-4 h-4 border-2 border-white/30 border-t-white rounded-full ${loading ? 'animate-spin' : ''}`}></div>
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          <p className="text-neutral-400 text-lg">
            Explore amazing highlight videos from athletes worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search highlights, skills, or athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Sport Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400 text-sm font-medium">Sport:</span>
              <CustomSelect
                value={filterSport}
                onChange={setFilterSport}
                options={sportOptions}
                placeholder="Select sport"
                className="w-48"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400 text-sm font-medium">Sort by:</span>
              <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    sortBy === 'recent'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Recent
                    </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    sortBy === 'popular'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Popular
          </button>
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    sortBy === 'trending'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Trending
                </button>
              </div>
                    </div>
                  </div>
                </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-400">
            {filteredAndSortedHighlights.length} highlight{filteredAndSortedHighlights.length !== 1 ? 's' : ''} found
          </p>
                        </div>

        {/* Highlights Grid */}
        {filteredAndSortedHighlights.length > 0 ? (
          <div className={`grid gap-6 ${
            filteredAndSortedHighlights.length === 1 
              ? 'grid-cols-1 max-w-md mx-auto' 
              : filteredAndSortedHighlights.length === 2 
                ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
                : filteredAndSortedHighlights.length === 3 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredAndSortedHighlights.map((highlight) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
                onView={handleView}
                onTip={handleTip}
                className="hover:scale-[1.02] transition-transform duration-300"
              />
            ))}
                      </div>
                    ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No highlights found</h3>
            <p className="text-neutral-400">
              {searchQuery || filterSport !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No highlights have been uploaded yet'
              }
            </p>
          </div>
        )}

        {/* Load More Button - Only show when there are multiple highlights */}
        {filteredAndSortedHighlights.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={loadHighlights}
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Load More Highlights
            </button>
        </div>
      )}
      </main>
    </div>
  );
};