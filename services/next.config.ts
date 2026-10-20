import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: ["192.168.56.1"],
    // allowedDevOrigins: ["92.168.0.120"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },

  async headers() {
    return [
      {
        // Always serve the latest service worker.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
