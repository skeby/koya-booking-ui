import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import Header from "./header"
import MobileNav from "./mobile-nav"
import Spinner from "../ui/spinner"
import { APP_NAME } from "../../static"

const MainLayout = () => {
  return (
    <div className="bg-background-primary flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 sm:px-6 sm:pt-10 sm:pb-12">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-border-muted text-fade-2 hidden border-t py-6 text-center text-xs sm:block">
        {APP_NAME} · Need a different time? Cancel your booking and book again.
      </footer>
      <MobileNav />
    </div>
  )
}

export default MainLayout
