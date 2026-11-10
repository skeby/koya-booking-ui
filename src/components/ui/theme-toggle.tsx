import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import type { IconType } from "react-icons"
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi"
import { useApp, useAppDispatch, useTheme } from "../../hooks"
import { setThemeOverride } from "../../state/slices/app-slice"
import { cn } from "../../utils"

type ThemeOverride = "light" | "dark" | null

const OPTIONS: { mode: ThemeOverride; label: string; icon: IconType }[] = [
  { mode: null, label: "Use system theme", icon: FiMonitor },
  { mode: "light", label: "Switch to light mode", icon: FiSun },
  { mode: "dark", label: "Switch to dark mode", icon: FiMoon },
]

/**
 * Reveals the new theme through a circle growing out of the clicked button,
 * softening from a slight blur (the unoye-hr-ui theme toggle). Browsers
 * without view transitions, and anyone who has asked for less motion, get the
 * change straight away.
 */
const revealTheme = (origin: HTMLElement, applyTheme: () => void) => {
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    applyTheme()
    return
  }

  const box = origin.getBoundingClientRect()
  const x = box.left + box.width / 2
  const y = box.top + box.height / 2
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // Synchronous, so the new theme is on the page when the browser captures it.
  const transition = document.startViewTransition(() => flushSync(applyTheme))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
          filter: ["blur(4px)", "blur(0px)"],
        },
        {
          duration: 500,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
    .catch(() => {})
}

/** 3-way system/light/dark segmented control with a sliding indicator. */
const ThemeToggle = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch()
  const { themeOverride } = useApp()
  const { theme } = useTheme()

  const choose = (mode: ThemeOverride, origin: HTMLElement) => {
    if (mode === themeOverride) return
    const apply = () => dispatch(setThemeOverride(mode))
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    // Only animate when the page actually changes (e.g. not "system" while
    // the system already matches the current theme).
    if ((mode ?? systemTheme) === theme) apply()
    else revealTheme(origin, apply)
  }

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
            onClick={(event) => choose(mode, event.currentTarget)}
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
