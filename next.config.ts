import { NextConfig } from "next";

const nextConfig: NextConfig = { 
  output: 'standalone',
  webpack: (config) => {
    config.cache = false;
    return config;
  }, 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
