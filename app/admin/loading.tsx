/**
 * Admin loading skeleton — shape matches the final layout (taste rule:
 * skeletons, not spinners): 4 stat cards + table rows, no layout shift.
 */
export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-[72rem] px-5 py-12 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <div className="h-9 w-56 animate-pulse rounded-md bg-warm" />
        <div className="h-12 w-28 animate-pulse rounded-full bg-warm" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-warm" />
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-2 rounded-lg border border-line bg-card p-4 shadow-card">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 animate-pulse rounded-sm bg-warm" />
        ))}
      </div>
    </main>
  );
}
