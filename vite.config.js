import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    modules: {
      localsConvention: "camelCase", // Esto permite usar guiones en CSS pero camelCase en JS
    },
  },
  build: {
    outDir: "dist", // Asegúrate que coincide con la configuración de Netlify
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:5173/",
        target: "https://api.hotelddguineaecuatorial.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  base: "/", //
});
