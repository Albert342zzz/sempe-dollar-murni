import Spinner from "@/components/Spinner";

// Full-page loader used in route loading.tsx files (Suspense fallback).
export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-terracotta" />
    </div>
  );
}
