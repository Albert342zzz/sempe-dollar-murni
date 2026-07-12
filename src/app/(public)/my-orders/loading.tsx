import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="bg-cream-soft">
      <section className="mx-auto min-h-[calc(100vh-80px)] max-w-3xl px-6 py-12">
        <Skeleton className="h-9 w-52 rounded-md" />
        <Skeleton className="mt-2 h-4 w-72 rounded-md" />

        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      </section>
    </main>
  );
}
