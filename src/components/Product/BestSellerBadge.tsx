import { FiStar } from "react-icons/fi";

// "Best Seller" marker for a flavor. `compact` renders just the star (for tight
// spots like the flavor picker chips).
export default function BestSellerBadge({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <FiStar
        aria-label="Best seller"
        title="Best seller"
        className={`shrink-0 fill-gold text-gold ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-brown ${className}`}
    >
      <FiStar className="fill-gold text-gold" />
      Best Seller
    </span>
  );
}
