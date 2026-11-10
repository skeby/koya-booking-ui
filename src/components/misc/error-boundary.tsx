import { useRouteError, Link } from "react-router-dom"
import { Button } from "antd"
import { FiAlertTriangle } from "react-icons/fi"

const ErrorBoundary = () => {
  const error = useRouteError() as Error | undefined

  return (
    <div className="bg-background-primary flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <FiAlertTriangle className="text-fade-2 text-5xl" aria-hidden />
      <h1 className="display text-text text-2xl font-semibold">This page didn't load</h1>
      <p className="text-fade max-w-md text-sm">
        {error?.message || "Something went wrong while loading this page."}
      </p>
      <Link to="/">
        <Button type="primary">Back to booking</Button>
      </Link>
    </div>
  )
}

export default ErrorBoundary
