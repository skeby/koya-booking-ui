import { useEffect, useState } from "react"
import { useApp } from "./index"

type ThemeMode = "light" | "dark"

/**
 * Theme state: manual override (app-slice) wins, otherwise follow the system.
 * Brand colors are fixed (no per-org branding here) and exposed for antd.
 */
export const useTheme = () => {
  const { themeOverride } = useApp()

  const [systemPreference, setSystemPreference] = useState<ThemeMode>(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const theme: ThemeMode = themeOverride ?? systemPreference
  const isDarkMode = theme === "dark"

  return {
    theme,
    isDarkMode,
    primary: isDarkMode ? "#ededed" : "#171717",
    primaryForeground: isDarkMode ? "#0a0a0a" : "#ffffff",
    primaryTint: isDarkMode ? "#262626" : "#f0f0f0",
  }
}

export default useTheme
