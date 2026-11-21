import type { NextConfig } from "next"

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

/** Spring Boot host that serves uploaded blog images under /uploads/. */
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || "http://localhost:8080"
)
const apiIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(apiUrl.hostname)

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
    // Local dev only: the backend runs on localhost, which Next blocks by default (SSRF guard).
    dangerouslyAllowLocalIP: apiIsLocal && process.env.NODE_ENV !== "production",
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
