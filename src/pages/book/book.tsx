import { useEffect, useMemo, useRef, useState } from "react"
import { Empty, Segmented, Skeleton } from "antd"
import { FiClock } from "react-icons/fi"
import dayjs from "dayjs"
import { useSearchParams } from "../../hooks"
import { useSlots } from "../../hooks/use-slots"
import BookingModal from "../../components/modals/booking-modal"
import type { Slot } from "../../types"
import { Utils, cn } from "../../utils"

const ALL_DOCTORS = "all"

interface Day {
  key: string
  first: string
  slots: Slot[]
  free: number
}

const isBookable = (slot: Slot) => slot.available && !Utils.hasStarted(slot.start)

/** Today and later, grouped by local day, in the API's start order. */
const groupByDay = (slots: Slot[]): Day[] => {
  const today = dayjs().format("YYYY-MM-DD")
  const days = new Map<string, Day>()
  for (const slot of slots) {
    const key = Utils.dayKey(slot.start)
    if (key < today) continue
    const day = days.get(key) ?? { key, first: slot.start, slots: [], free: 0 }
    day.slots.push(slot)
    if (isBookable(slot)) day.free += 1
    days.set(key, day)
  }
  return [...days.values()]
}

const groupByProvider = (slots: Slot[]) => {
  const groups = new Map<string, Slot[]>()
  for (const slot of slots) groups.set(slot.provider, [...(groups.get(slot.provider) ?? []), slot])
  return [...groups.entries()]
}

const SlotChip = ({ slot, onPick }: { slot: Slot; onPick: (slot: Slot) => void }) => {
  const started = Utils.hasStarted(slot.start)
  const reason = started ? "already started" : !slot.available ? "booked" : null
  return (
    <button
      type="button"
      className="slot-chip"
      disabled={!!reason}
      onClick={() => onPick(slot)}
      title={reason ? `${Utils.timeRange(slot.start, slot.end)}, ${reason}` : Utils.timeRange(slot.start, slot.end)}
      aria-label={`${Utils.timeRange(slot.start, slot.end)} with ${slot.provider}${reason ? `, ${reason}` : ""}`}
    >
      {Utils.time(slot.start)}
    </button>
  )
}

const Book = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const doctor = searchParams.get("doctor") || ALL_DOCTORS
  const [picked, setPicked] = useState<Slot | null>(null)

  // Doctor list comes from every slot; the grid asks the API for one
  // doctor's slots when a doctor is chosen.
  const allSlots = useSlots()
  const doctorSlots = useSlots(doctor === ALL_DOCTORS ? undefined : doctor)

  const providers = useMemo(
    () => [...new Set((allSlots.data ? allSlots.data.slots : []).map((slot) => slot.provider))].sort(),
    [allSlots.data]
  )
  const days = useMemo(() => groupByDay(doctorSlots.data ? doctorSlots.data.slots : []), [doctorSlots.data])

  const requestedDay = searchParams.get("day")
  const day =
    days.find((d) => d.key === requestedDay) ?? days.find((d) => d.free > 0) ?? days[0]

  const loading = doctorSlots.isLoading || allSlots.isLoading

  // On narrow screens the doctor tabs and day strip scroll sideways; keep the
  // selected ones visible (e.g. after opening a link with ?doctor=&day=).
  const filtersRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = filtersRef.current
    if (!root) return
    for (const el of root.querySelectorAll(".ant-segmented-item-selected, [role=tab][aria-selected=true]")) {
      const strip = el.closest(".overflow-x-auto")
      if (!strip) continue
      const box = strip.getBoundingClientRect()
      const item = el.getBoundingClientRect()
      if (item.left < box.left || item.right > box.right) {
        // Centre it, or show its start when it is wider than the strip.
        const offset = item.width >= box.width ? 0 : (box.width - item.width) / 2
        strip.scrollLeft += item.left - box.left - offset
      }
    }
  }, [doctor, day?.key, providers.length])

  return (
    <div className="space-y-6">
      <section>
        <h1 className="display text-text m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
          Book an appointment
        </h1>
        <p className="text-fade m-0 mt-2 max-w-xl text-sm leading-6">
          Choose a doctor and a time, then confirm with your name and email. You'll get a reference to
          show at the front desk.
        </p>
      </section>

      <section className="card">
        <div ref={filtersRef} className="border-border-muted space-y-4 border-b p-4 sm:p-5">
          <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
            <Segmented
              value={doctor}
              onChange={(value) => setSearchParams({ doctor: value === ALL_DOCTORS ? "" : String(value), day: "" })}
              options={[
                { label: "All doctors", value: ALL_DOCTORS },
                ...providers.map((provider) => ({ label: provider, value: provider })),
              ]}
            />
          </div>

          {days.length > 0 && (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Day">
              {days.map((d) => {
                const active = d.key === day?.key
                return (
                  <button
                    key={d.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSearchParams({ day: d.key })}
                    className={cn(
                      "flex min-w-19 shrink-0 cursor-pointer flex-col items-start border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-bg text-text hover:border-border-active"
                    )}
                  >
                    <span className={cn("text-[11px] font-semibold uppercase", active ? "opacity-80" : "text-fade")}>
                      {dayjs(d.first).format("ddd")}
                    </span>
                    <span className="display text-lg leading-6 font-semibold tabular-nums">
                      {dayjs(d.first).format("D MMM")}
                    </span>
                    <span className={cn("text-[11px]", active ? "opacity-80" : d.free ? "text-accent" : "text-fade-2")}>
                      {d.free ? `${d.free} free` : "None left"}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : !day ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No appointment times are open right now. Please check back later."
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-text m-0 text-base font-bold">{Utils.longDay(day.first)}</h2>
                <p className="text-fade-2 m-0 flex items-center gap-1.5 text-xs">
                  <FiClock aria-hidden /> Times in your time zone ({Utils.timeZone()})
                </p>
              </div>

              {groupByProvider(day.slots).map(([provider, slots]) => {
                const free = slots.filter(isBookable).length
                return (
                  <div key={provider}>
                    <div className="mb-2.5 flex items-baseline justify-between gap-3">
                      <h3 className="text-secondary-alpha m-0 min-w-0 text-sm font-semibold wrap-anywhere">
                        {provider}
                      </h3>
                      <span className="text-fade-2 shrink-0 text-xs whitespace-nowrap">
                        {free} of {slots.length} free
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
                      {slots.map((slot) => (
                        <SlotChip key={slot.id} slot={slot} onPick={setPicked} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <BookingModal slot={picked} onClose={() => setPicked(null)} />
    </div>
  )
}

export default Book
