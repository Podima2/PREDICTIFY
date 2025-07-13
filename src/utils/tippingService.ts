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
    sendTransaction?: any
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      console.log(`Sending tip: ${amount} ${tokenType} from ${fromAddress} to ${toAddress}`);

      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid tip amount');
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
      const amountInWei = parseEther(amount.toString());

      let transactionHash: string;

      if (tokenType === 'chz') {
        // Native CHZ transfer
        if (!sendTransaction) {
          throw new Error('Send transaction function not available');
        }
        transactionHash = await this.transferNativeCHZ(
          toAddress,
          amountInWei,
          sendTransaction
        );
      } else {
        // ERC20 token transfer
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

      console.log(`Tip sent successfully: ${transactionHash}`);

      return {
        success: true,
        transactionHash
      };

    } catch (error) {
      console.error('Failed to send tip:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
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
    sendTransaction: any
  ): Promise<string> {
    try {
      const result = await sendTransaction({
        to: toAddress as `0x${string}`,
        value: amountInWei,
      });

      return result.hash;
    } catch (error) {
      console.error('Native CHZ transfer failed:', error);
      throw new Error('Failed to transfer CHZ tokens');
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
      const result = await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, amountInWei]
      });

      return result.hash;
    } catch (error) {
      console.error('ERC20 token transfer failed:', error);
      throw new Error('Failed to transfer tokens');
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