'use client';

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Helper function to mimic numpy.linspace
function linspace(start: number, stop: number, num: number): number[] {
  const arr: number[] = [];
  const step = (stop - start) / (num - 1);
  for (let i = 0; i < num; i++) {
    arr.push(start + step * i);
  }
  return arr;
}

interface LiquidityData {
  eth_at_current: number;
  usdc_at_current: number;
  P_values: number[];
  eth_holdings: number[];
  usdc_holdings: number[];
  v3_position_value: number[];
  value_of_assets_outside: number[];
  impermanent_loss: number[];
  v3_value_at_current: number;
  impermanent_loss_at_current: number;
  withdrawn_value: number;
  withdrawn_il: number;
  eth_at_withdraw: number;
  usdc_at_withdraw: number;
}

// Function that calculates liquidity parameters
function calculateLiquidity(
  P_lower: number,
  P_upper: number,
  P_entry: number,
  current_price: number,
  initial_eth: number,
  P_withdraw: number
): LiquidityData {
  const P_values = linspace(P_lower, P_upper, 100);
  if (Math.sqrt(P_upper) === Math.sqrt(P_entry)) {
    return {
      eth_at_current: 0,
      usdc_at_current: 0,
      P_values,
      eth_holdings: Array(100).fill(0),
      usdc_holdings: Array(100).fill(0),
      v3_position_value: Array(100).fill(0),
      value_of_assets_outside: Array(100).fill(0),
      impermanent_loss: Array(100).fill(0),
      v3_value_at_current: 0,
      impermanent_loss_at_current: 0,
      withdrawn_value: 0,
      withdrawn_il: 0,
      eth_at_withdraw: 0,
      usdc_at_withdraw: 0
    };
  }

  const L = initial_eth * Math.sqrt(P_entry) * Math.sqrt(P_upper) / (Math.sqrt(P_upper) - Math.sqrt(P_entry));
  const eth_holdings = P_values.map(P => L * (Math.sqrt(P_upper) - Math.sqrt(P)) / (Math.sqrt(P) * Math.sqrt(P_upper)));
  const usdc_holdings = P_values.map(P => L * (Math.sqrt(P) - Math.sqrt(P_lower)));
  
  const eth_at_withdraw = L * (Math.sqrt(P_upper) - Math.sqrt(P_withdraw)) / (Math.sqrt(P_withdraw) * Math.sqrt(P_upper));
  const usdc_at_withdraw = L * (Math.sqrt(P_withdraw) - Math.sqrt(P_lower));
  const withdrawn_value = eth_at_withdraw * P_withdraw + usdc_at_withdraw;
  const withdrawn_il = Math.abs(withdrawn_value - (initial_eth * P_withdraw));

  const eth_at_current = L * (Math.sqrt(P_upper) - Math.sqrt(current_price)) / (Math.sqrt(current_price) * Math.sqrt(P_upper));
  const usdc_at_current = L * (Math.sqrt(current_price) - Math.sqrt(P_lower));
  const v3_position_value = P_values.map((P, i) => eth_holdings[i] * P + usdc_holdings[i]);
  const value_of_assets_outside = P_values.map(P => initial_eth * P);
  const impermanent_loss = v3_position_value.map((v3, i) => Math.abs(v3 - value_of_assets_outside[i]));
  const v3_value_at_current = eth_at_current * current_price + usdc_at_current;
  const impermanent_loss_at_current = Math.abs(v3_value_at_current - (initial_eth * current_price));

  return {
    eth_at_current,
    usdc_at_current,
    P_values,
    eth_holdings,
    usdc_holdings,
    v3_position_value,
    value_of_assets_outside,
    impermanent_loss,
    v3_value_at_current,
    impermanent_loss_at_current,
    withdrawn_value,
    withdrawn_il,
    eth_at_withdraw,
    usdc_at_withdraw
  };
}

