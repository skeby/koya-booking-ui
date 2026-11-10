import { Link, NavLink, useLocation } from "react-router-dom"
import ThemeToggle from "../ui/theme-toggle"
import BrandMark from "../ui/brand-mark"
import { NAV_ITEMS, isNavActive } from "../../static/nav"
import { cn } from "../../utils"

const Header = () => {
  const { pathname } = useLocation()

  return (
    <header className="bg-bg border-border-muted sticky top-0 z-20 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Home" className="flex items-center">
          <BrandMark />
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item)
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-[13px] font-semibold transition-colors",
                    active ? "bg-primary-tint text-text!" : "text-fade! hover:text-text!"
                  )}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
