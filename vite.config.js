
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "robots.txt",
          "pulsan-icon-192.png",
          "pulsan-icon-512.png",
        ],
        manifest: {
          name: "Pulsan – ajuda anônima a quem precisa",
          short_name: "Pulsan",
          description: "Pulsan é uma plataforma de apoio emocional e ajuda anônima.",
          theme_color: "#0F2D5B",
          background_color: "#FFFFFF",
          display: "standalone",
          orientation: "portrait-primary",
          icons: [
            {
              src: "/pulsan-icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pulsan-icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\/api\//],
        },
      }),
    ],
    server: {
      proxy: {
        "/api/supabase-auth": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        "/api/supabase-rest": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

