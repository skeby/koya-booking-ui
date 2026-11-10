import { useAppQuery } from "./index"
import { paths } from "../services/static"
import { SLOTS_REFRESH_MS } from "../static"
import type { Slot } from "../types"

/**
 * Every slot, or one provider's (filtered by the API, not here). Refreshes
 * on an interval and on mount so times other patients take grey out.
 */
export const useSlots = (provider?: string) =>
  useAppQuery<{ slots: Slot[] } | false>({
    queryKey: ["slots", provider ?? "all"],
    path: paths.slots,
    params: provider ? { provider } : undefined,
    keepPreviousData: true,
    refetchOnMount: true,
    options: { refetchInterval: SLOTS_REFRESH_MS },
  })

/** Slots by id, for showing a booking's date, time and doctor. */
export const useSlotLookup = () => {
  const query = useSlots()
  const slots = query.data ? query.data.slots : []
  const byId = new Map(slots.map((slot) => [slot.id, slot]))
  return { ...query, byId }
}
