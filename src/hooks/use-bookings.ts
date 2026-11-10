import { useAppQuery } from "./index"
import { paths } from "../services/static"
import { BOOKINGS_PAGE_SIZE } from "../static"
import type { Booking, BookingsPage } from "../types"

export const useBooking = (id: string | undefined) =>
  useAppQuery<Booking | false>({
    queryKey: ["bookings", "detail", id],
    path: `${paths.bookings}/${id ?? ""}`,
    enabled: !!id,
    refetchOnMount: true,
  })

/** One cursor page of a patient's bookings, oldest first. */
export const usePatientBookings = (email: string, cursor: string | null) =>
  useAppQuery<BookingsPage | false>({
    queryKey: ["bookings", "list", email, cursor],
    path: paths.bookings,
    params: {
      email,
      limit: BOOKINGS_PAGE_SIZE,
      ...(cursor ? { cursor } : {}),
    },
    enabled: !!email,
    keepPreviousData: true,
    refetchOnMount: true,
  })