export default function LiquidityPoolVisualizer() {
  // Input state
  const [P_lower, setPLower] = useState<number>(1000);
  const [P_upper, setPUpper] = useState<number>(3000);
  const [P_entry, setPEntry] = useState<number>(1000);
  const [currentPrice, setCurrentPrice] = useState<number>(3000);
  const [initialEth, setInitialEth] = useState<number>(1);
  const [P_withdraw, setPWithdraw] = useState<number>(2000);

  // Computed liquidity state
  const [data, setData] = useState<LiquidityData | null>(null);

  // Refs for canvas elements
  const compositionChartRef = useRef<HTMLCanvasElement>(null);
  const v3PositionChartRef = useRef<HTMLCanvasElement>(null);
  const impermanentLossChartRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateLiquidity(
      P_lower,
      P_upper,
      P_entry,
      currentPrice,
      initialEth,
      P_withdraw
    );
    setData(result);
  };

  // Render charts when data is available
  useEffect(() => {
    if (!data) return;

    const charts: Chart[] = [];

    if (compositionChartRef.current) {
      const ctx = compositionChartRef.current.getContext('2d');
      if (ctx) {
        charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'USDC Holdings',
                data: data.P_values.map((p, i) => ({ x: p, y: data.usdc_holdings[i] })),
                borderColor: 'blue',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                yAxisID: 'yLeft'
              },
              {
                label: 'ETH Holdings',
                data: data.P_values.map((p, i) => ({ x: p, y: data.eth_holdings[i] })),
                borderColor: 'orange',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                yAxisID: 'yRight'
              },
              {
                label: 'Current USDC Holdings',
                data: [{ x: currentPrice, y: data.usdc_at_current }],
                backgroundColor: 'blue',
                pointRadius: 6,
                type: 'scatter',
                yAxisID: 'yLeft'
              },
              {
                label: 'Current ETH Holdings',
                data: [{ x: currentPrice, y: data.eth_at_current }],
                backgroundColor: 'orange',
                pointRadius: 6,
                type: 'scatter',
                yAxisID: 'yRight'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                title: { display: true, text: 'ETH Price (USDC)' }
              },
              yLeft: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'USDC Holdings' },
                ticks: { color: 'blue' }
              },
              yRight: {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'ETH Holdings' },
                ticks: { color: 'orange' },
                grid: { drawOnChartArea: false }
              }
            },
            plugins: {
              tooltip: { mode: 'index', intersect: false }
            }
          }
        }));
      }
    }

    if (v3PositionChartRef.current) {
      const ctx = v3PositionChartRef.current.getContext('2d');
      if (ctx) {
        const hodlValue = initialEth * currentPrice;
        charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'V3 Position Value',
                data: data.P_values.map((p, i) => ({ x: p, y: data.v3_position_value[i] })),
                borderColor: 'blue',
                fill: false,
                tension: 0.4,
                pointRadius: 0
              },
              {
                label: 'HODL Value',
                data: data.P_values.map((p, i) => ({ x: p, y: data.value_of_assets_outside[i] })),
                borderColor: 'green',
                fill: false,
                tension: 0.4,
                pointRadius: 0
              },
              {
                label: 'Current V3 Value',
                data: [{ x: currentPrice, y: data.v3_value_at_current }],
                backgroundColor: 'blue',
                pointRadius: 6,
                type: 'scatter'
              },
              {
                label: 'Current HODL Value',
                data: [{ x: currentPrice, y: hodlValue }],
                backgroundColor: 'green',
                pointRadius: 6,
                type: 'scatter'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                title: { display: true, text: 'ETH Price (USDC)' }
              },
              y: {
                title: { display: true, text: 'Value (USDC)' }
              }
            },
            plugins: {
              tooltip: { mode: 'index', intersect: false }
            }
          }
        }));
      }
    }

    if (impermanentLossChartRef.current) {
      const ctx = impermanentLossChartRef.current.getContext('2d');
      if (ctx) {
        charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Impermanent Loss',
                data: data.P_values.map((p, i) => ({ x: p, y: data.impermanent_loss[i] })),
                borderColor: 'red',
                fill: false,
                tension: 0.4,
                pointRadius: 0
              },
              {
                label: 'Current IL',
                data: [{ x: currentPrice, y: data.impermanent_loss_at_current }],
                backgroundColor: 'red',
                pointRadius: 6,
                type: 'scatter'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                title: { display: true, text: 'ETH Price (USDC)' }
              },
              y: {
                title: { display: true, text: 'Impermanent Loss (USDC)' }
              }
            },
            plugins: {
              tooltip: { mode: 'index', intersect: false }
            }
          }
        }));
      }
    }

    // Cleanup function to destroy charts
    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, [data, currentPrice, initialEth]);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Lower Price (USDC):</label>
            <input
              type="number"
              value={P_lower}
              onChange={(e) => setPLower(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Upper Price (USDC):</label>
            <input
              type="number"
              value={P_upper}
              onChange={(e) => setPUpper(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Entry Price (USDC):</label>
            <input
              type="number"
              value={P_entry}
              onChange={(e) => setPEntry(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Current Price (USDC):</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Initial ETH:</label>
            <input
              type="number"
              value={initialEth}
              onChange={(e) => setInitialEth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Withdrawal Price (USDC):</label>
            <input
              type="number"
              value={P_withdraw}
              onChange={(e) => setPWithdraw(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl text-lg font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
        >
          Calculate Position
        </button>
      </form>

      <div className="space-y-8">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Position Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-blue-500 mb-6">Current Position</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">ETH Holdings:</span>
                  <span className="text-gray-900 font-medium">{data.eth_at_current.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">USDC Holdings:</span>
                  <span className="text-gray-900 font-medium">{data.usdc_at_current.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Portfolio Value:</span>
                  <span className="text-gray-900 font-medium">{data.v3_value_at_current.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Impermanent Loss:</span>
                  <span className="text-gray-900 font-medium">{data.impermanent_loss_at_current.toFixed(2)} USDC</span>
                </div>
              </div>
            </div>

            {/* At Withdrawal Price Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-blue-500 mb-6">At Withdrawal Price</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">ETH:</span>
                  <span className="text-gray-900 font-medium">{data.eth_at_withdraw.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">USDC:</span>
                  <span className="text-gray-900 font-medium">{data.usdc_at_withdraw.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Portfolio Value:</span>
                  <span className="text-gray-900 font-medium">{data.withdrawn_value.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Impermanent Loss:</span>
                  <span className="text-gray-900 font-medium">{data.withdrawn_il.toFixed(2)} USDC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Position Composition</h2>
          <canvas ref={compositionChartRef} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Position Value</h2>
          <canvas ref={v3PositionChartRef} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Impermanent Loss</h2>
          <canvas ref={impermanentLossChartRef} />
        </div>
      </div>
    </div>
  );
} 