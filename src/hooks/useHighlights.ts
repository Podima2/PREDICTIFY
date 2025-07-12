import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { TALENTFLOW_ADDRESS, TALENTFLOW_ABI } from '../constants/contracts';
import { uploadHighlightToIPFS, testPinataConnection, fetchMetadataFromIPFS } from '../utils/uploadToIpfs';

export interface HighlightMetadata {
  title: string;
  description: string;
  sport: string;
  position: string;
  skillsShowcased: string[];
  tags: string[];
  duration: number;
  opponent: string;
  gameDate: string;
  competition: string;
  result: string;
  athleteAddress: string;
}

// Legacy Highlight interface for backward compatibility
export interface Highlight {
  id: number;
  videoIpfsHash: string;
  metadataIpfsHash: string;
  title: string;
  description: string;
  sport: string;
  position: string;
  skillsShowcased: string[];
  tags: string[];
  duration: number;
  uploadedAt: number;
  views: number;
  likes: number;
  saves: number;
  isActive: boolean;
  athleteAddress: string;
  opponent: string;
  gameDate: number;
  competition: string;
  result: string;
  // Computed fields
  videoUrl?: string;
  thumbnailUrl?: string;
  metadata?: any;
}

export interface CompleteHighlight {
  id: number;
  metadataIpfsHash: string;
  isActive: boolean;
  athleteAddress: string;
  // Metadata from IPFS
  title: string;
  description: string;
  sport: string;
  position: string;
  skillsShowcased: string[];
  tags: string[];
  duration: number;
  opponent: string;
  gameDate: string;
  competition: string;
  result: string;
  videoIpfsHash: string;
  thumbnailIpfsHash: string;
  videoUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  views: number;
  likes: number;
  saves: number;
  version: string;
  platform: string;
}

