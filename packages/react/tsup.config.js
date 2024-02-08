import { defineConfig } from "tsup";

/** @type {import('tsup').Options} */
const options = {
  splitting: false,
  clean: true,
  sourcemap: true,
  dts: true,
  format: ["esm", "cjs"],
};

/** @type {import('tsup').Options} */
const reactServerOptions = {
  ...options,
  external: ["react"],
};

/** @type {import('tsup').Options} */
const reactClientOptions = {
  ...reactServerOptions,
  esbuildOptions: (options) => {
    // Append "use client" to the top of the react entry point
    options.banner = {
      js: '"use client";',
    };
  },
};

const entrypoints = ["crypto", "external"];
const reactServerEntrypoints = ["assets"];
const reactClientEntrypoints = ["broadcast", "player"];

export default defineConfig([
  {
    ...options,
    entry: {
      index: "src/index.ts",
    },
    outDir: "dist",
  },
  ...entrypoints.map((entrypoint) => ({
    ...options,
    entry: {
      index: `src/${entrypoint}.ts`,
    },
    outDir: `dist/${entrypoint}`,
  })),
  ...reactServerEntrypoints.map((reactEntrypoint) => ({
    ...reactServerOptions,
    entry: {
      index: `src/${reactEntrypoint}.tsx`,
    },
    outDir: `dist/${reactEntrypoint}`,
  })),
  ...reactClientEntrypoints.map((reactEntrypoint) => ({
    ...reactClientOptions,
    entry: {
      index: `src/${reactEntrypoint}.tsx`,
    },
    outDir: `dist/${reactEntrypoint}`,
  })),
]);
