import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSendTransaction, useBalance } from 'wagmi';
import { tippingService, TipTransaction } from '../utils/tippingService';
import { parseEther } from 'viem';

export interface UseTippingReturn {
  sendTip: (highlightId: number, amount: number, tokenType: string, toAddress: string) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
  isTipping: boolean;
  tipHistory: TipTransaction[];
  getTipHistory: (address?: string) => TipTransaction[];
  getHighlightTips: (highlightId: number) => TipTransaction[];
  getTotalTipsReceived: (address?: string) => { [tokenType: string]: number };
  getTotalTipsSent: (address?: string) => { [tokenType: string]: number };
  pendingTransactionHash?: string;
  isTransactionPending: boolean;
  balance?: bigint;
  isBalanceLoading: boolean;
  tipError: string | null;
  clearTipError: () => void;
}

export function useTipping(): UseTippingReturn {
  const { address } = useAccount();
  const [pendingTransactionHash, setPendingTransactionHash] = useState<string | undefined>();
  const [tipError, setTipError] = useState<string | null>(null);

  // Wagmi hooks for contract interactions
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();
  const { sendTransactionAsync, isPending: isSendPending, error: sendError } = useSendTransaction();

  // Get user's CHZ balance
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  // Wait for transaction receipt
  const { isLoading: isTransactionPending, isSuccess: isTransactionSuccess, isError: isTransactionError, error: transactionError } = useWaitForTransactionReceipt({
    hash: pendingTransactionHash as `0x${string}` | undefined,
  });

  // Clear tip error
  const clearTipError = useCallback(() => {
    setTipError(null);
  }, []);

  /**
   * Send a tip to an athlete
   */
  const sendTip = useCallback(async (
    highlightId: number,
    amount: number,
    tokenType: string,
    toAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    if (!address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    // Clear previous errors and transaction hash
    setTipError(null);
    setPendingTransactionHash(undefined);

    try {
      console.log(`🎯 useTipping: Initiating tip: ${amount} ${tokenType} to ${toAddress}`);

      // Pre-check balance for CHZ transfers
      if (tokenType === 'chz' && balance) {
        const amountInWei = parseEther(amount.toFixed(18));
        if (balance.value < amountInWei) {
          const errorMsg = `Insufficient CHZ balance. You have ${balance.formatted} CHZ, but trying to send ${amount} CHZ`;
          setTipError(errorMsg);
          return {
            success: false,
            error: errorMsg
          };
        }
        console.log(`✅ Balance check passed: ${balance.formatted} CHZ available`);
      }

      const result = await tippingService.sendTip(
        highlightId,
        amount,
        tokenType,
        address,
        toAddress,
        writeContract,
        sendTransactionAsync,
        () => balance?.value // Pass balance getter function
      );

      if (result.success && result.transactionHash) {
        setPendingTransactionHash(result.transactionHash);
        console.log(`📝 Tip transaction submitted: ${result.transactionHash}`);
      } else if (result.error) {
        setTipError(result.error);
      }

      return result;

    } catch (error) {
      console.error('❌ useTipping: Tip failed:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (error.message.includes('insufficient funds') || error.message.includes('Insufficient')) {
          errorMessage = 'Insufficient funds in your wallet';
        } else if (error.message.includes('user denied') || error.message.includes('cancelled') || error.message.includes('denied') || error.message.includes('rejected')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection';
        } else if (error.message.includes('gas')) {
          errorMessage = 'Gas estimation failed. Please try again';
        } else if (error.message.includes('wallet not connected')) {
          errorMessage = 'Please connect your wallet first';
        }
      }
      
      // Handle MetaMask specific errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code;
        if (errorCode === 4001) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (errorCode === -32603) {
          errorMessage = 'Network error. Please check your connection';
        } else if (errorCode === -32000) {
          errorMessage = 'Insufficient funds in your wallet';
        }
      }
      
      setTipError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [address, writeContract, sendTransactionAsync, balance]);

  /**
   * Get tip history for a specific address or current user
   */
  const getTipHistory = useCallback((userAddress?: string): TipTransaction[] => {
    const targetAddress = userAddress || address;
    if (!targetAddress) return [];
    
    return tippingService.getTipHistory(targetAddress);
  }, [address]);

  /**
   * Get tips for a specific highlight
   */
  const getHighlightTips = useCallback((highlightId: number): TipTransaction[] => {
    return tippingService.getHighlightTips(highlightId);
  }, []);

  /**
   * Get total tips received by an address
   */
  const getTotalTipsReceived = useCallback((userAddress?: string): { [tokenType: string]: number } => {
    const targetAddress = userAddress || address;
    if (!targetAddress) return {};
    
    return tippingService.getTotalTipsReceived(targetAddress);
  }, [address]);

  /**
   * Get total tips sent by an address
   */
  const getTotalTipsSent = useCallback((userAddress?: string): { [tokenType: string]: number } => {
    const targetAddress = userAddress || address;
    if (!targetAddress) return {};
    
    return tippingService.getTotalTipsSent(targetAddress);
  }, [address]);

  // Compute isTipping based on Wagmi hook states
  const isTipping = isWritePending || isSendPending || isTransactionPending;

  return {
    sendTip,
    isTipping,
    tipHistory: getTipHistory(),
    getTipHistory,
    getHighlightTips,
    getTotalTipsReceived,
    getTotalTipsSent,
    pendingTransactionHash,
    isTransactionPending: isTransactionPending || isTipping,
    balance: balance?.value,
    isBalanceLoading,
    tipError,
    clearTipError
  };
} 