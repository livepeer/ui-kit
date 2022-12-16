const { withSentryConfig } = require('@sentry/nextjs');

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  flexsearch: {
    codeblocks: true,
  },
  staticImage: true,
  contentDump: true,
  defaultShowCopyCode: true,
});

const newLivepeerDocs = 'https://docs.livepeer.org';

/** @type {import('next').NextConfig} */
const config = {
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
  typescript: {
    // Disable type checking since eslint handles this
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/react/:slug*',
        destination: `${newLivepeerDocs}/reference/livepeer-js/:slug*`,
        permanent: false,
      },
      {
        source: '/examples/react/:slug*',
        destination: `${newLivepeerDocs}/guides/developing`,
        permanent: false,
      },
      {
        source: '/:slug*',
        destination: `${newLivepeerDocs}/reference/livepeer-js`,
        permanent: false,
      },
    ];
  },
};

// https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

if (process.env.NODE_ENV === 'development') {
  const withPreconstruct = require('@preconstruct/next');
  module.exports = withPreconstruct(withNextra(config));
} else {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  module.exports = withSentryConfig(
    withBundleAnalyzer(withNextra(config)),
    sentryWebpackPluginOptions,
  );
}
