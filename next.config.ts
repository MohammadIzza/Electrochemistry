import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to ./out
  output: 'export',
  trailingSlash: false,
  images: {
    // Images ship pre-resized (see src/lib/images.ts), so the optimizer is not needed.
    unoptimized: true,
  },
};

export default nextConfig;
