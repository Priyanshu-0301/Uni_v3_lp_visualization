'use client';

interface TraderPnLProps {
  ethPrice: string;
}

const TraderPnL: React.FC<TraderPnLProps> = ({ ethPrice }) => {
  const prices = Array.from({ length: 7 }, (_, i) => 2000 + i * 500);

  const getMarkerPosition = () => {
    const price = Number(ethPrice);
    if (!price) return null;
    
    const minPrice = 2000;
    const maxPrice = 5000;
    const totalWidth = 480;
    
    if (price < minPrice) return 0;
    if (price > maxPrice) return totalWidth;
    
    return ((price - minPrice) / (maxPrice - minPrice)) * totalWidth;
  };

  // Calculate path for call option payoff line
  const getCallOptionPath = () => {
    const startX = 0;
    const startY = 100;  // Height when price is below strike
    const strikeX = ((3500 - 2000) / (5000 - 2000)) * 480;  // X position at strike price
    const endX = 480;
    const endY = 0;  // Height at max price

    return `M ${startX} ${startY} L ${strikeX} ${startY} L ${endX} ${endY}`;
  };

  return (
    <div className="relative">
      {!ethPrice ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div 
            className="text-2xl text-black text-center"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
          >
            Enter ETH price to see PnL graph
          </div>
          {/* Blank screen placeholder */}
          <div className="w-[480px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div 
              className="text-gray-400 text-lg"
              style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
            >
              Graph will appear here
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* SVG for call option payoff */}
          <svg className="absolute top-[-100px]" width="480" height="100">
            {/* Call option line */}
            <path
              d={getCallOptionPath()}
              stroke="black"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Horizontal line with price labels */}
          <div className="w-[480px] h-1 bg-black"></div>
          
          {/* Price marker */}
          <div 
            className="absolute top-0 w-1 h-4 bg-red-500"
            style={{ 
              left: `${getMarkerPosition()}px`,
              transform: 'translateX(-50%)'
            }}
          />
          
          {/* Ticks and Labels */}
          <div className="flex justify-between absolute w-[480px] top-6">
            {prices.map((price) => (
              <div key={price} className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-black -mt-4 mb-2"></div>
                <div 
                  className="text-base text-black"
                  style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
                >
                  ${price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TraderPnL; 