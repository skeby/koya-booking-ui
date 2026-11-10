import { Spin } from "antd"
import { cn } from "../../utils"

const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("flex min-h-[40vh] items-center justify-center", className)}>
    <Spin size="large" />
  </div>
)

export default Spinner
