import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 30000
  },
  resolve: {
    alias: {
      "@aireleasekit/core": path.join(root, "packages/core/src/index.ts")
    }
  }
});
