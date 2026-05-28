import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow all local images from /public/images
    unoptimized: false,
  },
  // Silence hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
