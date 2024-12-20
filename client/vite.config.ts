import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // port: 3000,
    // proxy: {
    //   "/api/v1": {
    //     target: "http://localhost:3000",
    //     changeOrigin: true,
    //   },
    // },
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
