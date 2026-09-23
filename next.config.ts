import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  // One single form flow: the old entry pages now lead straight to the consultation form
  // (query strings such as ?course= are kept).
  async redirects() {
    return [
      { source: "/get-started", destination: "/consultation", permanent: false },
      { source: "/ielts-registration", destination: "/consultation", permanent: false },
    ];
  },
  async headers() {
    const noIndex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    // Sent on every response, static files included. The Content-Security-Policy
    // is set per request in src/proxy.ts because it carries a fresh nonce.
    const securityHeaders = [
      // HTTPS only for 2 years. No `preload`: that's very hard to undo, so add
      // it only once the final domain (and all its subdomains) serve HTTPS.
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
      },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin", headers: noIndex },
      { source: "/admin/:path*", headers: noIndex },
      { source: "/api/:path*", headers: noIndex },
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
