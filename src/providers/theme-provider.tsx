import { useEffect, type ReactNode } from "react"
import AntdProvider from "./antd-provider"
import { useTheme } from "../hooks"

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isDarkMode } = useTheme()

  useEffect(() => {
    // Toggle dark class on <html> for Tailwind CSS dark mode
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  return <AntdProvider>{children}</AntdProvider>
}

export default ThemeProvider
