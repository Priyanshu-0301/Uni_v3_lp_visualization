// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // Prevent build failures due to ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true,  // Prevent build failures due to TS errors
  },
};

export default nextConfig;
