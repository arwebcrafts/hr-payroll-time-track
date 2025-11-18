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
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Make @react-pdf/renderer and related modules external to prevent bundling
      const externals = config.externals || [];
      config.externals = [
        ...externals,
        {
          '@react-pdf/renderer': 'commonjs @react-pdf/renderer',
          'canvas': 'commonjs canvas',
        },
      ];
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
