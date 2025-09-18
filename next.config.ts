// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true // remove for the next production
  },
  eslint: {
    ignoreDuringBuilds: true // remove for the next production
  },
  transpilePackages: ["three"],
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*" // Or specify your frontend URL like "http://localhost:3000"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/overview",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
