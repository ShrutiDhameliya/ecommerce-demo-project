/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  // Disable static optimization for dynamic pages
  experimental: {
    // This helps with the build process
    optimizeCss: true,
    scrollRestoration: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Add this to ensure API routes work in development
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 