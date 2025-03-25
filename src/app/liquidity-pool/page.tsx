import React from 'react';
import LiquidityPoolVisualizer from '@/components/LiquidityPoolVisualizer';

export default function LiquidityPoolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">
        Liquidity and IL Visualization
      </h1>
      <LiquidityPoolVisualizer />
    </div>
  );
}
