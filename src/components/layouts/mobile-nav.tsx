import { NavLink, useLocation } from "react-router-dom"
import { NAV_ITEMS, isNavActive } from "../../static/nav"
import { cn } from "../../utils"

/** Bottom tab bar on phones, where the header nav is hidden. */
const MobileNav = () => {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Main"
      className="bg-bg border-border-muted fixed inset-x-0 bottom-0 z-20 flex justify-around border-t py-1.5 sm:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item)
        const Icon = item.icon
        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-none px-4 py-1 text-[10px] font-semibold",
              active ? "text-primary!" : "text-fade!"
            )}
          >
            <Icon className="text-lg" aria-hidden />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default MobileNav
