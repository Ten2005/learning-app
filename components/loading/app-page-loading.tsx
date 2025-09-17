import { Skeleton } from "@/components/ui/skeleton";

export function AppPageLoading() {
  return (
    <div
      aria-busy
      aria-live="polite"
      className="flex min-h-screen flex-col bg-background"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <aside className="hidden flex-col gap-3 md:flex">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </aside>
          <section className="flex flex-1 flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[40vh] w-full" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
