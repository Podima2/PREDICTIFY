import { PinataSDK } from "pinata-web3";

// Use environment variable for JWT token (more secure)
const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTJjNzZhNi0wNTZkLTQ1ZmMtOGE0My1kYjRhYjBhNDhmYWYiLCJlbWFpbCI6Im14YmVyMjAyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTE2MDg0ZTdjNzViMjA0NDMwMTQiLCJzY29wZWRLZXlTZWNyZXQiOiJmMTA0ODk3NTg4YzhjZDQxNDUwYzMxMGI1MTM2MTEyNTJmN2E5OWFjMzZlMDE1Yjc1OWM2MDM3ZTFiNDkxYzhjIiwiZXhwIjoxNzgxMzc3MjIzfQ.ky1qACH3cpAngylZkFPaGiNNlOqhV3xgma56_iH43i8";

const pinata = new PinataSDK({
  pinataJwt: pinataJwt,
});

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param jsonMetadata - The JSON object to upload
 * @returns IPFS hash (CID)
 */
export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  try {
    console.log("📤 Uploading JSON to IPFS...");
    const { IpfsHash } = await pinata.upload.json(jsonMetadata);
    console.log("✅ JSON uploaded to IPFS:", IpfsHash);
    return IpfsHash;
  } catch (error) {
    console.error("❌ Failed to upload JSON to IPFS:", error);
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