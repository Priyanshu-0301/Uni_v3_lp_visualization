'use client';

import React from 'react';

interface PriceBarProps {
  ethPrice: string;
}

const PriceBar: React.FC<PriceBarProps> = ({ ethPrice }) => {
  const prices = Array.from({ length: 7 }, (_, i) => 2000 + i * 500);

  const getPercentage = () => {
    const price = Number(ethPrice);
    if (!price) return 0;
    
    const minPrice = 2000;
    const maxPrice = 5000;
    
    if (price < minPrice) return 0;
    if (price > maxPrice) return 100;
    
    return ((price - minPrice) / (maxPrice - minPrice)) * 100;
  };

  return (
    <div className="w-[480px]">
      {/* Price bar */}
      <div className="relative h-12 rounded-lg overflow-hidden">
        {/* ETH portion */}
        <div 
          className="absolute left-0 top-0 h-full bg-[#2775CA] transition-all duration-300"
          style={{ width: `${getPercentage()}%` }}
        >
          <span 
            className="absolute inset-0 flex items-center justify-center font-bold text-white"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
          >
            USDC
          </span>
        </div>
        {/* USDC portion */}
        <div 
          className="absolute right-0 top-0 h-full bg-gray-500 transition-all duration-300"
          style={{ width: `${100 - getPercentage()}%` }}
        >
          <span 
            className="absolute inset-0 flex items-center justify-center font-bold text-white"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
          >
            ETH
          </span>
        </div>
      </div>

      {/* Number line */}
      <div className="relative mt-4">
        <div className="w-full h-1 bg-black"></div>
        <div className="flex justify-between absolute w-full">
          {prices.map((price) => (
            <div key={price} className="flex flex-col items-center">
              <div className="w-0.5 h-3 bg-black -mt-1"></div>
              <div 
                className="text-base text-black mt-2"
                style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
              >
                ${price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceBar;