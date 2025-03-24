'use client';

interface SplitTShapeProps {
  ethPrice: string;
}

const SplitTShape: React.FC<SplitTShapeProps> = ({ ethPrice }) => {
  const prices = Array.from({ length: 7 }, (_, i) => 2000 + i * 500);
  // const pnlValues = [0, 250, 500, 750, 1000, 1250, 1500];

  const getMarkerPosition = () => {
    const price = Number(ethPrice);
    if (!price) return null;
    
    const minPrice = 2000;
    const maxPrice = 5000;
    const totalWidth = 600;
    
    if (price < minPrice) return 0;
    if (price > maxPrice) return totalWidth;
    
    return ((price - minPrice) / (maxPrice - minPrice)) * totalWidth;
  };

  const getDebtValue = () => {
    const price = Number(ethPrice) || 2000;
    if (price <= 3500) {
      return "1 ETH";
    }
    return "3500 USDC";
  };

  const getBorrowedValue = () => {
    const price = Number(ethPrice) || 2000;
    return `${price} USDC`;
  };

  const getTraderPnL = () => {
    const price = Number(ethPrice) || 2000;
    if (price <= 3500) {
      return "0 USDC";
    }
    return `${price - 3500} USDC`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6">
        {/* Vertical ETH bar */}
        <div className="relative w-4 h-36 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-white text-sm font-medium">
              1 ETH
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Horizontal line */}
          <div className="w-[480px] h-1.5 bg-gray-200 rounded-full"></div>
          
          {/* Price marker */}
          {ethPrice && getMarkerPosition() !== null && (
            <div 
              className="absolute -top-2 w-1.5 h-5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"
              style={{ 
                left: `${(getMarkerPosition()! / 600) * 480}px`,
                transform: 'translateX(-50%)'
              }}
            />
          )}
          
          {/* Price labels */}
          <div className="flex justify-between absolute w-[480px] top-4">
            {prices.map((price) => (
              <div key={price} className="flex flex-col items-center">
                <div 
                  className={`w-0.5 ${
                    price === 3500 
                      ? 'h-3 bg-blue-500 -mt-2 mb-2' 
                      : 'h-2 bg-gray-300 -mt-1.5 mb-1.5'
                  }`}
                ></div>
                <div className={`text-sm font-medium ${
                  price === 3500 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600'
                }`}>
                  ${price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Threshold line */}
          <div 
            className="absolute -top-2 w-0.5 h-5 bg-blue-500/30"
            style={{ 
              left: `${((3500 - 2000) / (5000 - 2000)) * 480}px`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 justify-center">
        {/* Value box */}
        <div className="bg-white p-3 rounded-lg shadow-md min-w-[140px] border border-gray-100">
          <div className="text-xs font-medium mb-1 text-gray-500">
            Value of borrowed asset
          </div>
          <div className="text-sm font-medium">
            <span className="font-semibold text-blue-600">1 ETH</span>
            <span className="text-gray-700"> = {getBorrowedValue()}</span>
          </div>
        </div>
        
        {/* Debt box */}
        <div className="bg-white p-3 rounded-lg shadow-md min-w-[140px] border border-gray-100">
          <div className="text-xs font-medium mb-1 text-gray-500">
            Debt to repay LP
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {getDebtValue()}
          </div>
        </div>
        
        {/* PnL box */}
        <div className="bg-white p-3 rounded-lg shadow-md min-w-[140px] border border-gray-100">
          <div className="text-xs font-medium mb-1 text-gray-500">
            Trader PnL
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {getTraderPnL()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitTShape;