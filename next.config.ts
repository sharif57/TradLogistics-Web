import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.12.49",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
