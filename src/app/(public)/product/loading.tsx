import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main>
      <Skeleton className="h-[60vh] w-full" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Skeleton className="mx-auto h-8 w-64 rounded-md" />
        <Skeleton className="mx-auto mt-3 h-4 w-80 rounded-md" />

        <div className="mt-10 grid items-center gap-8 rounded-3xl border border-brown/15 p-6 md:grid-cols-2 md:p-10">
          <Skeleton className="mx-auto aspect-square w-full max-w-sm rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-9 w-48 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-full" />
          ))}
        </div>
      </section>
    </main>
  );
}
