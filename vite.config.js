import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base:
    process.env.VITE_BASE ??
    (command === "build" ? "/wmsurvey/" : "/"),
  plugins: [react()],
  server: { port: 5173, open: true },
  esbuild: {
    loader: "jsx",
    include: [/\.[jt]sx?$/],
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
}));
