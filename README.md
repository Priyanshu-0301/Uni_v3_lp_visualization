# Uniswap V3 Position Visualizer

A web application that helps visualize and analyze Uniswap V3 liquidity positions. This tool allows users to understand position composition, value, and impermanent loss across different price ranges.

## Features

- Interactive position calculation with customizable parameters
- Real-time visualization of:
  - Position Composition (ETH and USDC holdings)
  - Position Value comparison with HODL strategy
  - Impermanent Loss analysis
- Current position and withdrawal price analysis
- Responsive design for all devices

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Chart.js
- React

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your position parameters:
   - Lower Price (USDC)
   - Upper Price (USDC)
   - Entry Price (USDC)
   - Current Price (USDC)
   - Initial ETH
   - Withdrawal Price (USDC)

2. Click "Calculate Position" to view the analysis

3. Examine the visualizations and position details

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 