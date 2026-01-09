const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200  rounded-md ${className}`} />
);
export const HeaderSkeleton = () => (
  <div className="flex items-center justify-between pb-6">
    <Skeleton className="h-8 w-56" />

    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-28" />
      <Skeleton className="h-12 w-28" />
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-32" />
    </div>
  </div>
);
export const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />

        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    ))}
  </div>
);
export const ProjectTableSkeleton = () => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0"
      >
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);
