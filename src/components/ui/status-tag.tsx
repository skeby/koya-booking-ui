import { colorMap } from "../../static"

/** Colored dot + label for a booking or slot status (confirmed, cancelled…). */
const StatusTag = ({ status }: { status: string | undefined }) => {
  if (!status) return <span className="text-fade-2">—</span>
  const color = colorMap[status] ?? "#666666"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-semibold capitalize"
      style={{ color, backgroundColor: `${color}1a` }}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-none" style={{ backgroundColor: color }} />
      {status.replace(/_/g, " ")}
    </span>
  )
}

export default StatusTag
