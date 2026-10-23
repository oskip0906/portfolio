import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The static site moved from /webpage to the home page; keep old links working.
  async redirects() {
    return [{ source: "/webpage", destination: "/", permanent: true }]
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allows any HTTPS domain
      },
    ],
  },
};

export default nextConfig;
