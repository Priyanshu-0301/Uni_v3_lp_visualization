'use client';

interface TShapeProps {
  ethPrice: string;
}

const TShape: React.FC<TShapeProps> = ({ ethPrice }) => {
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

  return (
    <div className="relative">
      <div className="relative">
        {/* Vertical rectangle with text */}
        <div className="relative w-8 h-60 bg-black absolute left-1/2 -translate-x-1/2">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-white font-bold text-lg" style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>
              {Number(ethPrice) > 3500 ? '3500 USDC' : '1ETH'}
            </span>
          </div>
        </div>
        {/* Horizontal line with price labels */}
        <div className="relative">
          <div className="w-[480px] h-1 bg-black"></div>
          {/* Price marker */}
          {ethPrice && (
            <div 
              className="absolute top-0 w-1 h-4 bg-red-500"
              style={{ 
                left: `${getMarkerPosition()}px`,
                transform: 'translateX(-50%)'
              }}
            />
          )}
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
        </div>
      </div>
    </div>
  );
};

export default TShape;