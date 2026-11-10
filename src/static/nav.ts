import { FiCalendar, FiClipboard } from "react-icons/fi"
import type { IconType } from "react-icons"

export interface NavItem {
  label: string
  href: string
  icon: IconType
  /** Also light up for these path prefixes. */
  matches?: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Book", href: "/", icon: FiCalendar },
  { label: "My bookings", href: "/bookings", icon: FiClipboard, matches: ["/bookings/"] },
]

export const isNavActive = (pathname: string, item: NavItem) =>
  pathname === item.href || (item.matches ?? []).some((prefix) => pathname.startsWith(prefix))
