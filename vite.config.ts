import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],

  // Development server configuration
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    host: true, // Expose to network
  },

  // Build optimization
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          skeleton: ["@skeletonlabs/skeleton"],
        },
      },
    },
  },

  // Performance optimizations
  optimizeDeps: {
    exclude: ["@skeletonlabs/skeleton"],
  },

  // Environment variable configuration
  envPrefix: "APP_",
});
