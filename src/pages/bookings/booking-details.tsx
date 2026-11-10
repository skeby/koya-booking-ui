import { Link, useLocation, useParams } from "react-router-dom"
import { Button, Modal, Result, Skeleton, message } from "antd"
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi"
import { useQueryClient } from "@tanstack/react-query"
import { useAppMutation } from "../../hooks"
import { useBooking } from "../../hooks/use-bookings"
import { useSlotLookup } from "../../hooks/use-slots"
import AppointmentSlip from "../../components/bookings/appointment-slip"
import NotFoundIllustration from "../../components/ui/not-found-illustration"
import { paths } from "../../services/static"
import type { Booking } from "../../types"
import { Utils } from "../../utils"

const BookingDetails = () => {
  const { id } = useParams()
  const { state } = useLocation() as { state: { justBooked?: boolean } | null }
  const queryClient = useQueryClient()
  const [modal, modalContext] = Modal.useModal()

  const booking = useBooking(id)
  const { byId, isLoading: slotsLoading } = useSlotLookup()

  const cancel = useAppMutation<Booking>({
    mutationKey: ["bookings"],
    path: `${paths.bookings}/${id}`,
    method: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] })
      message.success(
        "Appointment cancelled. The time is free for other patients."
      )
    },
  })

  if (booking.isLoading || slotsLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  const data = booking.data
  if (!data) {
    return (
      <Result
        icon={<NotFoundIllustration className="mx-auto" />}
        title="We couldn't find that booking"
        subTitle="Check the link, or look your bookings up by email."
        extra={
          <Link to="/bookings">
            <Button type="primary">Find my bookings</Button>
          </Link>
        }
      />
    )
  }

  const slot = byId.get(data.slot_id)
  const confirmed = data.status === "confirmed"
  const upcoming = slot ? !Utils.hasStarted(slot.start) : true
  const justBooked = !!state?.justBooked && confirmed

  const confirmCancel = () =>
    modal.confirm({
      title: "Cancel this appointment?",
      content: slot
        ? `${Utils.longDay(slot.start)}, ${Utils.timeRange(slot.start, slot.end)} with ${slot.provider}. The time becomes available to other patients. This can't be undone.`
        : "The time becomes available to other patients. This can't be undone.",
      okText: "Cancel appointment",
      okButtonProps: { danger: true },
      cancelText: "Keep it",
      centered: true,
      onOk: () => cancel.mutateAsync({}),
    })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {modalContext}

      <Link
        to={`/bookings?email=${encodeURIComponent(data.email)}`}
        className="text-fade! hover:text-text! flex max-w-full items-center gap-1.5 text-[13px] font-semibold"
      >
        <FiArrowLeft aria-hidden className="shrink-0" />
        <span className="min-w-0 truncate">All bookings for {data.email}</span>
      </Link>

      <header>
        {justBooked ? (
          <>
            <p className="text-success m-0 flex items-center gap-2 text-sm font-semibold">
              <FiCheckCircle aria-hidden /> Booking confirmed
            </p>
            <h1 className="display text-text m-0 mt-1 text-3xl font-semibold tracking-tight">
              You're booked in, {data.name.split(" ")[0]}
            </h1>
            <p className="text-fade m-0 mt-2 text-sm leading-6">
              Keep your reference. Please arrive 10 minutes early.
            </p>
          </>
        ) : (
          <h1 className="display text-text m-0 text-3xl font-semibold tracking-tight">
            Your appointment
          </h1>
        )}
      </header>

      <AppointmentSlip booking={data} slot={slot} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {confirmed && upcoming ? (
          <Button
            danger
            size="large"
            onClick={confirmCancel}
            loading={cancel.isPending}
          >
            Cancel appointment
          </Button>
        ) : (
          <span />
        )}
        <Link to="/">
          <Button type="primary" size="large" block>
            Book another time
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default BookingDetails
