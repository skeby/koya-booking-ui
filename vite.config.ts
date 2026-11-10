import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // No VITE_ prefix: API_URL and API_KEY stay in this Node process and are
  // never inlined into the browser bundle.
  const env = loadEnv(mode, process.cwd(), "")

  return {
    build: {
      outDir: "build",
    },
    plugins: [react(), tailwindcss()],
    server: {
      // Dev twin of api/proxy.ts: the browser calls /api/*, the dev server
      // adds the API key and forwards to the booking API.
      proxy: {
        "/api": {
          target: env.API_URL || "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          headers: { "X-API-Key": env.API_KEY ?? "" },
        },
      },
    },
  }
})
