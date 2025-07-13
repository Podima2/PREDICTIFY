import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Hash, ExternalLink } from 'lucide-react';

interface MintingStatusProps {
  status: 'minting' | 'success' | 'error';
  transactionHash?: string;
  errorMessage?: string;
  onReset: () => void;
}

export const MintingStatus: React.FC<MintingStatusProps> = ({
  status,
  transactionHash,
  errorMessage,
  onReset
}) => {
  const getExplorerUrl = (hash: string) => {
    // You can customize this based on your blockchain network
    return `https://testnet.chiliscan.com/tx/${hash}`;
  };

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

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Minting Successful! 🎉</h2>
          <p className="text-neutral-400 mb-6">
            Your highlight has been successfully minted on the blockchain and is now discoverable by scouts!
          </p>
          
          {transactionHash && (
            <div className="mb-6 p-4 bg-neutral-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-400">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-mono">Transaction Hash:</span>
                </div>
                <a
                  href={getExplorerUrl(transactionHash)}
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
            Mint Another Highlight
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-red-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Minting Failed</h2>
          <p className="text-red-300 mb-6">
            {errorMessage || 'An error occurred during minting. Please try again.'}
          </p>
          
          {transactionHash && (
            <div className="mb-6 p-4 bg-neutral-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-400">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-mono">Failed Transaction:</span>
                </div>
                <a
                  href={getExplorerUrl(transactionHash)}
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