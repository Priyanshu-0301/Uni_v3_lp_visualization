'use client';

import React from 'react';
import TShape from '@/components/TShape';
import PriceBar from '@/components/PriceBar';
import SplitTShape from '@/components/SplitTShape';
// import ShapeSelector from '@/components/ShapeSelector';

const descriptions = {
  tshape: "How tick liquidity changes when price crosses a tick",
  pricebar: "How ranged liquidity changes when price of ETH changes",
  splittshape: "When this liquidity is borrowed, swap does not happen",
  traderpnl: "How trader PnL changes when price of ETH changes"
};

export default function Home() {
  const [selectedShape, setSelectedShape] = React.useState<'tshape' | 'pricebar' | 'splittshape' | 'traderpnl' | null>(null);
  const [ethPrice, setEthPrice] = React.useState('2000');

  const handleInputChange = (value: string) => {
    let numValue = Number(value);
    
    // Handle empty or invalid input
    if (value === '' || isNaN(numValue)) {
      setEthPrice('2000');
      return;
    }
    
    // Clamp value between 2000 and 5000
    numValue = Math.max(2000, Math.min(5000, Math.round(numValue)));
    setEthPrice(numValue.toString());
  };

  const handleIncrement = () => {
    const currentValue = Number(ethPrice);
    if (currentValue < 5000) {
      handleInputChange((currentValue + 1).toString());
    }
  };

  const handleDecrement = () => {
    const currentValue = Number(ethPrice);
    if (currentValue > 2000) {
      handleInputChange((currentValue - 1).toString());
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Header */}
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
                disabled={Number(ethPrice) <= 2000}
              >
                -
              </button>
              <input
                type="number"
                min={2000}
                max={5000}
                step={1}
                value={ethPrice}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full text-center py-2 bg-transparent text-sm font-medium focus:outline-none text-gray-700"
              />
              <button
                onClick={handleIncrement}
                className="px-3 py-2 text-blue-500 hover:bg-gray-100 transition-colors disabled:text-gray-300 text-sm font-medium"
                disabled={Number(ethPrice) >= 5000}
              >
                +
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={2000}
                max={5000}
                step={1}
                value={ethPrice}
                onChange={(e) => handleInputChange(e.target.value)}
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