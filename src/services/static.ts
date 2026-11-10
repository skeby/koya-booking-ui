// Same-origin: /api/* goes through the proxy (Vite in dev, api/proxy.ts on
// Vercel), which adds the API key server-side.
export const API_BASE_URL = "/api"

export const paths = {
  slots: `${API_BASE_URL}/slots`,
  bookings: `${API_BASE_URL}/bookings`,
} as const
