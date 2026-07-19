/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_MODE === 'mobile';

const nextConfig = {
  reactStrictMode: true,
  output: isMobile ? 'export' : undefined,
  images: {
    unoptimized: isMobile ? true : undefined,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://omnia-api.vercel.app https://omnia-core-api.vercel.app https://omnia-hris-api.vercel.app https://omnia-cafe-api.vercel.app http://localhost:4000 ws://localhost:3000 ws://localhost:3001 wss://localhost:3000 wss://localhost:3001",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join("; ");

    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self)" }
      ]
    }];
  }
};

module.exports = nextConfig;
