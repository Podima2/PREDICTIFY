import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSendTransaction } from 'wagmi';
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
}

export function useTipping(): UseTippingReturn {
  const { address } = useAccount();
  const [isTipping, setIsTipping] = useState(false);
  const [pendingTransactionHash, setPendingTransactionHash] = useState<string | undefined>();

  // Wagmi hooks for contract interactions
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const { sendTransaction, isPending: isSendPending } = useSendTransaction();

  // Wait for transaction receipt
  const { isLoading: isTransactionPending } = useWaitForTransactionReceipt({
    hash: pendingTransactionHash as `0x${string}` | undefined,
  });

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

    setIsTipping(true);
    setPendingTransactionHash(undefined);

    try {
      console.log(`Initiating tip: ${amount} ${tokenType} to ${toAddress}`);

      const result = await tippingService.sendTip(
        highlightId,
        amount,
        tokenType,
        address,
        toAddress,
        writeContract,
        sendTransaction
      );

      if (result.success && result.transactionHash) {
        setPendingTransactionHash(result.transactionHash);
        console.log(`Tip transaction submitted: ${result.transactionHash}`);
      }

      return result;

    } catch (error) {
      console.error('Tip failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsTipping(false);
    }
  }, [address, writeContract]);

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

  return {
    sendTip,
    isTipping: isTipping || isWritePending || isSendPending,
    tipHistory: getTipHistory(),
    getTipHistory,
    getHighlightTips,
    getTotalTipsReceived,
    getTotalTipsSent,
    pendingTransactionHash,
    isTransactionPending
  };
} 