import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
      { source: "/favicon.png", destination: "/icon" },
    ];
  },
};

export default nextConfig;
