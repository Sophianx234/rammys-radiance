import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // ✅ allow all paths
      },
      {
        protocol: "https",
        hostname: "random.imagecdn.app",
        pathname: "/**", // ✅ allow all paths
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**", // ✅ allow all paths
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", // ✅ allow all paths
      },
    ],
  },
  allowedDevOrigins: ['10.21.44.167'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
  
};


export default withSentryConfig(nextConfig, {
  silent: true,
  org: "placeholder-org",
  project: "placeholder-project",
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
