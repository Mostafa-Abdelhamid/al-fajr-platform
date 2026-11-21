import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly allow camera/mic/display-capture for our own origin
          // (the session page delegates them into the Daily.co iframe via
          // its `allow` attribute) rather than leaving Permissions-Policy
          // unset, which some browsers otherwise default more restrictively.
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), display-capture=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
