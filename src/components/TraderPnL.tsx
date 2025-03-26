
'use client';

interface TraderPnLProps {
  ethPrice: number;
}

export default function TraderPnL({ ethPrice }: TraderPnLProps) {
  // Chart dimensions
  const WIDTH = 600;       // horizontal space for the chart
  const HEIGHT = 220;      // vertical space for the chart
  const LEFT_OFFSET = 80;  // space for y-axis labels
  const TOP_PADDING = 20;  // extra space above the chart so "1500" isn't flush

  // Max profit
  const maxPnL = 1500;
  // Price logic
  const minPrice = 2000;
  const maxPrice = 5000;
  const strikePrice = 3500;

  // Map price => X in [LEFT_OFFSET .. LEFT_OFFSET+WIDTH]
  function getX(price: number) {
    if (price <= minPrice) return LEFT_OFFSET;
    if (price >= maxPrice) return LEFT_OFFSET + WIDTH;
    const fraction = (price - minPrice) / (maxPrice - minPrice);
    return LEFT_OFFSET + fraction * WIDTH;
  }

  // Map PnL => Y in [HEIGHT..0], but we’ll shift everything by TOP_PADDING visually
  function getY(pnl: number) {
    if (pnl < 0) return HEIGHT;
    if (pnl > maxPnL) return 0;
    const fraction = pnl / maxPnL; // 0..1
    return HEIGHT - fraction * HEIGHT;
  }

  function calcPnL(price: number) {
    return price < strikePrice ? 0 : price - strikePrice; // up to 1500
  }

  const currentPnL = calcPnL(ethPrice);

  // Coordinates
  const markerX = getX(ethPrice);
  const markerY = getY(currentPnL);

  // Horizontal portion (price=2000..3500 => PnL=0)
  const baseY = getY(0);
  const strikeX = getX(strikePrice);
  const horizontalWidth = strikeX - LEFT_OFFSET;

  // Diagonal portion (price=3500..5000 => 0..1500)
  const dx = (LEFT_OFFSET + WIDTH) - strikeX;
  const dy = getY(maxPnL) - baseY;
  const diagonalLength = Math.sqrt(dx * dx + dy * dy);
  const diagonalAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Axis ticks
  const xTicks = [2000, 2500, 3000, 3500, 4000, 4500, 5000];
  const yTicks = [0, 500, 1000, 1500];

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          // Add the top padding plus some margin at the bottom
          width: LEFT_OFFSET + WIDTH + 120,
          height: HEIGHT + 30 + TOP_PADDING, 
          margin: '0 auto',
          background: '#fff',
          border: '1px solid #ccc',
        }}
      >
        {/* Y-axis */}
        <div
          style={{
            position: 'absolute',
            left: LEFT_OFFSET,
            // Shift down by TOP_PADDING
            top: TOP_PADDING,
            width: 2,
            height: HEIGHT,
            background: 'black',
          }}
        />

        {/* X-axis (PnL=0) */}
        <div
          style={{
            position: 'absolute',
            left: LEFT_OFFSET,
            top: baseY + TOP_PADDING,
            width: horizontalWidth + (WIDTH - horizontalWidth),
            height: 2,
            background: 'black',
          }}
        />

        {/* Horizontal payoff line (blue) */}
        <div
          style={{
            position: 'absolute',
            left: LEFT_OFFSET,
            top: baseY + TOP_PADDING,
            width: horizontalWidth,
            height: 2,
            background: 'blue',
          }}
        />

        {/* Diagonal payoff line (blue) */}
        <div
          style={{
            position: 'absolute',
            left: strikeX,
            top: baseY + TOP_PADDING,
            width: diagonalLength,
            height: 2,
            background: 'blue',
            transform: `rotate(${diagonalAngle}deg)`,
            transformOrigin: 'left center',
          }}
        />

        {/* Marker dot */}
        {ethPrice > 0 && (
          <div
            style={{
              position: 'absolute',
              left: markerX,
              top: markerY + TOP_PADDING,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'blue',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* X-axis ticks + labels */}
        {xTicks.map((p) => {
          const x = getX(p);
          return (
            <div key={p}>
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: baseY + TOP_PADDING - 3,
                  width: 1,
                  height: 6,
                  background: 'black',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: baseY + TOP_PADDING + 6,
                  fontSize: 14,
                  color: 'black',
                  transform: 'translateX(-50%)',
                }}
              >
                ${p.toLocaleString()}
              </div>
            </div>
          );
        })}

        {/* Y-axis ticks + labels */}
        {yTicks.map((profit) => {
          const y = getY(profit);
          return (
            <div key={profit}>
              <div
                style={{
                  position: 'absolute',
                  left: LEFT_OFFSET - 3,
                  top: y + TOP_PADDING,
                  width: 6,
                  height: 1,
                  background: 'black',
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: LEFT_OFFSET - 40,
                  top: y + TOP_PADDING,
                  fontSize: 14,
                  color: 'black',
                  transform: 'translateY(-50%)',
                }}
              >
                {profit}
              </div>
            </div>
          );
        })}

        {/* Y-axis label */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            // We also push it down by TOP_PADDING if you want
            top: HEIGHT / 2 + TOP_PADDING,
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'left center',
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          Profit (USDC)
        </div>

        {/* Side card for PnL */}
        <div
          style={{
            position: 'absolute',
            right: 5,
            top: 10,
            width: 100,
            padding: 8,
            background: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: 6,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 ,fontWeight: 'bold'}}>
            Profit
          </div>
          <div style={{ fontSize: 15, color: 'blue', fontWeight: 'bold' }}>
            {currentPnL} USDC
          </div>
        </div>
      </div>
    </div>
  );
}
