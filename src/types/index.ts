/** Mirrors the booking API's schemas (koyaacademy.com/assessment-api). */

export interface Slot {
  id: string
  provider: string
  start: string
  end: string
  available: boolean
}

export type BookingStatus = "confirmed" | "cancelled"

export interface Booking {
  id: string
  slot_id: string
  name: string
  email: string
  status: BookingStatus
  created_at: string
}

export interface BookingsPage {
  bookings: Booking[]
  next_cursor: string | null
}

export interface NewBooking {
  slot_id: string
  name: string
  email: string
}
