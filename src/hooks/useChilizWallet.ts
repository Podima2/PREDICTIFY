import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

interface ChilizWalletState {
  address: string | null;
  chzBalance: number;
  fanTokens: FanTokenBalance[];
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface FanTokenBalance {
  symbol: string;
  name: string;
  balance: number;
  logo: string;
  teamId: string;
}

export const useChilizWallet = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [walletState, setWalletState] = useState<ChilizWalletState>({
    address: null,
    chzBalance: 0,
    fanTokens: [],
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Get the primary wallet (first connected wallet)
  const primaryWallet = wallets.length > 0 ? wallets[0] : null;

  useEffect(() => {
    if (!ready) {
      setWalletState(prev => ({ ...prev, isConnecting: true }));
      return;
    }

    // Only consider connected if user is authenticated AND we have an actual wallet with an address
    if (authenticated && primaryWallet && primaryWallet.address) {
      console.log('✅ Chiliz wallet connected:', { address: primaryWallet.address, authenticated });
      
      // Mock fan token balances - in production, fetch from Chiliz Chain
      const mockFanTokens: FanTokenBalance[] = [
        { symbol: 'CHZ', name: 'Chiliz', balance: 1250.00, logo: '🌶️', teamId: 'chiliz' },
        { symbol: 'BAR', name: 'FC Barcelona', balance: 45.50, logo: '🔵', teamId: 'barcelona' },
        { symbol: 'PSG', name: 'Paris Saint-Germain', balance: 23.75, logo: '🔴', teamId: 'psg' },
        { symbol: 'JUV', name: 'Juventus', balance: 12.30, logo: '⚫', teamId: 'juventus' },
        { symbol: 'ATM', name: 'Atlético Madrid', balance: 8.90, logo: '🔴', teamId: 'atletico' }
      ];

      setWalletState({
        address: primaryWallet.address,
        chzBalance: 1250.00, // Mock CHZ balance
        fanTokens: mockFanTokens,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } else {
      console.log('❌ Chiliz wallet not connected:', { authenticated, hasWallet: !!primaryWallet, hasAddress: !!primaryWallet?.address });
      setWalletState({
        address: null,
        chzBalance: 0,
        fanTokens: [],
        isConnected: false,
        isConnecting: false,
        error: null,
      });
    }
  }, [ready, authenticated, primaryWallet]);

  const connectWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = async () => {
    try {
      console.log('🔌 Attempting to disconnect Chiliz wallet...');
      
      // Check if we're in a valid state to logout
      if (!ready) {
        console.log('⚠️ Privy not ready, skipping logout');
        setWalletState({
          address: null,
          chzBalance: 0,
          fanTokens: [],
          isConnected: false,
          isConnecting: false,
          error: null,
        });
        return;
      }

      if (!authenticated) {
        console.log('⚠️ User not authenticated, skipping logout');
        setWalletState({
          address: null,
          chzBalance: 0,
          fanTokens: [],
          isConnected: false,
          isConnecting: false,
          error: null,
        });
        return;
      }

      // Attempt logout
      await logout();
      console.log('✅ Chiliz wallet disconnected successfully');
      
      setWalletState({
        address: null,
        chzBalance: 0,
        fanTokens: [],
        isConnected: false,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Failed to disconnect Chiliz wallet:', error);
      
      // Even if logout fails, we should still reset our local state
      setWalletState({
        address: null,
        chzBalance: 0,
        fanTokens: [],
        isConnected: false,
        isConnecting: false,
        error: 'Failed to disconnect',
      });
      
      // Don't throw the error to prevent UI crashes
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getFanTokenBalance = (symbol: string): number => {
    const token = walletState.fanTokens.find(t => t.symbol === symbol);
    return token ? token.balance : 0;
  };

  const tipPredictor = async (predictorAddress: string, amount: number, tokenSymbol: string = 'CHZ') => {
    // Mock tipping function - in production, this would interact with smart contracts
    console.log(`Tipping ${amount} ${tokenSymbol} to ${predictorAddress}`);
    
    // Simulate transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
          success: true
        });
      }, 2000);
    });
  };

  return {
    // Wallet state
    address: walletState.address,
    chzBalance: walletState.chzBalance,
    fanTokens: walletState.fanTokens,
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting,
    error: walletState.error,
    
    // Privy state
    ready,
    authenticated,
    user,
    
    // Wallet actions
    connectWallet,
    disconnectWallet,
    tipPredictor,
    
    // Utility functions
    formatAddress,
    getFanTokenBalance,
    
    // Additional features
    wallets,
    primaryWallet,
  };
};