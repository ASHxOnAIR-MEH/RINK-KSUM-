import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google Drive thumbnail endpoint (direct, no redirect)
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail/**',
      },
      {
        // Google Drive direct embed URLs (legacy)
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        // Google user content (Drive thumbnails served via googleusercontent)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        pathname: '/**',
      },
      {
        // Any other googleusercontent subdomain
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
    // Use unoptimized for external Drive images since Drive does redirects
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
