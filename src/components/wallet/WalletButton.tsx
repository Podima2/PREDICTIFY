import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Zap } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export const WalletButton: React.FC = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const primaryWallet = wallets.length > 0 ? wallets[0] : null;
  const address = primaryWallet?.address;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openBlockExplorer = () => {
    if (address) {
      window.open(`https://spicy-explorer.chiliz.com/address/${address}`, '_blank');
    }
  };

  if (!ready) {
    return (
      <div className="w-32 h-10 bg-neutral-900 border border-red-900/30 rounded-xl animate-pulse"></div>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/20 tracking-wide text-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>CONNECT WALLET</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-neutral-900 border border-red-900/30 hover:bg-red-900/20 hover:border-red-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm font-semibold tracking-wide"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <Zap className="w-4 h-4 text-red-400" />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-left">
            <div className="font-semibold">
              {address ? formatAddress(address) : 'Connected'}
            </div>
            <div className="text-xs text-red-400 font-medium -mt-0.5">
              Chiliz Chain
            </div>
          </div>
          
          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-950 border border-red-900/30 rounded-xl p-2 min-w-[280px] z-50 animate-scale-in shadow-xl">
          {/* User Info Section */}
          <div className="px-3 py-3 border-b border-red-900/30 mb-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Connected Account</div>
                <div className="text-xs text-red-400">
                  Chiliz Chain • CHZ
                </div>
              </div>
            </div>
            
            {address && (
              <div className="space-y-2">
                <div className="text-xs text-neutral-400 font-medium">Wallet Address</div>
                <div className="text-xs text-neutral-300 font-mono break-all bg-neutral-900 p-2 rounded-lg border border-red-900/20">
                  {address}
                </div>
              </div>
            )}
          </div>
          
          {/* Wallet Actions */}
          <div className="space-y-1 mb-2">
            <div className="px-3 py-1">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Wallet Actions
              </div>
            </div>
            
            {address && (
              <>
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>
                
                <button
                  onClick={openBlockExplorer}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on ChilizScan</span>
                </button>
              </>
            )}
          </div>

          {/* Fan Token Balance (Mock) */}
          <div className="space-y-1 mb-2">
            <div className="px-3 py-1">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Fan Tokens
              </div>
            </div>
            
            <div className="px-3 py-2 text-xs text-neutral-400 bg-neutral-900 rounded-lg mx-2 border border-red-900/20">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">CHZ</span>
                <span className="text-white font-mono">1,250.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">$BAR</span>
                <span className="text-white font-mono">45.50</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-red-900/30 my-1"></div>
          
          {/* Disconnect */}
          <button
            onClick={() => {
              logout();
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};