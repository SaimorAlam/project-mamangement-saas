export const DonutChartSkeleton = () => {
  return (
    <div className="rounded-xl w-full h-full border border-gray-200 bg-white p-5 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-28 bg-gray-200 rounded" />
      </div>

      {/* Donut placeholder */}
      <div className="flex justify-center items-center">
        <div className="relative">
          <div className="w-64 h-64 rounded-full bg-gray-200" />
          <div className="absolute inset-10 rounded-full bg-white" />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="ml-auto h-4 w-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
