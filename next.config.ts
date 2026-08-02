import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder assets are SVGs; tighten again when real images arrive.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
