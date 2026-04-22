import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Larger bodies for multi-image edits at 2K/4K.
    serverActions: { bodySizeLimit: "32mb" },
  },
};

export default nextConfig;
