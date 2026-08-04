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
  allowedDevOrigins: ['192.168.137.192']
  
};


export default nextConfig;
