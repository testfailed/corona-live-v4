import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), EnvironmentPlugin(["API_URL"])],
  resolve: {
    alias: {},
  },
  server: {
    port: 4950,
  },
  define: {},
});
