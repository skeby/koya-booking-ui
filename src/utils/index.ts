import clsx, { type ClassValue } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export class Utils {
  /** "slot is already booked" -> "Slot is already booked." for toasts. */
  static sentence = (text: string | undefined): string => {
    if (!text) return ""
    const trimmed = text.trim()
    const capped = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    return /[.!?]$/.test(capped) ? capped : `${capped}.`
  }

  /** Local calendar day, used to group slots: "2026-11-11". */
  static dayKey = (iso: string): string => dayjs(iso).format("YYYY-MM-DD")

  /** "09:00" */
  static time = (iso: string): string => dayjs(iso).format("HH:mm")

  /** "09:00 – 09:30" */
  static timeRange = (start: string, end: string): string =>
    `${Utils.time(start)} – ${Utils.time(end)}`

  /** "Wed 11 Nov" */
  static shortDay = (iso: string): string => dayjs(iso).format("ddd D MMM")

  /** "Wednesday, 11 November 2026" */
  static longDay = (iso: string): string => dayjs(iso).format("dddd, D MMMM YYYY")

  /** "11 Nov 2026, 14:05" */
  static dateTime = (iso: string): string => dayjs(iso).format("D MMM YYYY, HH:mm")

  static minutesBetween = (start: string, end: string): number =>
    dayjs(end).diff(dayjs(start), "minute")

  static hasStarted = (iso: string): boolean => dayjs(iso).valueOf() <= Date.now()

  /** Short reference a patient can read out at the front desk: "#6A56AB". */
  static reference = (id: string | undefined): string =>
    id ? `#${id.slice(-6).toUpperCase()}` : "—"

  /** The visitor's time zone, so times are never ambiguous: "Africa/Lagos". */
  static timeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone

  /** A new key per booking attempt; reused when the same attempt is retried. */
  static idempotencyKey = (): string =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  static parseJSON<T>(jsonString: string | null | undefined, fallback: T | null = null): T | null {
    if (!jsonString) return fallback
    try {
      return JSON.parse(jsonString) as T
    } catch {
      return fallback
    }
  }
}
