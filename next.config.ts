import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google Drive direct embed URLs
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        // Google user content (Drive thumbnails)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        // Google Drive file serve
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        pathname: '/**',
      },
    ],
    // Use unoptimized for external Drive images since Drive does redirects
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
