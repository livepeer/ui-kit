import { defineConfig } from "tsup";

/** @type {import('tsup').Options} */
const options = {
  splitting: false,
  clean: true,
  sourcemap: true,
  dts: true,
  format: ["esm", "cjs"],
};

const entrypoints = [
  "crypto",
  "errors",
  "media",
  "storage",
  "utils",
  "version",
];

export default defineConfig([
  {
    ...options,
    entry: {
      index: "src/external.ts",
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
]);
