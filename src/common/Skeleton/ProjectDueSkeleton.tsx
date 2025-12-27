export const DueDateHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
        <div className="w-24 h-5 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="w-32 h-8 rounded bg-gray-200 animate-pulse" />
    </div>
  );
};

export const DueDateCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-200 rounded" />
          <div className="w-40 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-20 h-5 bg-gray-200 rounded" />
      </div>

      <div className="w-20 h-3 bg-gray-200 rounded mb-2" />

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"
            />
          ))}
        </div>
        <div className="w-28 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
