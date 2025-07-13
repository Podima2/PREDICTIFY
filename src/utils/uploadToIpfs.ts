import { PinataSDK } from "pinata-web3";

// Use environment variable for JWT token (more secure)
const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTJjNzZhNi0wNTZkLTQ1ZmMtOGE0My1kYjRhYjBhNDhmYWYiLCJlbWFpbCI6Im14YmVyMjAyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTE2MDg0ZTdjNzViMjA0NDMwMTQiLCJzY29wZWRLZXlTZWNyZXQiOiJmMTA0ODk3NTg4YzhjZDQxNDUwYzMxMGI1MTM2MTEyNTJmN2E5OWFjMzZlMDE1Yjc1OWM2MDM3ZTFiNDkxYzhjIiwiZXhwIjoxNzgxMzc3MjIzfQ.ky1qACH3cpAngylZkFPaGiNNlOqhV3xgma56_iH43i8";

const pinata = new PinataSDK({
  pinataJwt: pinataJwt,
});

/**
 * Test Pinata connectivity
 * @returns Promise<boolean> - true if connection is working
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    console.log("🧪 Testing Pinata connection...");
    
    // Try to upload a simple test JSON
    const testData = { test: "connection", timestamp: Date.now() };
    const result = await pinata.upload.json(testData);
    
    if (result && result.IpfsHash) {
      console.log("✅ Pinata connection successful:", result.IpfsHash);
      return true;
    } else {
      console.error("❌ Pinata connection failed - no hash returned");
      return false;
    }
  } catch (error) {
    console.error("❌ Pinata connection test failed:", error);
    return false;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param jsonMetadata - The JSON object to upload
 * @returns IPFS hash (CID)
 */
export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  try {
    console.log("📤 Uploading JSON to IPFS...");
    console.log("📋 JSON data:", JSON.stringify(jsonMetadata, null, 2));
    
    const result = await pinata.upload.json(jsonMetadata);
    
    if (!result || !result.IpfsHash) {
      throw new Error("Pinata upload failed - no hash returned");
    }
    
    console.log("✅ JSON uploaded to IPFS:", result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error("❌ Failed to upload JSON to IPFS:", error);
    
    // Test connection if upload fails
    const isConnected = await testPinataConnection();
    if (!isConnected) {
      throw new Error("Pinata service is not accessible. Please check your internet connection and try again.");
    }
    
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Upload image file to IPFS via Pinata
 * @param file - The image file to upload
 * @returns IPFS hash (CID)
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    console.log("📤 Uploading image to IPFS...", file.name);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must be less than 5MB");
    }

    const { IpfsHash } = await pinata.upload.file(file);
    console.log("✅ Image uploaded to IPFS:", IpfsHash);
  return IpfsHash;
  } catch (error) {
    console.error("❌ Failed to upload image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
}

/**
 * Upload video file to IPFS via Pinata
 * @param file - The video file to upload
 * @returns IPFS hash (CID)
 */
export async function uploadVideoToIPFS(file: File): Promise<string> {
  try {
    console.log("📤 Uploading video to IPFS...", file.name, file.size, file.type);
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      throw new Error("File must be a video");
    }

    // Validate file size (100MB limit for videos)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("Video size must be less than 100MB");
    }

    console.log("✅ Video validation passed, starting upload...");

    // Try to get video duration (but don't fail if it doesn't work)
    try {
      const duration = await getVideoDuration(file);
      console.log("📹 Video duration:", duration, "seconds");
      
      // Warn if duration is outside recommended range, but don't fail
      if (duration < 15 || duration > 60) {
        console.warn("⚠️ Video duration is outside recommended range (15-60 seconds):", duration);
      }
    } catch (durationError) {
      console.warn("⚠️ Could not determine video duration:", durationError);
    }

    console.log("🚀 Starting Pinata upload...");
    
    // Upload to Pinata with better error handling
    const result = await pinata.upload.file(file);
    
    if (!result || !result.IpfsHash) {
      throw new Error("Pinata upload failed - no hash returned");
    }
    
    console.log("✅ Video uploaded to IPFS:", result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error("❌ Failed to upload video to IPFS:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('size')) {
        throw new Error("Video file is too large. Please use a file smaller than 100MB.");
      } else if (error.message.includes('type')) {
        throw new Error("Please select a valid video file (MP4, MOV, AVI, etc.).");
      } else if (error.message.includes('Pinata')) {
        throw new Error("Upload service temporarily unavailable. Please try again in a few minutes.");
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
    
    throw new Error("Failed to upload video to IPFS");
  }
}

/**
 * Get video duration in seconds
 * @param file - The video file
 * @returns Duration in seconds
 */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error("Could not load video metadata"));
    };
    
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Generate video thumbnail from video file
 * @param file - The video file
 * @returns Base64 thumbnail data
 */
