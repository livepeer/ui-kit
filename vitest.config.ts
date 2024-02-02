import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        ...configDefaults.exclude,
        "**/examples/**",
        "**/test/**",
        "**/*.d.ts",
        "**/generate-version.ts",
      ],
    },
    environment: "jsdom",
    setupFiles: [
      "./packages/core/test/setup.ts",
      "./packages/react/test/setup.ts",
    ],
  },
});
