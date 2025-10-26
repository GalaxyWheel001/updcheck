/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Убираем output: 'export' для поддержки API маршрутов
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons']
  }
};

module.exports = nextConfig;
