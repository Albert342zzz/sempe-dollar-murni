import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main>
      <section className="bg-cream pt-16 pb-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Skeleton className="mx-auto h-10 w-56 rounded-md" />
          <Skeleton className="mx-auto mt-3 h-4 w-80 rounded-md" />
        </div>
      </section>

      <section className="bg-cream-soft py-12">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-3xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </section>
    </main>
  );
}
