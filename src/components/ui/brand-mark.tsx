import { cn } from "../../utils"
import { APP_NAME } from "../../static"

/** Square medical cross: the clinic glyph. */
const CrossGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" role="img" aria-label={APP_NAME} className={className}>
    <rect width="32" height="32" className="fill-primary" />
    <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" className="fill-primary-foreground" />
  </svg>
)

/** Glyph plus wordmark; `compact` renders the glyph alone. */
const BrandMark = ({ className, compact = false }: { className?: string; compact?: boolean }) => {
  if (compact) return <CrossGlyph className={cn("size-7", className)} />
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CrossGlyph className="size-7 shrink-0" />
      <span className="display text-text text-[17px] leading-none font-semibold tracking-tight">
        {APP_NAME}
      </span>
    </span>
  )
}

export default BrandMark
