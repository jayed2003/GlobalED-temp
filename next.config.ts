import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One single form flow: the old entry pages now lead straight to the consultation form
  // (query strings such as ?course= are kept).
  async redirects() {
    return [
      { source: "/get-started", destination: "/consultation", permanent: false },
      { source: "/ielts-registration", destination: "/consultation", permanent: false },
    ];
  },
  images: {
    // Some sections still use placeholder SVGs; tighten again once all real images arrive.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
