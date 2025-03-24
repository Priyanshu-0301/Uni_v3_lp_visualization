'use client';

import React from 'react';

interface ShapeSelectorProps {
  onSelect: React.Dispatch<React.SetStateAction<"tshape" | "pricebar" | "splittshape" | "traderpnl" | null>>;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4">
      <button
        onClick={() => onSelect('tshape')}
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        Tick Liquidity
      </button>
      <button
        onClick={() => onSelect('pricebar')}
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        Ranged Liquidity
      </button>
      <button
        onClick={() => onSelect('splittshape')}
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        Borrowed Tick Payoff
      </button>
      <button
        onClick={() => onSelect('traderpnl')}
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        Trader PnL
      </button>
    </div>
  );
};

export default ShapeSelector;