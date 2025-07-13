import React, { useState } from 'react';
import { X, Gift, Coins, AlertCircle, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { useTipping } from '../../hooks/useTipping';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
  athleteAddress: string;
  highlightId: number;
}

interface TokenOption {
  value: string;
  label: string;
  symbol: string;
  icon: string;
}

const tokenOptions: TokenOption[] = [
  { value: 'chz', label: 'Chiliz', symbol: 'CHZ', icon: '⚡' },
  { value: 'psg', label: 'Paris Saint-Germain', symbol: 'PSG', icon: '⚽' },
  { value: 'bar', label: 'FC Barcelona', symbol: 'BAR', icon: '🔵' },
  { value: 'juv', label: 'Juventus', symbol: 'JUV', icon: '⚪' },
  { value: 'acm', label: 'AC Milan', symbol: 'ACM', icon: '🔴' },
  { value: 'man', label: 'Manchester City', symbol: 'CITY', icon: '💙' },
  { value: 'ars', label: 'Arsenal', symbol: 'AFC', icon: '❤️' },
  { value: 'atm', label: 'Atletico Madrid', symbol: 'ATM', icon: '🔴' },
];

const tipAmounts = [
  { value: 0.01, label: '0.01', popular: false },
  { value: 0.1, label: '0.1', popular: false },
  { value: 1, label: '1', popular: true },
  { value: 5, label: '5', popular: false },
  { value: 10, label: '10', popular: false },
  { value: 25, label: '25', popular: false },
];

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  athleteName,
  athleteAddress,
  highlightId
}) => {
  const [selectedToken, setSelectedToken] = useState<string>('chz');
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Use centralized tipping state
  const { sendTip, isTipping, tipError, clearTipError } = useTipping();

  const selectedTokenInfo = tokenOptions.find(token => token.value === selectedToken);
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleTip = async () => {
    if (!selectedTokenInfo || !finalAmount || finalAmount <= 0) {
      return;
    }

    // Check for minimum amount
    if (finalAmount < 0.01) {
      return;
    }

    try {
      console.log(`🎁 TipModal: Sending tip of ${finalAmount} ${selectedToken} to ${athleteName}`);
      
      const result = await sendTip(highlightId, finalAmount, selectedToken, athleteAddress);
      
      if (result.success) {
        setSuccess(true);
        
        // Auto-close after showing success message
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      }
      
    } catch (err) {
      console.error('❌ TipModal: Tip failed:', err);
      // Error is handled by useTipping hook
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setCustomAmount('');
    setSelectedAmount(1);
    setSelectedToken('chz');
    clearTipError();
  };

  const handleClose = () => {
    if (!isTipping) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Tip</h2>
              <p className="text-neutral-400 text-sm">Support {athleteName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isTipping}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {isTipping ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Transaction...</h3>
              <p className="text-neutral-400">
                Please wait while your tip is being processed on the blockchain
              </p>
              <div className="mt-4 text-sm text-neutral-500">
                Don't close this window or refresh the page
              </div>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tip Sent Successfully!</h3>
              <p className="text-neutral-400 mb-6">
                Your tip of {finalAmount} {selectedTokenInfo?.symbol} has been sent to {athleteName}
              </p>
              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-3">
                  Select Token
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {tokenOptions.slice(0, 4).map((token) => (
                    <button
                      key={token.value}
                      onClick={() => setSelectedToken(token.value)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                        selectedToken === token.value
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{token.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{token.symbol}</div>
                          <div className="text-xs opacity-70">{token.label}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* More tokens dropdown */}
                {tokenOptions.length > 4 && (
                  <div className="mt-3">
                    <CustomSelect
                      value={selectedToken}
                      onChange={setSelectedToken}
                      options={tokenOptions.map(token => ({
                        value: token.value,
                        label: `${token.icon} ${token.symbol} - ${token.label}`
                      }))}
                      placeholder="Or select another token"
                    />
                  </div>
                )}
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-3">
                  Tip Amount ({selectedTokenInfo?.symbol})
                </label>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {tipAmounts.map((amount) => (
                    <button
                      key={amount.value}
                      onClick={() => {
                        setSelectedAmount(amount.value);
                        setCustomAmount('');
                      }}
                      className={`relative p-3 rounded-xl border transition-all duration-200 font-medium text-sm ${
                        selectedAmount === amount.value && !customAmount
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold">{amount.label}</div>
                        {amount.popular && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                            Popular
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    placeholder="Enter custom amount"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 font-medium focus:outline-none pr-16"
                    min="0.01"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm font-semibold">
                    {selectedTokenInfo?.symbol}
                  </div>
                </div>
              </div>

              {/* Tip Preview */}
              <div className="bg-gradient-to-r from-yellow-950/50 to-orange-950/50 border border-yellow-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-300 font-medium">You're sending:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedTokenInfo?.icon}</span>
                    <span className="text-white font-bold text-lg">
                      {finalAmount || 0} {selectedTokenInfo?.symbol}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">To athlete:</span>
                  <span className="text-white font-medium font-mono">{athleteName}</span>
                </div>
              </div>

              {/* Error Message */}
              {tipError && (
                <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-medium">Transaction Failed</p>
                    <p className="text-red-400 text-sm">{tipError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={handleClose}
                  disabled={isTipping}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTip}
                  disabled={isTipping || !finalAmount || finalAmount <= 0 || finalAmount < 0.01}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isTipping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Send Tip</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};