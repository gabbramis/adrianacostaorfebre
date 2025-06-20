// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This targets the specific "critical dependency" warning coming from RealtimeClient.
    // It tells Webpack to not analyze certain expressions within this module.
    // This is a common workaround for this type of issue in production builds.
    config.module.rules.push({
      test: /@supabase[\\/]realtime-js[\\/]dist[\\/]main[\\/]RealtimeClient\.js$/,
      // This tells Webpack to not parse dynamic imports in this file
      // which causes the "Critical dependency" warning.
      parser: { amd: false },
    });

    return config;
  },
};

module.exports = nextConfig;
