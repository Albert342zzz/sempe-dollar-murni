// Placeholder skeleton block. Add rounding/size via className.
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse bg-brown/10 ${className}`} />;
}
