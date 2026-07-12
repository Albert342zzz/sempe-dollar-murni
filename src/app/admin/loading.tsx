import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-6 md:p-8">
      <Skeleton className="h-7 w-44 rounded-md" />
      <Skeleton className="mt-2 h-4 w-72 rounded-md" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>

      <Skeleton className="mt-6 h-64 rounded-2xl" />
    </div>
  );
}
