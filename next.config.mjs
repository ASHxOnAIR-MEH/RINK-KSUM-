/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // ── Enable Next.js image optimization (AVIF + WebP auto-conversion) ──
    // Previously `unoptimized: true` was blocking ALL optimization.
    // Removed that flag so Next.js Sharp pipeline is active.
    formats: ['image/avif', 'image/webp'],

    // Serve appropriately sized images for the actual rendered width.
    // These match the widths used in TechnologyCard, SectorCard, etc.
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize re-optimization traffic; images rarely change.
    minimumCacheTTL: 31536000, // 1 year

    // Allow remote images from Google Drive / Google User Content
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
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
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // ── Compiler options ──────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Turbopack (Next.js 16 default bundler) ────────────────────────────
  turbopack: {},

  // ── HTTP headers: cache static image assets aggressively ──────────────
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
