import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    EnvironmentPlugin(["API_URL", "SENTRY_DSN"]),
  ],
  resolve: {
    alias: {},
  },
  build: {
    outDir: "./build",
  },
  server: {
    port: Number(process.env.PORT || 3000),
  },
  define: {},
});
