import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ThemeProvider from "./theme-provider"
import { queryClient } from "./query-client"
import { store } from "../state/store"
import { message } from "antd"

message.config({
  duration: 6,
  maxCount: 2,
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position="right" />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default Providers
