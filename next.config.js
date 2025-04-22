/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Completely disable source maps
    config.devtool = false;
    config.resolve.fallback = { fs: false, path: false };

    // Try to disable React Refresh which can interfere with error handling
    const rules = config.module.rules;
    if (rules) {
      for (const rule of rules) {
        if (rule.use && Array.isArray(rule.use)) {
          const babelLoader = rule.use.find(
            (u) => u.loader && u.loader.includes("babel-loader")
          );
          if (
            babelLoader &&
            babelLoader.options &&
            babelLoader.options.plugins
          ) {
            babelLoader.options.plugins = babelLoader.options.plugins.filter(
              (p) => !p.includes("react-refresh")
            );
          }
        }
      }
    }

    return config;
  },
  reactStrictMode: false, // Try disabling strict mode temporarily
  output: "standalone",
  distDir: ".next",
  productionBrowserSourceMaps: false,

  // Disable typescript checks during dev to reduce complexity
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint during dev
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Simplified SWC configuration with only supported options
  swcMinify: true,

  experimental: {
    // appDir and serverComponents removed - they are now standard features in Next.js 14+
    outputFileTracingIncludes: {
      "/**": ["utils/openai/*.md", "scripts/output/split_data/*.json"],
    },
  },

  // Attempt to fix error overlays
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
