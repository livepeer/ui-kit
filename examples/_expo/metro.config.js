// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const merge = require('lodash.merge');

const expoConfig = getDefaultConfig(__dirname);

const { resolver } = expoConfig;

const config = merge(expoConfig, {
  resolver: {
    ...resolver,
    resolveRequest: MetroSymlinksResolver({
      remapModule: (_context, moduleName) => {
        if (moduleName.startsWith('@babel') || moduleName.startsWith('metro')) {
          return require.resolve(moduleName);
        }
        return moduleName;
      },
    }),
  },
});

module.exports = config;
