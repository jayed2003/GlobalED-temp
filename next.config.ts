import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Some sections still use placeholder SVGs; tighten again once all real images arrive.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