export function useHighlights() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);

  // Get public client for reading contract data
  const publicClient = usePublicClient();

  // Contract write for uploading highlight
  const { 
    data: uploadData, 
    writeContract: uploadHighlight, 
    isPending: isUploadingToContract,
    error: uploadError 
  } = useWriteContract();

  // Wait for upload transaction
  const { isLoading: isUploadPending } = useWaitForTransactionReceipt({
    hash: uploadData,
  });

  // Test Pinata connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🧪 Testing Pinata connection from hook...");
      const isConnected = await testPinataConnection();
      console.log("🔗 Connection test result:", isConnected);
      return isConnected;
    } catch (error) {
      console.error("❌ Connection test failed:", error);
      return false;
    }
  }, []);

  // Upload a new highlight
  const uploadNewHighlight = useCallback(async (
    videoFile: File, 
    metadata: HighlightMetadata
  ): Promise<{ success: boolean; highlightId?: number; error?: string }> => {
    try {
      setIsUploading(true);
      setUploadProgress('Testing connection...');

      // Test Pinata connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to IPFS service. Please check your internet connection.");
      }

      setUploadProgress('Uploading video and metadata to IPFS...');

      // Step 1: Upload to IPFS
      const { metadataIpfsHash, thumbnailUrl } = await uploadHighlightToIPFS(videoFile, metadata);
      
      setUploadProgress('Uploading to blockchain...');

      // Step 2: Upload to blockchain (only the metadata hash)
      uploadHighlight({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'uploadHighlight',
        args: [metadataIpfsHash]
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to upload highlight:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.message.includes('connection')) {
          errorMessage = 'Network connection issue. Please check your internet and try again.';
        } else if (error.message.includes('size')) {
          errorMessage = 'Video file is too large. Please use a smaller file.';
        } else if (error.message.includes('type')) {
          errorMessage = 'Please select a valid video file.';
        } else if (error.message.includes('Pinata')) {
          errorMessage = 'Upload service temporarily unavailable. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  }, [uploadHighlight, testConnection]);

  // Legacy function for backward compatibility
  const uploadHighlightLegacy = useCallback(async (data: any): Promise<number> => {
    try {
      const result = await uploadNewHighlight(data.videoFile, {
        title: data.title,
        description: data.description,
        sport: data.sport,
        position: data.position,
        skillsShowcased: data.skillsShowcased,
        tags: data.tags,
        duration: data.duration || 0,
        opponent: data.opponent,
        gameDate: data.gameDate,
        competition: data.competition,
        result: data.result,
        athleteAddress: data.athleteAddress
      });
      
      if (result.success) {
        return 1; // Return dummy ID for now
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  }, [uploadNewHighlight]);

  // Get highlights for a specific athlete
  const getAthleteHighlights = useCallback(async (athleteAddress: string): Promise<CompleteHighlight[]> => {
    try {
      console.log('Getting highlights for athlete:', athleteAddress);
      
      if (!publicClient) {
        console.error('Public client not available');
        return [];
      }
      
      // Read from contract to get highlight IDs for this athlete
      const highlightIds = await publicClient.readContract({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'getAthleteHighlightIds',
        args: [athleteAddress as `0x${string}`]
      });

      if (!highlightIds || highlightIds.length === 0) {
        console.log('No highlights found for athlete');
        return [];
      }

      console.log('Found highlight IDs:', highlightIds);

      // Fetch each highlight's data
      const highlights: CompleteHighlight[] = [];
      for (const highlightId of highlightIds) {
        try {
          // Get highlight from contract
          const highlightData = await publicClient.readContract({
            address: TALENTFLOW_ADDRESS as `0x${string}`,
            abi: TALENTFLOW_ABI,
            functionName: 'getHighlight',
            args: [BigInt(highlightId)]
          });

          if (highlightData && highlightData.isActive) {
            // Fetch metadata from IPFS
            const metadata = await fetchMetadataFromIPFS(highlightData.metadataIpfsHash);
            
            highlights.push({
              id: Number(highlightId),
              metadataIpfsHash: highlightData.metadataIpfsHash,
              isActive: highlightData.isActive,
              athleteAddress: highlightData.athleteAddress,
              ...metadata
            });
          }
        } catch (error) {
          console.error(`Failed to fetch highlight ${highlightId}:`, error);
        }
      }

      console.log('Fetched highlights:', highlights);
      return highlights;
    } catch (error) {
      console.error('Failed to get athlete highlights:', error);
      return [];
    }
  }, [publicClient]);

  // Get recent highlights
  const getRecentHighlights = useCallback(async (): Promise<CompleteHighlight[]> => {
    try {
      console.log('Getting recent highlights');
      
      if (!publicClient) {
        console.error('Public client not available');
        return [];
      }
      
      // Read from contract to get recent highlights
      const recentHighlights = await publicClient.readContract({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'getRecentHighlights',
        args: [BigInt(0), BigInt(20)] // offset, limit
      });

      if (!recentHighlights || recentHighlights.length === 0) {
        console.log('No recent highlights found');
        return [];
      }

      console.log('Found recent highlights:', recentHighlights);

      // Fetch metadata for each highlight
      const highlights: CompleteHighlight[] = [];
      for (const highlightData of recentHighlights) {
        try {
          if (highlightData.isActive) {
            // Fetch metadata from IPFS
            const metadata = await fetchMetadataFromIPFS(highlightData.metadataIpfsHash);
            
            highlights.push({
              id: highlights.length + 1, // Use array index as ID for now
              metadataIpfsHash: highlightData.metadataIpfsHash,
              isActive: highlightData.isActive,
              athleteAddress: highlightData.athleteAddress,
              ...metadata
            });
          }
        } catch (error) {
          console.error('Failed to fetch highlight metadata:', error);
        }
      }

      console.log('Fetched recent highlights:', highlights);
      return highlights;
    } catch (error) {
      console.error('Failed to get recent highlights:', error);
      return [];
    }
  }, [publicClient]);

  // Legacy function for backward compatibility
  const fetchRecentHighlights = useCallback(async (offset: number = 0, limit: number = 10): Promise<Highlight[]> => {
    try {
      const recentHighlights = await getRecentHighlights();
      console.log('Raw recent highlights from IPFS:', recentHighlights);
      
      // Convert CompleteHighlight to Highlight for backward compatibility
      return recentHighlights.map((h, index) => {
        // Ensure videoUrl is properly set - prioritize the URL from metadata
        let videoUrl = h.videoUrl;
        if (!videoUrl || videoUrl === 'undefined' || videoUrl === 'null') {
          if (h.videoIpfsHash) {
            // Fallback: construct URL from IPFS hash
            videoUrl = `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${h.videoIpfsHash}`;
            console.log('Constructed video URL from IPFS hash:', videoUrl);
          } else {
            console.warn('No video URL or IPFS hash found for highlight:', h.id);
            videoUrl = '';
          }
        }

        // Ensure thumbnailUrl is properly set
        let thumbnailUrl = h.thumbnailUrl;
        if (!thumbnailUrl || thumbnailUrl === 'undefined' || thumbnailUrl === 'null') {
          if (h.thumbnailIpfsHash) {
            // Fallback: construct URL from IPFS hash
            thumbnailUrl = `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${h.thumbnailIpfsHash}`;
          } else {
            thumbnailUrl = '';
          }
        }

        console.log('Processed highlight:', {
          id: h.id || index,
          title: h.title,
          videoUrl,
          thumbnailUrl,
          videoIpfsHash: h.videoIpfsHash,
          hasValidVideo: videoUrl && videoUrl.trim() !== '' && videoUrl !== 'undefined' && videoUrl !== 'null'
        });

        return {
          id: h.id || index,
          videoIpfsHash: h.videoIpfsHash,
          metadataIpfsHash: h.metadataIpfsHash,
          title: h.title || 'Untitled Highlight',
          description: h.description || 'No description available',
          sport: h.sport || 'Unknown',
          position: h.position || '',
          skillsShowcased: h.skillsShowcased || [],
          tags: h.tags || [],
          duration: h.duration || 0,
          uploadedAt: h.uploadedAt ? new Date(h.uploadedAt).getTime() / 1000 : Date.now() / 1000,
          views: h.views || 0,
          likes: h.likes || 0,
          saves: h.saves || 0,
          isActive: h.isActive !== false,
          athleteAddress: h.athleteAddress || '',
          opponent: h.opponent || '',
          gameDate: h.gameDate ? new Date(h.gameDate).getTime() / 1000 : Date.now() / 1000,
          competition: h.competition || '',
          result: h.result || '',
          videoUrl,
          thumbnailUrl
        };
      });
    } catch (error) {
      console.error('Failed to fetch recent highlights:', error);
      return [];
    }
  }, [getRecentHighlights]);

  // Legacy function for backward compatibility
  const fetchUserHighlights = useCallback(async () => {
    try {
      if (!highlights.length) {
        // Load some dummy data for now
        setHighlights([
          {
            id: 1,
            videoIpfsHash: 'dummy',
            metadataIpfsHash: 'dummy',
            title: 'Sample Highlight',
            description: 'This is a sample highlight',
            sport: 'Soccer',
            position: 'Forward',
            skillsShowcased: ['Dribbling', 'Shooting'],
            tags: ['goal', 'highlight'],
            duration: 30,
            uploadedAt: Date.now() / 1000,
            views: 100,
            likes: 25,
            saves: 10,
            isActive: true,
            athleteAddress: '0x123...',
            opponent: 'Team B',
            gameDate: Date.now() / 1000,
            competition: 'League Match',
            result: 'Won 2-1',
            videoUrl: 'https://example.com/video.mp4',
            thumbnailUrl: 'https://example.com/thumbnail.jpg'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch user highlights:', error);
    }
  }, [highlights.length]);

  // Legacy function for backward compatibility
  const deactivateHighlight = useCallback(async (highlightId: number) => {
    try {
      console.log('Deactivating highlight:', highlightId);
      // Update local state
      setHighlights(prev => prev.map(h => 
        h.id === highlightId ? { ...h, isActive: false } : h
      ));
    } catch (error) {
      console.error('Failed to deactivate highlight:', error);
    }
  }, []);

  // Like a highlight
  const likeHighlight = useCallback(async (highlightId: number) => {
    try {
      const { writeContract: likeHighlightWrite } = useWriteContract();
      likeHighlightWrite({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'likeHighlight',
        args: [BigInt(highlightId)]
      });
    } catch (error) {
      console.error('Failed to like highlight:', error);
    }
  }, []);

  // Save a highlight
  const saveHighlight = useCallback(async (highlightId: number) => {
    try {
      const { writeContract: saveHighlightWrite } = useWriteContract();
      saveHighlightWrite({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'saveHighlight',
        args: [BigInt(highlightId)]
      });
    } catch (error) {
      console.error('Failed to save highlight:', error);
    }
  }, []);

  // Record a view
  const recordView = useCallback(async (highlightId: number) => {
    try {
      const { writeContract: recordViewWrite } = useWriteContract();
      recordViewWrite({
        address: TALENTFLOW_ADDRESS as `0x${string}`,
        abi: TALENTFLOW_ABI,
        functionName: 'recordView',
        args: [BigInt(highlightId)]
      });
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  }, []);

  return {
    // New functions
    uploadNewHighlight,
    getAthleteHighlights,
    getRecentHighlights,
    testConnection, // Add this for debugging
    
    // Legacy functions for backward compatibility
    uploadHighlight: uploadHighlightLegacy,
    fetchRecentHighlights,
    fetchUserHighlights,
    deactivateHighlight,
    
    // Interaction functions
    likeHighlight,
    saveHighlight,
    recordView,
    
    // State
    highlights,
    loading,
    isUploading: isUploading || isUploadingToContract || isUploadPending,
    uploadProgress,
    uploadError,
  };
} 