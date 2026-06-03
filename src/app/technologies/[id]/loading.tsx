/**
 * Skeleton Loader for Technology Detail Page
 * ─────────────────────────────────────────────
 * This runs automatically via Next.js App Router Suspense boundary
 * for the first ~1.5s while the server component fetches data
 * from the Google Sheet. Uses animate-pulse to simulate content.
 */

export default function TechnologyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            {[48, 8, 80, 8, 60, 8, 160].map((w, i) => (
              <div
                key={i}
                className={`h-3 rounded bg-slate-200 animate-pulse flex-shrink-0 ${w === 8 ? 'w-2' : ''}`}
                style={w !== 8 ? { width: w } : {}}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Sector + type chips */}
            <div className="flex gap-2">
              <div className="h-6 w-28 rounded-full bg-blue-100 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <div className="h-11 w-full rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-11 w-4/5 rounded-xl bg-slate-200 animate-pulse" />
            </div>

            {/* Institution strip */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-52 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-7 w-24 rounded-md bg-slate-100 animate-pulse" />
            </div>

            {/* Problem callout card */}
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-3 w-36 rounded bg-amber-200 animate-pulse" />
                  <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 animate-pulse" />
                <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="space-y-2.5">
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>

            {/* Applications card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 rounded bg-slate-200 animate-pulse" />
                  <div className="h-3 w-64 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[130, 100, 150, 90, 120, 110].map((w, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-emerald-50 border border-emerald-100 animate-pulse"
                    style={{ width: w }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Main action card */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 p-6 space-y-5"
                style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.06)' }}>

                {/* TRL section */}
                <div className="pb-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 animate-pulse" />
                    <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
                    <div className="h-5 w-16 rounded-full bg-emerald-100 animate-pulse" />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="h-2 flex-1 rounded-full bg-slate-200 animate-pulse" />
                    ))}
                  </div>
                </div>

                {/* Patent section */}
                <div className="pb-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="h-10 rounded-lg bg-blue-50 animate-pulse" />
                </div>

                {/* Institution section */}
                <div className="pb-5 border-b border-slate-100 space-y-2">
                  <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
                </div>

                {/* CTA button */}
                <div className="h-14 w-full rounded-xl bg-emerald-200 animate-pulse" />
                <div className="space-y-1.5 px-1">
                  <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                  <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>

              {/* Contact card */}
              <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3">
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-48 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-40 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-36 rounded bg-slate-100 animate-pulse" />
              </div>

              {/* Link cards */}
              <div className="h-14 rounded-xl bg-white border border-slate-100 animate-pulse" />
              <div className="h-14 rounded-xl bg-white border border-slate-100 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
