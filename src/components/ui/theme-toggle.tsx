import { useEffect, useRef, useState } from "react"
import type { IconType } from "react-icons"
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi"
import { useApp, useAppDispatch } from "../../hooks"
import { setThemeOverride } from "../../state/slices/app-slice"
import { cn } from "../../utils"

type ThemeOverride = "light" | "dark" | null

const OPTIONS: { mode: ThemeOverride; label: string; icon: IconType }[] = [
  { mode: null, label: "Use system theme", icon: FiMonitor },
  { mode: "light", label: "Switch to light mode", icon: FiSun },
  { mode: "dark", label: "Switch to dark mode", icon: FiMoon },
]

/** 3-way system/light/dark segmented control with a sliding indicator. */
const ThemeToggle = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch()
  const { themeOverride } = useApp()

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const activeIndex = OPTIONS.findIndex((o) => o.mode === themeOverride)

  useEffect(() => {
    const btn = buttonRefs.current[activeIndex]
    const container = containerRef.current
    if (!btn || !container) return

    const containerRect = container.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()

    setIndicator({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    })
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Theme"
      className={cn("bg-bg-muted relative inline-flex items-center gap-0.5 p-1", className)}
    >
      <div
        className="bg-bg shadow-hover absolute top-1 bottom-1"
        style={{
          left: indicator.left,
          width: indicator.width,
          transition:
            "left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
        }}
      />

      {OPTIONS.map(({ mode, label, icon: Icon }, i) => {
        const active = themeOverride === mode
        return (
          <button
            key={label}
            ref={(el) => {
              buttonRefs.current[i] = el
            }}
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => dispatch(setThemeOverride(mode))}
            className={cn(
              "relative z-1 flex h-7 w-7 cursor-pointer items-center justify-center border-none bg-transparent transition-colors",
              active ? "text-text" : "text-fade hover:text-text"
            )}
          >
            <Icon size={14} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle
