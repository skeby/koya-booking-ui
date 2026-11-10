import { cn } from "../../utils"

/**
 * "Booking not found" illustration: a calendar card with one missing day and
 * a magnifier. Drawn with the theme's colour tokens (unlike antd's stock 404
 * picture), so it follows light and dark mode and keeps the square corners.
 */
const NotFoundIllustration = ({ className }: { className?: string }) => {
  const days = Array.from({ length: 12 }, (_, i) => ({ x: 34 + (i % 4) * 22, y: 58 + Math.floor(i / 4) * 18 }))
  const missing = 6

  return (
    <svg viewBox="0 0 170 140" role="img" aria-label="Booking not found" className={cn("h-36 w-auto", className)}>
      {/* calendar card */}
      <rect x="20" y="24" width="110" height="96" fill="var(--color-bg-muted)" stroke="var(--color-border)" strokeWidth="2" />
      <rect x="20" y="24" width="110" height="20" fill="var(--color-border)" />
      <rect x="44" y="14" width="6" height="18" fill="var(--color-fade-2)" />
      <rect x="100" y="14" width="6" height="18" fill="var(--color-fade-2)" />

      {/* days, one of them missing */}
      {days.map((day, i) =>
        i === missing ? (
          <rect
            key={i}
            x={day.x}
            y={day.y}
            width="14"
            height="11"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
        ) : (
          <rect key={i} x={day.x} y={day.y} width="14" height="11" fill="var(--color-border)" />
        )
      )}

      {/* magnifier */}
      <line x1="138" y1="116" x2="154" y2="132" stroke="var(--color-text)" strokeWidth="6" strokeLinecap="square" />
      <circle cx="124" cy="102" r="20" fill="var(--color-bg)" stroke="var(--color-text)" strokeWidth="4" />
      <text
        x="124"
        y="110"
        textAnchor="middle"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="var(--color-accent)"
      >
        ?
      </text>
    </svg>
  )
}

export default NotFoundIllustration
