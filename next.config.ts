import { NextConfig } from "next";

const nextConfig: NextConfig = { 
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
