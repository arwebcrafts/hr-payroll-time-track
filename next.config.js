/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      // Add your custom image domains here if needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.yourdomain.com',
      // },
    ],
  },
  // Treat @react-pdf/renderer as external package (not bundled)
  serverComponentsExternalPackages: ['@react-pdf/renderer', 'canvas'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

module.exports = withNextIntl(nextConfig);
