import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  chainId: number | null;
}

export const useWallet = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    connectWallet,
    linkWallet 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    chainId: null,
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
      console.log('✅ Wallet connected:', { address: primaryWallet.address, authenticated });
      setWalletState({
        address: primaryWallet.address,
        balance: '0', // We'll fetch this separately if needed
        isConnected: true,
        isConnecting: false,
        error: null,
        chainId: primaryWallet.chainId ? parseInt(primaryWallet.chainId) : null,
      });
    } else {
      console.log('❌ Wallet not connected:', { authenticated, hasWallet: !!primaryWallet, hasAddress: !!primaryWallet?.address });
      setWalletState({
        address: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
      });
    }
  }, [ready, authenticated, primaryWallet]);

  const connectWalletHandler = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      if (!authenticated) {
        // If user is not authenticated, trigger login
        await login();
      } else {
        // If user is authenticated but no wallet, connect/link wallet
        await connectWallet();
      }
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
      console.log('🔌 Attempting to disconnect wallet...');
      
      // Check if we're in a valid state to logout
      if (!ready) {
        console.log('⚠️ Privy not ready, skipping logout');
        setWalletState({
          address: null,
          balance: null,
          isConnected: false,
          isConnecting: false,
          error: null,
          chainId: null,
        });
        return;
      }

      if (!authenticated) {
        console.log('⚠️ User not authenticated, skipping logout');
        setWalletState({
          address: null,
          balance: null,
          isConnected: false,
          isConnecting: false,
          error: null,
          chainId: null,
        });
        return;
      }

      // Attempt logout
      await logout();
      console.log('✅ Wallet disconnected successfully');
      
      setWalletState({
        address: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
      });
    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error);
      
      // Even if logout fails, we should still reset our local state
      setWalletState({
        address: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: 'Failed to disconnect',
        chainId: null,
      });
      
      // Don't throw the error to prevent UI crashes
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  const switchChain = async (chainId: number) => {
    if (primaryWallet && 'switchChain' in primaryWallet) {
      try {
        await primaryWallet.switchChain(chainId);
      } catch (error) {
        console.error('Failed to switch chain:', error);
        setWalletState(prev => ({
          ...prev,
          error: 'Failed to switch chain',
        }));
      }
    }
  };

  return {
    // Wallet state
    address: walletState.address,
    balance: walletState.balance,
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting,
    error: walletState.error,
    chainId: walletState.chainId,
    
    // Privy state
    ready,
    authenticated,
    user,
    
    // Wallet actions
    connectWallet: connectWalletHandler,
    disconnectWallet,
    switchChain,
    
    // Utility functions
    formatAddress,
    formatBalance,
    
    // Additional Privy features
    linkWallet,
    wallets,
    primaryWallet,
  };
};