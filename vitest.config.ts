import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Several guardrail tests scan every file in src and scripts, which takes
    // a few seconds on a cold cache. They are file reads, not long tasks.
    testTimeout: 30000,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
