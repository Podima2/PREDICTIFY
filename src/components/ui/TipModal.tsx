import React, { useState } from 'react';
import { X, Gift, Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
  onTip: (amount: number, tokenType: string) => Promise<void>;
}

interface TokenOption {
  value: string;
  label: string;
  symbol: string;
  icon: string;
}

const tokenOptions: TokenOption[] = [
  { value: 'chz', label: 'Chiliz (CHZ)', symbol: 'CHZ', icon: '⚡' },
  { value: 'psg', label: 'Paris Saint-Germain Fan Token', symbol: 'PSG', icon: '⚽' },
  { value: 'bar', label: 'FC Barcelona Fan Token', symbol: 'BAR', icon: '🔵🔴' },
  { value: 'juv', label: 'Juventus Fan Token', symbol: 'JUV', icon: '⚪⚫' },
  { value: 'acm', label: 'AC Milan Fan Token', symbol: 'ACM', icon: '🔴⚫' },
  { value: 'man', label: 'Manchester City Fan Token', symbol: 'CITY', icon: '🔵' },
  { value: 'ars', label: 'Arsenal Fan Token', symbol: 'AFC', icon: '🔴' },
  { value: 'atm', label: 'Atletico Madrid Fan Token', symbol: 'ATM', icon: '🔴⚪' },
];

const tipAmounts = [
  { value: 10, label: '10', popular: false },
  { value: 25, label: '25', popular: false },
  { value: 50, label: '50', popular: true },
  { value: 100, label: '100', popular: false },
  { value: 250, label: '250', popular: false },
  { value: 500, label: '500', popular: false },
];

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  athleteName,
  onTip
}) => {
  const [selectedToken, setSelectedToken] = useState<string>('chz');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedTokenInfo = tokenOptions.find(token => token.value === selectedToken);

  const handleTip = async () => {
    if (!selectedTokenInfo) return;

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onTip(amount, selectedToken);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCustomAmount('');
        setSelectedAmount(50);
        setSelectedToken('chz');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">Tip Athlete</h2>
              <p className="text-neutral-400 text-sm truncate">Support {athleteName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0 ml-3"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tip Sent!</h3>
              <p className="text-neutral-400">
                Your tip of {customAmount || selectedAmount} {selectedTokenInfo?.symbol} has been sent to {athleteName}
              </p>
            </div>
          ) : (
            <>
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-3">
                  Select Token
                </label>
                <CustomSelect
                  value={selectedToken}
                  onChange={setSelectedToken}
                  options={tokenOptions.map(token => ({
                    value: token.value,
                    label: `${token.icon} ${token.label}`
                  }))}
                  placeholder="Choose token to tip with"
                />
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
                    className={`p-3 rounded-lg border transition-all duration-200 font-medium text-sm ${
                      selectedAmount === amount.value && !customAmount
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:text-white'
                    } ${amount.popular ? 'ring-2 ring-red-500/30' : ''}`}
                  >
                    <span className="block">{amount.label}</span>
                    {amount.popular && (
                      <span className="block text-xs text-red-400 mt-1">Popular</span>
                    )}
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
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all duration-200 font-medium focus:outline-none"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm">
                    {selectedTokenInfo?.symbol}
                  </div>
                </div>
              </div>

              {/* Tip Preview */}
              <div className="bg-gradient-to-r from-red-950 to-pink-950 border border-red-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">You're sending:</span>
                  <span className="text-white font-bold text-right">
                    {customAmount || selectedAmount} {selectedTokenInfo?.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-neutral-400">To:</span>
                  <span className="text-white font-medium text-right truncate max-w-[200px]">{athleteName}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-950 border border-red-800 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-red-300 font-medium">Tip Failed</p>
                    <p className="text-red-400 text-sm break-words">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={onClose}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTip}
                  disabled={isLoading || (!customAmount && selectedAmount === 0)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
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