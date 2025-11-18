/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

const nextConfig = {
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
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

module.exports = withNextIntl(nextConfig);
