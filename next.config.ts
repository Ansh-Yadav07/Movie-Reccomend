import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TMDB already serves pre-sized images, so skip Next's image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
