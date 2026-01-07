// next.config.mjs
import withNextIntl from "next-intl/plugin";
var nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
  // pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Usually not needed with App Router unless customizing
};
var next_config_default = withNextIntl("./src/i18n.ts")(nextConfig);
export {
  next_config_default as default
};
