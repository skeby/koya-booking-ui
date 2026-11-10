import { createBrowserRouter } from "react-router-dom"
import RootLayout from "./components/layouts/root-layout"
import ErrorBoundary from "./components/misc/error-boundary"

/**
 * Helper to simplify the lazy import syntax for default exports.
 * Includes retry logic to handle Vite HMR invalidating cached module URLs,
 * which causes "Failed to fetch dynamically imported module" errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- page modules have heterogeneous prop types
const lazyRoute = (importFn: () => Promise<any>) => async () => {
  try {
    const module = await importFn()
    return { Component: module.default }
  } catch {
    try {
      const module = await importFn()
      return { Component: module.default }
    } catch {
      return { Component: () => null }
    }
  }
}

// Patient-facing site: no sign-in, so no auth or permission guards.
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    element: <RootLayout />,
    children: [
      {
        path: "/",
        lazy: lazyRoute(() => import("./components/layouts/main-layout")),
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./pages/book/book")),
          },
          {
            path: "bookings",
            lazy: lazyRoute(() => import("./pages/bookings/my-bookings")),
          },
          {
            path: "bookings/:id",
            lazy: lazyRoute(() => import("./pages/bookings/booking-details")),
          },
        ],
      },
    ],
  },
])

export default router
