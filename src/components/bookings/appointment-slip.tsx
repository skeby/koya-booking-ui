import type { ReactNode } from "react"
import StatusTag from "../ui/status-tag"
import type { Booking, Slot } from "../../types"
import { Utils, cn } from "../../utils"

// Details wrap instead of truncating: a confirmation must show the full name
// and email so the patient can check them.
const Detail = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
  <div className={cn("min-w-0", className)}>
    <dt className="text-fade text-[11px] font-bold tracking-wide uppercase">{label}</dt>
    <dd className="text-text m-0 mt-1 text-sm font-semibold wrap-anywhere">{children}</dd>
  </div>
)

/**
 * The booking confirmation, laid out like a clinic appointment card: date
 * and time up top, who and with whom in the middle, and a torn-off stub
 * with the reference to quote at the front desk.
 */
const AppointmentSlip = ({ booking, slot }: { booking: Booking; slot?: Slot }) => {
  const cancelled = booking.status === "cancelled"

  return (
    <article className="slip" aria-label="Appointment details">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
        <p className="text-fade m-0 text-[11px] font-bold tracking-[0.14em] uppercase">Appointment</p>
        <StatusTag status={booking.status} />
      </div>

      <div className={cn("px-5 pt-3 pb-6 sm:px-7", cancelled && "opacity-60")}>
        {slot ? (
          <>
            <p className="text-secondary-alpha m-0 text-base font-semibold sm:text-lg">
              {Utils.longDay(slot.start)}
            </p>
            <p
              className={cn(
                "display text-text m-0 mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl",
                cancelled && "line-through decoration-2"
              )}
            >
              {Utils.timeRange(slot.start, slot.end)}
            </p>
          </>
        ) : (
          <>
            <p className="display text-text m-0 text-2xl font-semibold">Time no longer listed</p>
            <p className="text-fade m-0 mt-1 text-xs wrap-anywhere">
              This slot ({booking.slot_id}) has been removed from the schedule. Please contact the clinic.
            </p>
          </>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
          <Detail label="Doctor">{slot?.provider ?? "—"}</Detail>
          <Detail label="Length">
            {slot ? `${Utils.minutesBetween(slot.start, slot.end)} minutes` : "—"}
          </Detail>
          <Detail label="Patient" className="col-span-2 sm:col-span-1">
            {booking.name}
          </Detail>
          <Detail label="Email" className="col-span-2 sm:col-span-1">
            {booking.email}
          </Detail>
        </dl>
      </div>

      <hr className="slip-tear" />

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-7">
        <p className="text-fade m-0 text-xs">
          Reference{" "}
          <span className="display text-text ml-1 text-base font-semibold tracking-wider">
            {Utils.reference(booking.id)}
          </span>
        </p>
        <p className="text-fade-2 m-0 text-xs">Booked {Utils.dateTime(booking.created_at)}</p>
      </div>
    </article>
  )
}

export default AppointmentSlip
