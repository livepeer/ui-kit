import { defineConfig } from "tsup";

/** @type {import('tsup').Options} */
const options = {
  splitting: false,
  clean: true,
  sourcemap: true,
  dts: true,
  format: ["esm", "cjs"],
};

const entrypoints = ["crypto"];

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
]);
