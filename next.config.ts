import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  images: {
    domains: ['cdn.usegalileo.ai'], // Add the hostname here
  },
  // Add other Next.js config options here if needed
};

export default nextConfig;
