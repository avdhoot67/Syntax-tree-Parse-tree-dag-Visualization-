import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mysql2'],
  typescript: {
    // Allow production builds even with type warnings
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
