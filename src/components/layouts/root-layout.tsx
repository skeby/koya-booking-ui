import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import Spinner from "../ui/spinner"

const RootLayout = () => {
  return (
    <Suspense fallback={<Spinner className="min-h-screen" />}>
      <Outlet />
    </Suspense>
  )
}

export default RootLayout
