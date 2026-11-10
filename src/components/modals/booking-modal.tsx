import { useEffect, useRef } from "react"
import { Alert, Form, Input, Modal } from "antd"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useAppMutation } from "../../hooks"
import { useSlotLookup } from "../../hooks/use-slots"
import { paths } from "../../services/static"
import { FORM } from "../../static"
import type { Booking, NewBooking, Slot } from "../../types"
import { Utils } from "../../utils"

// Mirrors the API's checks so most mistakes are caught before a request
// (and before it counts towards the 5-attempts-a-minute limit).
const schema = z.object({
  name: z.string().trim().min(1, "Enter your full name").max(200, "Keep it under 200 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
})

type FormValues = z.infer<typeof schema>

const BookingModal = ({ slot, onClose }: { slot: Slot | null; onClose: () => void }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { byId } = useSlotLookup()

  // The same attempt (same body) keeps its Idempotency-Key, so a double
  // click or a retry after a dropped connection can't book twice. Changing
  // any field makes it a new attempt with a new key.
  const attempt = useRef<{ body: string; key: string } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  })

  useEffect(() => {
    if (slot) attempt.current = null
  }, [slot])

  const refreshSlots = () => queryClient.invalidateQueries({ queryKey: ["slots"] })

  const mutation = useAppMutation<Booking>({
    mutationKey: ["bookings"],
    path: paths.bookings,
    method: "post",
    onSuccess: (booking: Booking) => {
      refreshSlots()
      reset()
      onClose()
      navigate(`/bookings/${booking.id}`, { state: { justBooked: true } })
    },
  })

  // Fresh availability for the open slot: if someone else books it while
  // this dialog is open, the next refresh (or a 409) flips it here.
  const current = slot ? (byId.get(slot.id) ?? slot) : null
  const taken = !!current && !current.available
  const started = !!current && Utils.hasStarted(current.start)

  const onSubmit = async (values: FormValues) => {
    if (!slot || taken || started) return
    const body: NewBooking = { slot_id: slot.id, name: values.name.trim(), email: values.email.trim() }
    const serialized = JSON.stringify(body)
    if (attempt.current?.body !== serialized) {
      attempt.current = { body: serialized, key: Utils.idempotencyKey() }
    }

    const result = await mutation.mutateAsync({
      ...body,
      _headers: { "Idempotency-Key": attempt.current.key },
    })
    // Failed (the error is already shown): the slot may have just gone.
    if (result === false) refreshSlots()
  }

  return (
    <Modal
      open={!!slot}
      onCancel={onClose}
      title="Confirm your appointment"
      okText="Confirm booking"
      onOk={() => handleSubmit(onSubmit)()}
      okButtonProps={{ disabled: taken || started }}
      confirmLoading={mutation.isPending}
      destroyOnHidden
      centered
    >
      {current && (
        <div className="bg-bg-muted border-accent mb-5 border-l-[3px] px-4 py-3">
          <p className="text-fade m-0 text-xs font-semibold">{Utils.longDay(current.start)}</p>
          <p className="display text-text m-0 mt-0.5 text-2xl font-semibold tabular-nums">
            {Utils.timeRange(current.start, current.end)}
          </p>
          <p className="text-secondary-alpha m-0 mt-0.5 text-sm font-medium">with {current.provider}</p>
        </div>
      )}

      {taken && (
        <Alert
          className="mb-4!"
          type="warning"
          showIcon
          message="Someone has just booked this time. Close this and pick another."
        />
      )}
      {started && !taken && (
        <Alert className="mb-4!" type="warning" showIcon message="This time has already started." />
      )}

      <Form layout="vertical" className="flex flex-col gap-5" onFinish={() => handleSubmit(onSubmit)()} disabled={taken || started}>
        <Form.Item
          className="mb-0!"
          label="Full name"
          labelCol={FORM.LABEL_PROPS}
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} autoComplete="name" placeholder="Ada Obi" className={FORM.CLASS_NAME} />
            )}
          />
        </Form.Item>
        <Form.Item
          className="mb-0!"
          label="Email"
          labelCol={FORM.LABEL_PROPS}
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message ?? "You'll use this email to find or cancel your bookings."}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="ada@example.com"
                className={FORM.CLASS_NAME}
              />
            )}
          />
        </Form.Item>
        {/* Lets Enter submit from either field. */}
        <button type="submit" hidden aria-hidden tabIndex={-1} />
      </Form>
    </Modal>
  )
}

export default BookingModal
