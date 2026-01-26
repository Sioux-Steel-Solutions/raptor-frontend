import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for local/Pi deployment
  // When building for Pi, run: npm run build:local
  // This outputs static files to 'out/' directory
  output: process.env.BUILD_MODE === "local" ? "export" : undefined,

  // Required for static export with dynamic routes
  trailingSlash: true,

  // Disable image optimization for static export (uses <img> instead of next/image)
  images: {
    unoptimized: process.env.BUILD_MODE === "local",
  },

  // Enable instrumentation to polyfill localStorage for Node 20+
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
