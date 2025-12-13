import withNextIntl from 'next-intl/plugin';

// Define the base Next.js configuration
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Usually not needed with App Router unless customizing
};

// Wrap the config with the next-intl plugin
// Point the plugin to your i18n configuration file
export default withNextIntl('./src/i18n.ts')(nextConfig);
