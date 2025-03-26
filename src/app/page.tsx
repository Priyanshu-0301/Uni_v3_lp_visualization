
'use client';

import React from 'react';
import TShape from '@/components/TShape';
import PriceBar from '@/components/PriceBar';
import SplitTShape from '@/components/SplitTShape';
// IMPORTANT: Actually import TraderPnL
import TraderPnL from '@/components/TraderPnL';

const descriptions = {
  tshape: "How tick liquidity changes when price crosses a tick",
  pricebar: "How ranged liquidity changes when price of ETH changes",
  splittshape: "When this liquidity is borrowed, swap does not happen",
  traderpnl: "How trader PnL changes when price of ETH changes"
};

export default function Home() {
  // Keeps track of which shape is selected
  const [selectedShape, setSelectedShape] = React.useState<
    'tshape' | 'pricebar' | 'splittshape' | 'traderpnl' | null
  >(null);

  // The actual numeric price used by TShape, PriceBar, etc.
  const [ethPrice, setEthPrice] = React.useState<number>(2000);

  // A string to track typed input, even if out-of-range or partial
  const [localValue, setLocalValue] = React.useState<string>('2000');
  const [error, setError] = React.useState('');

  // Let the user type freely, then validate
  const handleLocalChange = (value: string) => {
    setLocalValue(value);

    // Validate numeric
    const numValue = Number(value);
    if (!value || isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    // Validate range
    if (numValue < 2000 || numValue > 5000) {
      setError('Invalid input: Price must be between 2000 and 5000');
      return;
    }

    // Otherwise valid
    setError('');
    setEthPrice(numValue);
  };

  const handleIncrement = () => {
    if (ethPrice < 5000) {
      const newVal = ethPrice + 1;
      setEthPrice(newVal);
      setLocalValue(String(newVal));
      setError('');
    }
  };

  const handleDecrement = () => {
    if (ethPrice > 2000) {
      const newVal = ethPrice - 1;
      setEthPrice(newVal);
      setLocalValue(String(newVal));
      setError('');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">
          ETH/USDC Pool Visualization
        </h1>

        {/* Shape Selector */}
        <div className="flex justify-center gap-3 mb-6">
          {Object.entries({
            tshape: "Tick Liquidity",
            pricebar: "Ranged Liquidity",
            splittshape: "Borrowed Tick Payoff",
            traderpnl: "Trader PnL"
          }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedShape(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                selectedShape === key
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Description */}
        {selectedShape && (
          <div className="text-sm text-center mb-6 text-gray-600 max-w-2xl mx-auto">
            {descriptions[selectedShape]}
          </div>
        )}

        {/* Selected Shape */}
        <div className="flex justify-center items-center mb-6">
          {selectedShape === 'tshape' && <TShape ethPrice={ethPrice} />}
          {selectedShape === 'pricebar' && <PriceBar ethPrice={ethPrice} />}
          {selectedShape === 'splittshape' && <SplitTShape ethPrice={ethPrice} />}

          {/* HERE is the fix: actually render TraderPnL */}
          {selectedShape === 'traderpnl' && <TraderPnL ethPrice={ethPrice} />}

          {!selectedShape && (
            <div className="text-sm text-gray-400 animate-pulse">
              Please select a visualization above
            </div>
          )}
        </div>

        {/* Input section */}
        <div className="max-w-sm mx-auto bg-white rounded-lg p-4 shadow-lg border border-gray-100">
          <h2 className="text-sm font-semibold mb-4 text-center text-gray-800">
            ETH Price Control
          </h2>

          <div className="space-y-4">
            {/* Numeric input with increment/decrement */}
            <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 text-blue-500 hover:bg-gray-100 transition-colors disabled:text-gray-300 text-sm font-medium"
                disabled={ethPrice <= 2000}
              >
                -
              </button>

              <input
                type="number"
                min={2000}
                max={5000}
                step={1}
                value={localValue}
                onChange={(e) => handleLocalChange(e.target.value)}
                className="w-full text-center py-2 bg-transparent text-sm font-medium focus:outline-none text-gray-700"
              />

              <button
                onClick={handleIncrement}
                className="px-3 py-2 text-blue-500 hover:bg-gray-100 transition-colors disabled:text-gray-300 text-sm font-medium"
                disabled={ethPrice >= 5000}
              >
                +
              </button>
            </div>

            {/* Show error if invalid input */}
            {error && (
              <div className="text-sm text-red-500 font-medium">
                {error}
              </div>
            )}

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={2000}
                max={5000}
                step={1}
                value={ethPrice}
                onChange={(e) => handleLocalChange(e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>${(2000).toLocaleString()}</span>
                <span>${(5000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
