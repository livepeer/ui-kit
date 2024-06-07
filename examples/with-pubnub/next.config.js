const { NormalModuleReplacementPlugin } = require("webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.net = false;
    }
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /^hexoid$/,
        require.resolve("hexoid/dist/index.js"),
      ),
    );
    return config;
  },
};
