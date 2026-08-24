import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images: serve WebP/AVIF automatically, cache aggressively
  images: {
    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days

    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    imageSizes: [16, 32, 64, 96, 128, 256, 384],

    // Allow Unsplash remote images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // Enable gzip/brotli compression for all responses
  compress: true,

  // Strict mode for catching React bugs early
  reactStrictMode: true,

  // Remove console.log calls in production builds
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;