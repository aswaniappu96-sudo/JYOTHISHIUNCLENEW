import type { NextConfig } from "next";

function wordpressImagePatterns() {
  const patterns: { protocol: "http" | "https"; hostname: string; port?: string }[] = [
    { protocol: "http", hostname: "127.0.0.1", port: "10101" },
    { protocol: "http", hostname: "localhost", port: "10101" },
    { protocol: "http", hostname: "jyothishiuncle.local" },
    { protocol: "https", hostname: "jyothishiuncle.ct.ws" },
    { protocol: "https", hostname: "jyothishuncle.velvetbyte.com" },
  ];

  const raw = process.env.WORDPRESS_URL;
  if (!raw) return patterns;

  try {
    const url = new URL(raw);
    const protocol = url.protocol === "https:" ? "https" : "http";
    const extra: { protocol: "http" | "https"; hostname: string; port?: string } = {
      protocol,
      hostname: url.hostname,
    };
    if (url.port) extra.port = url.port;
    patterns.push(extra);
  } catch {
    /* ignore invalid WORDPRESS_URL */
  }

  return patterns;
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: wordpressImagePatterns(),
  },
};

export default nextConfig;
