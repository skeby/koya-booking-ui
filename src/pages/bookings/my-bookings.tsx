import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Empty, Input, Skeleton, Table, type TableColumnsType } from "antd"
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi"
import { useSearchParams } from "../../hooks"
import { usePatientBookings } from "../../hooks/use-bookings"
import { useSlotLookup } from "../../hooks/use-slots"
import StatusTag from "../../components/ui/status-tag"
import type { Booking, Slot } from "../../types"
import { Utils, cn } from "../../utils"

/**
 * Cursor pagination: the API only gives a `next_cursor`, so the page keeps
 * the cursors it has used to be able to step back. Changing the email
 * starts over from the first page.
 */
const MyBookings = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const email = (searchParams.get("email") ?? "").trim()

  const [draft, setDraft] = useState(email)
  const [pages, setPages] = useState<{ email: string; cursors: (string | null)[] }>({
    email,
    cursors: [null],
  })
  // Reset the cursor stack when the email in the URL changes.
  const cursors = pages.email === email ? pages.cursors : [null]
  const cursor = cursors[cursors.length - 1] ?? null

  const { data, isLoading, isFetching } = usePatientBookings(email, cursor)
  const { byId } = useSlotLookup()
  const page = data || null

  const columns: TableColumnsType<Booking> = [
    {
      title: "Appointment",
      key: "when",
      render: (_, booking) => {
        const slot: Slot | undefined = byId.get(booking.slot_id)
        if (!slot) return <span className="text-fade">Slot {booking.slot_id}</span>
        return (
          <div>
            <p className="text-text m-0 font-semibold">{Utils.shortDay(slot.start)}</p>
            <p className="text-fade m-0 text-xs tabular-nums">{Utils.timeRange(slot.start, slot.end)}</p>
          </div>
        )
      },
    },
    {
      title: "Doctor",
      key: "provider",
      render: (_, booking) => byId.get(booking.slot_id)?.provider ?? "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: "Reference",
      dataIndex: "id",
      render: (id: string) => <span className="display tracking-wider">{Utils.reference(id)}</span>,
    },
    {
      title: "Booked",
      dataIndex: "created_at",
      render: (createdAt: string) => <span className="text-fade text-xs">{Utils.dateTime(createdAt)}</span>,
    },
  ]

  const bookings = page ? page.bookings : []
  const emptyState = (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No bookings for ${email}.`} className="wrap-anywhere" />
  )

  const search = () => {
    const next = draft.trim()
    setSearchParams({ email: next })
    setPages({ email: next, cursors: [null] })
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="display text-text m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your bookings
        </h1>
        <p className="text-fade m-0 mt-2 max-w-xl text-sm leading-6">
          Enter the email you booked with to see your appointments, oldest first. Open one to view or
          cancel it.
        </p>
      </section>

      <form
        className="flex max-w-xl gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          search()
        }}
      >
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Email"
          placeholder="ada@example.com"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          prefix={<FiSearch className="text-fade-2" aria-hidden />}
        />
        <Button type="primary" htmlType="submit" className="h-11! px-5!" disabled={!draft.trim()}>
          Find
        </Button>
      </form>

      {email && (
        <section className="card overflow-hidden">
          {/* Phones: stacked cards, so status and time never sit off-screen. */}
          <div className="sm:hidden">
            {isLoading ? (
              <div className="p-4">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-6">{emptyState}</div>
            ) : (
              <ul className={cn("divide-border-muted m-0 list-none divide-y p-0", isFetching && "opacity-60")}>
                {bookings.map((booking) => {
                  const slot = byId.get(booking.slot_id)
                  return (
                    <li key={booking.id}>
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="hover:bg-primary-light! block px-4 py-3.5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-text m-0 text-sm font-semibold">
                              {slot ? Utils.shortDay(slot.start) : "Time no longer listed"}
                              {slot && (
                                <span className="text-fade ml-2 font-normal tabular-nums">
                                  {Utils.timeRange(slot.start, slot.end)}
                                </span>
                              )}
                            </p>
                            <p className="text-secondary-alpha m-0 mt-0.5 text-[13px] wrap-anywhere">
                              {slot?.provider ?? `Slot ${booking.slot_id}`}
                            </p>
                          </div>
                          <span className="shrink-0">
                            <StatusTag status={booking.status} />
                          </span>
                        </div>
                        <p className="text-fade-2 m-0 mt-1.5 text-xs">
                          <span className="display text-fade tracking-wider">{Utils.reference(booking.id)}</span>
                          {" · "}Booked {Utils.dateTime(booking.created_at)}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <Table<Booking>
            className="hidden sm:block"
            rowKey="id"
            columns={columns}
            dataSource={bookings}
            loading={isLoading || isFetching}
            pagination={false}
            scroll={{ x: 640 }}
            onRow={(booking) => ({
              onClick: () => navigate(`/bookings/${booking.id}`),
              className: "cursor-pointer",
            })}
            locale={{ emptyText: emptyState }}
          />
          {(cursors.length > 1 || page?.next_cursor) && (
            <div className="border-border-muted flex items-center justify-between gap-3 border-t px-4 py-3">
              <span className="text-fade text-xs">Page {cursors.length}</span>
              <div className="flex gap-2">
                <Button
                  icon={<FiChevronLeft aria-hidden />}
                  disabled={cursors.length <= 1 || isFetching}
                  onClick={() => setPages({ email, cursors: cursors.slice(0, -1) })}
                >
                  Previous
                </Button>
                <Button
                  disabled={!page?.next_cursor || isFetching}
                  onClick={() =>
                    page?.next_cursor && setPages({ email, cursors: [...cursors, page.next_cursor] })
                  }
                >
                  Next <FiChevronRight aria-hidden />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default MyBookings
