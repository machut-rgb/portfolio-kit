import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Images are submitted as part of the form that owns them, and Server
      // Actions default to a 1 MB body. This has to clear MAX_UPLOAD_BYTES
      // (2 MB) plus the rest of the form, or uploads fail before validation
      // can produce a readable error.
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // Add remote hosts here if your content references external images.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
