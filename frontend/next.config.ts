import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "10101" },
      { protocol: "http", hostname: "localhost", port: "10101" },
      { protocol: "http", hostname: "jyothishiuncle.local" },
    ],
  },
};

export default nextConfig;
