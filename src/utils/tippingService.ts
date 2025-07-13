import { parseEther, formatEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Chiliz token contract addresses (testnet)
const TOKEN_ADDRESSES = {
  chz: '0x0000000000000000000000000000000000000000', // Native CHZ
  psg: '0x2d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // PSG Fan Token
  bar: '0x3d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // BAR Fan Token
  juv: '0x4d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // JUV Fan Token
  acm: '0x5d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // ACM Fan Token
  man: '0x6d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // MAN Fan Token
  ars: '0x7d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // ARS Fan Token
  atm: '0x8d6442d3d9f938e13bdd9c1d2c2b3b3c3c3c3c3c', // ATM Fan Token
};

// ERC20 ABI for token transfers
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

export interface TipTransaction {
  highlightId: number;
  amount: number;
  tokenType: string;
  tokenSymbol: string;
  fromAddress: string;
  toAddress: string;
  transactionHash?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

export class TippingService {
  private static instance: TippingService;
  private tipHistory: TipTransaction[] = [];

  public static getInstance(): TippingService {
    if (!TippingService.instance) {
      TippingService.instance = new TippingService();
    }
    return TippingService.instance;
  }

  /**
   * Send a tip to an athlete
   */
  async sendTip(
    highlightId: number,
    amount: number,
    tokenType: string,
    fromAddress: string,
    toAddress: string,
    writeContract: any,
    sendTransaction?: any,
    getBalance?: any
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      console.log(`🚀 Initiating tip: ${amount} ${tokenType} from ${fromAddress} to ${toAddress}`);

      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid tip amount');
      }

      // Check for minimum amount (0.01 CHZ to avoid very small amounts that get auto-rejected)
      if (amount < 0.01) {
        throw new Error('Tip amount is too small. Minimum amount is 0.01 CHZ');
      }

      // Check for maximum amount to prevent accidental large transfers
      if (amount > 1000) {
        throw new Error('Tip amount is too large. Maximum amount is 1000 CHZ');
      }

      if (!fromAddress || !toAddress) {
        throw new Error('Invalid addresses');
      }

      if (fromAddress === toAddress) {
        throw new Error('Cannot tip yourself');
      }

      const tokenAddress = TOKEN_ADDRESSES[tokenType as keyof typeof TOKEN_ADDRESSES];
      if (!tokenAddress) {
        throw new Error('Unsupported token type');
      }

      // Convert amount to wei (assuming 18 decimals for most tokens)
      const amountInWei = parseEther(amount.toFixed(18));
      console.log(`💰 Amount in wei: ${amountInWei.toString()}`);

      // Check balance if getBalance function is provided
      if (getBalance && tokenType === 'chz') {
        try {
          const balance = await getBalance();
          console.log(`💳 Current balance: ${formatEther(balance)} CHZ`);
          
          if (balance < amountInWei) {
            throw new Error(`Insufficient balance. You have ${formatEther(balance)} CHZ, but trying to send ${amount} CHZ`);
          }
        } catch (balanceError) {
          console.warn('Could not check balance:', balanceError);
        }
      }

      let transactionHash: string;

      if (tokenType === 'chz') {
        // Native CHZ transfer
        if (!sendTransaction) {
          throw new Error('Send transaction function not available');
        }
        
        console.log('🔄 Executing native CHZ transfer...');
        transactionHash = await this.transferNativeCHZ(
          toAddress,
          amountInWei,
          sendTransaction
        );
      } else {
        // ERC20 token transfer
        console.log('🔄 Executing ERC20 token transfer...');
        transactionHash = await this.transferERC20Token(
          tokenAddress,
          toAddress,
          amountInWei,
          writeContract
        );
      }

      // Record the transaction
      const tipTransaction: TipTransaction = {
        highlightId,
        amount,
        tokenType,
        tokenSymbol: this.getTokenSymbol(tokenType),
        fromAddress,
        toAddress,
        transactionHash,
        status: 'pending',
        timestamp: Date.now()
      };

      this.tipHistory.push(tipTransaction);

      console.log(`✅ Tip transaction submitted successfully: ${transactionHash}`);

      return {
        success: true,
        transactionHash
      };

    } catch (error) {
      console.error('❌ Failed to send tip:', error);
      
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
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Transfer native CHZ tokens
   */
  private async transferNativeCHZ(
    toAddress: string,
    amountInWei: bigint,
    sendTransactionAsync: any
  ): Promise<string> {
    try {
      console.log(`💸 Sending ${formatEther(amountInWei)} CHZ to ${toAddress}`);
      
      // Prepare transaction with better parameters to prevent auto-rejection
      const transactionRequest = {
        to: toAddress,
        value: amountInWei,
        // Add explicit gas limit to prevent estimation issues
        gas: 21000n, // Standard gas limit for simple transfers
      };

      console.log('📝 Transaction request:', transactionRequest);
      
      // Send the transaction using sendTransactionAsync
      const result = await sendTransactionAsync(transactionRequest);

      console.log('📝 Transaction result:', result);
      
      // sendTransactionAsync should return the transaction hash directly
      if (!result) {
        console.log('⚠️ Transaction result is undefined');
        throw new Error('Transaction failed - no result returned');
      }
      
      // The result should be the transaction hash
      if (typeof result === 'string') {
        console.log('✅ Transaction hash received:', result);
        return result;
      }
      
      // If it's an object with hash property
      if (result && typeof result === 'object' && result.hash) {
        console.log('✅ Transaction hash received:', result.hash);
        return result.hash;
      }
      
      throw new Error('Transaction failed - no hash returned');

    } catch (error) {
      console.error('❌ Native CHZ transfer failed:', error);
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient CHZ balance in your wallet');
        } else if (error.message.includes('user denied') || error.message.includes('cancelled') || error.message.includes('denied')) {
          throw new Error('Transaction was cancelled by user');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again');
        } else if (error.message.includes('gas')) {
          throw new Error('Gas estimation failed. Please try again');
        } else if (error.message.includes('rejected')) {
          throw new Error('Transaction was rejected');
        } else if (error.message.includes('nonce')) {
          throw new Error('Transaction nonce error. Please try again');
        } else if (error.message.includes('replacement')) {
          throw new Error('Transaction replacement error. Please try again');
        }
      }
      
      // If it's a user rejection (code 4001), handle it specifically
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        throw new Error('Transaction was cancelled by user');
      }
      
      throw new Error('Failed to transfer CHZ tokens. Please try again.');
    }
  }

  /**
   * Transfer ERC20 tokens
   */
  private async transferERC20Token(
    tokenAddress: string,
    toAddress: string,
    amountInWei: bigint,
    writeContract: any
  ): Promise<string> {
    try {
      console.log(`💸 Sending ${formatEther(amountInWei)} tokens from ${tokenAddress} to ${toAddress}`);
      
      const result = await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, amountInWei]
      });

      console.log('📝 ERC20 transaction result:', result);
      
      if (!result || !result.hash) {
        throw new Error('ERC20 transaction failed - no hash returned');
      }

      return result.hash;
    } catch (error) {
      console.error('❌ ERC20 token transfer failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient token balance');
        } else if (error.message.includes('user rejected')) {
          throw new Error('Transaction was cancelled');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again');
        }
      }
      
      throw new Error('Failed to transfer tokens. Please try again.');
    }
  }

  /**
   * Get token symbol
   */
  private getTokenSymbol(tokenType: string): string {
    const symbols: { [key: string]: string } = {
      chz: 'CHZ',
      psg: 'PSG',
      bar: 'BAR',
      juv: 'JUV',
      acm: 'ACM',
      man: 'CITY',
      ars: 'AFC',
      atm: 'ATM'
    };

    return symbols[tokenType] || tokenType.toUpperCase();
  }

  /**
   * Get tip history for a user
   */
  getTipHistory(address: string): TipTransaction[] {
    return this.tipHistory.filter(
      tip => tip.fromAddress === address || tip.toAddress === address
    );
  }

  /**
   * Get tip history for a specific highlight
   */
  getHighlightTips(highlightId: number): TipTransaction[] {
    return this.tipHistory.filter(tip => tip.highlightId === highlightId);
  }

  /**
   * Update transaction status
   */
  updateTransactionStatus(transactionHash: string, status: 'success' | 'failed'): void {
    const transaction = this.tipHistory.find(tip => tip.transactionHash === transactionHash);
    if (transaction) {
      transaction.status = status;
    }
  }

  /**
   * Get total tips received by an address
   */
  getTotalTipsReceived(address: string): { [tokenType: string]: number } {
    const receivedTips = this.tipHistory.filter(
      tip => tip.toAddress === address && tip.status === 'success'
    );

    const totals: { [tokenType: string]: number } = {};
    receivedTips.forEach(tip => {
      totals[tip.tokenType] = (totals[tip.tokenType] || 0) + tip.amount;
    });

    return totals;
  }

  /**
   * Get total tips sent by an address
   */
  getTotalTipsSent(address: string): { [tokenType: string]: number } {
    const sentTips = this.tipHistory.filter(
      tip => tip.fromAddress === address && tip.status === 'success'
    );

    const totals: { [tokenType: string]: number } = {};
    sentTips.forEach(tip => {
      totals[tip.tokenType] = (totals[tip.tokenType] || 0) + tip.amount;
    });

    return totals;
  }
}

// Export singleton instance
export const tippingService = TippingService.getInstance(); 