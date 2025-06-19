import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'accurate-trader-backend.onrender.com',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'trading-signals-backend-q0ks.onrender.com',
        pathname: '/api/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: data: blob:; object-src 'none'; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http: wss: ws:; font-src 'self' https: http: data:; media-src 'self' https: http: data: blob:; frame-src 'self' https:;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig
