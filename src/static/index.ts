export const APP_NAME = "Harbour Clinic"
export const APP_NAME_DASHED = "harbour-clinic"

/** Page size for a patient's booking history (the API allows 1 to 50). */
export const BOOKINGS_PAGE_SIZE = 10

/** How often the slot grid refreshes while open, so taken times grey out. */
export const SLOTS_REFRESH_MS = 30_000

/**
 * Fixed semantic colours: status meaning never depends on the theme's
 * primary colour, and each pair stays legible in dark mode.
 */
export const colorMap: Record<string, string> = {
  confirmed: "#2e7d5b",
  available: "#2e7d5b",
  cancelled: "#a82134",
  booked: "#666666",
  started: "#666666",
}

export const FORM = {
  LABEL_PROPS: { className: "text-sm text-secondary-alpha leading-5" },
  CLASS_NAME: "w-full!",
}