export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }
    
    video.onloadeddata = () => {
      // Set canvas size
      canvas.width = 400;
      canvas.height = 225; // 16:9 aspect ratio
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };
    
    video.onerror = () => {
      reject(new Error("Could not load video"));
    };
    
    video.src = URL.createObjectURL(file);
    video.currentTime = 1; // Seek to 1 second to get a good frame
  });
}

/**
 * Upload base64 image data to IPFS via Pinata
 * @param base64Data - Base64 encoded image data
 * @param filename - Name for the file
 * @returns IPFS hash (CID)
 */
export async function uploadBase64ImageToIPFS(base64Data: string, filename: string = "avatar.jpg"): Promise<string> {
  try {
    console.log("📤 Uploading base64 image to IPFS...");
    
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convert base64 to blob
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Create file from blob
    const file = new File([blob], filename, { type: 'image/jpeg' });
    
    return await uploadImageToIPFS(file);
  } catch (error) {
    console.error("❌ Failed to upload base64 image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
}

/**
 * Get IPFS gateway URL from hash
 * @param ipfsHash - IPFS hash (CID)
 * @returns Full URL to access the file
 */
export function getIPFSGatewayURL(ipfsHash: string): string {
  return `https://sapphire-following-turkey-778.mypinata.cloud/ipfs/${ipfsHash}`;
}

/**
 * Upload avatar image and return IPFS URL
 * @param imageData - Base64 image data or File object
 * @returns IPFS URL for the uploaded image
 */
export async function uploadAvatarToIPFS(imageData: string | File): Promise<string> {
  try {
    let ipfsHash: string;
    
    if (typeof imageData === 'string') {
      // Base64 data
      ipfsHash = await uploadBase64ImageToIPFS(imageData, "avatar.jpg");
    } else {
      // File object
      ipfsHash = await uploadImageToIPFS(imageData);
    }
    
    const ipfsUrl = getIPFSGatewayURL(ipfsHash);
    console.log("✅ Avatar uploaded to IPFS:", ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error("❌ Failed to upload avatar to IPFS:", error);
    throw error;
  }
}

/**
 * Upload highlight video and complete metadata to IPFS
 * @param videoFile - The video file to upload
 * @param metadata - The highlight metadata
 * @returns Object containing metadata IPFS hash and thumbnail URL
 */
export async function uploadHighlightToIPFS(
  videoFile: File,
  metadata: {
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
): Promise<{ metadataIpfsHash: string; thumbnailUrl: string }> {
  try {
    console.log("🎬 Starting highlight upload to IPFS...");
    console.log("📁 Video file:", videoFile.name, videoFile.size, videoFile.type);
    console.log("📋 Metadata:", metadata);
    
    // Step 1: Upload video file
    console.log("📤 Step 1: Uploading video file...");
    let videoIpfsHash: string;
    try {
      videoIpfsHash = await uploadVideoToIPFS(videoFile);
      console.log("✅ Video uploaded successfully:", videoIpfsHash);
    } catch (videoError) {
      console.error("❌ Video upload failed:", videoError);
      throw new Error(`Video upload failed: ${videoError instanceof Error ? videoError.message : 'Unknown error'}`);
    }
    
    // Step 2: Generate and upload thumbnail
    console.log("🖼️ Step 2: Generating thumbnail...");
    let thumbnailUrl: string;
    try {
      const thumbnailBase64 = await generateVideoThumbnail(videoFile);
      console.log("✅ Thumbnail generated");
      
      const thumbnailIpfsHash = await uploadBase64ImageToIPFS(thumbnailBase64, "thumbnail.jpg");
      console.log("✅ Thumbnail uploaded:", thumbnailIpfsHash);
      
      thumbnailUrl = getIPFSGatewayURL(thumbnailIpfsHash);
    } catch (thumbnailError) {
      console.error("❌ Thumbnail generation/upload failed:", thumbnailError);
      // Don't fail the entire upload if thumbnail fails, use a placeholder
      thumbnailUrl = "https://via.placeholder.com/400x225/1f2937/ffffff?text=Highlight+Video";
      console.log("⚠️ Using placeholder thumbnail");
    }
    
    // Step 3: Create complete metadata JSON with all highlight data
    console.log("📋 Step 3: Creating complete metadata...");
    const completeMetadata = {
      // Core highlight data
      title: metadata.title,
      description: metadata.description,
      sport: metadata.sport,
      position: metadata.position,
      skillsShowcased: metadata.skillsShowcased,
      tags: metadata.tags,
      duration: metadata.duration,
      
      // Game context
      opponent: metadata.opponent,
      gameDate: metadata.gameDate,
      competition: metadata.competition,
      result: metadata.result,
      
      // IPFS references
      videoIpfsHash: videoIpfsHash,
      thumbnailIpfsHash: thumbnailUrl.includes('placeholder') ? '' : thumbnailUrl.split('/').pop(),
      videoUrl: getIPFSGatewayURL(videoIpfsHash),
      thumbnailUrl: thumbnailUrl,
      
      // Metadata
      athleteAddress: metadata.athleteAddress,
      uploadedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      saves: 0,
      isActive: true,
      
      // Platform info
      version: "1.0.0",
      platform: "TalentFlow"
    };
    
    console.log("📋 Complete metadata created:", completeMetadata);
    
    // Step 4: Upload complete metadata to IPFS
    console.log("📤 Step 4: Uploading complete metadata to IPFS...");
    let metadataIpfsHash: string;
    try {
      metadataIpfsHash = await uploadJSONToIPFS(completeMetadata);
      console.log("✅ Metadata uploaded successfully:", metadataIpfsHash);
    } catch (metadataError) {
      console.error("❌ Metadata upload failed:", metadataError);
      throw new Error(`Metadata upload failed: ${metadataError instanceof Error ? metadataError.message : 'Unknown error'}`);
    }
    
    console.log("✅ Highlight upload completed successfully!", {
      metadataIpfsHash,
      thumbnailUrl,
      videoIpfsHash
    });
    
    return {
      metadataIpfsHash,
      thumbnailUrl
    };
  } catch (error) {
    console.error("❌ Failed to upload highlight to IPFS:", error);
    throw error;
  }
}

/**
 * Fetch metadata from IPFS
 * @param ipfsHash - IPFS hash of the metadata
 * @returns Parsed metadata object
 */
export async function fetchMetadataFromIPFS(ipfsHash: string): Promise<any> {
  try {
    console.log("📥 Fetching metadata from IPFS:", ipfsHash);
    const response = await fetch(getIPFSGatewayURL(ipfsHash));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    console.log("✅ Metadata fetched successfully");
    return metadata;
  } catch (error) {
    console.error("❌ Failed to fetch metadata from IPFS:", error);
    throw new Error("Failed to fetch metadata from IPFS");
  }
}

/**
 * Fetch video URL from IPFS
 * @param ipfsHash - IPFS hash of the video
 * @returns Video URL
 */
export function getVideoURLFromIPFS(ipfsHash: string): string {
  return getIPFSGatewayURL(ipfsHash);
}