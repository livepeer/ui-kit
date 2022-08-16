const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  unstable_flexsearch: {
    codeblocks: true,
  },
  unstable_staticImage: true,
  unstable_contentDump: true,
});

/** @type {import('next').NextConfig} */
const config = {
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
  typescript: {
    // Disable type checking since eslint handles this
    ignoreBuildErrors: true,
  },
};

if (process.env.NODE_ENV === 'development') {
  const withPreconstruct = require('@preconstruct/next');
  module.exports = withPreconstruct(withNextra(config));
} else {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  module.exports = withBundleAnalyzer(withNextra(config));
}
