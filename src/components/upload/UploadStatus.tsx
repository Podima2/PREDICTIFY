import React from 'react';
import { CheckCircle, AlertCircle, Hash, ExternalLink } from 'lucide-react';

interface UploadStatusProps {
  status: 'success' | 'uploading' | 'minting' | 'error';
  errorMessage?: string;
  uploadProgress?: string;
  transactionHash?: string;
  onReset: () => void;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({
  status,
  errorMessage,
  uploadProgress,
  transactionHash,
  onReset
}) => {
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Upload & Mint Successful! 🎉</h2>
          <p className="text-neutral-400 mb-6">
            Your highlight video has been uploaded to IPFS and minted on the blockchain. Scouts can now discover your talent!
          </p>
          
          {transactionHash && (
            <div className="mb-6 p-4 bg-neutral-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-400">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-mono">Transaction Hash:</span>
                </div>
                <a
                  href={`https://testnet.bscscan.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-neutral-400 mt-2 font-mono break-all">
                {transactionHash}
              </p>
            </div>
          )}
          
          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Upload Another Video
          </button>
        </div>
      </div>
    );
  }

  if (status === 'uploading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              Uploading to IPFS...
            </h3>
            <p className="text-neutral-400">
              Your highlight video is being uploaded to IPFS
            </p>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Uploading video to IPFS...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Generating thumbnail...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Preparing metadata...</span>
            </div>
          </div>
          
          {uploadProgress && (
            <div className="mt-4 p-3 bg-neutral-900 rounded-lg">
              <p className="text-neutral-300 text-sm">{uploadProgress}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'minting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              Minting on Blockchain...
            </h3>
            <p className="text-neutral-400">
              Your highlight is being registered on the blockchain
            </p>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Creating smart contract transaction...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Waiting for network confirmation...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></div>
              <span className="text-neutral-300">Registering highlight metadata...</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-neutral-900 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400">
              <Hash className="w-4 h-4" />
              <span className="text-sm font-mono">Minting in progress...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-red-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Upload Failed</h2>
          <p className="text-red-300 mb-6">
            {errorMessage || 'An error occurred during upload. Please try again.'}
          </p>
          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}; 