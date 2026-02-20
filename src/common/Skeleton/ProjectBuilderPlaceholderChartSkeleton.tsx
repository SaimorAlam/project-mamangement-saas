const ProjectBuilderPlaceholderChartSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 w-full">
      {/* 1. Project Stats Skeleton (Full Width) */}
      <div className="w-full h-32 bg-slate-200/50 border border-gray-200 rounded-xl" />

      {/* 2. Charts Row Skeleton */}
      <div className="flex gap-4">
        {/* Radar Chart Skeleton */}
        <div className="flex-1 h-64 bg-slate-200/50 border border-gray-200 rounded-xl" />

        {/* Doughnut Chart Skeleton */}
        <div className="flex-1 h-64 bg-slate-200/50 border border-gray-200 rounded-xl" />
      </div>

      {/* 3. Heat Map Skeleton */}
      <div className="w-full h-80 bg-slate-200/50 border border-gray-200 rounded-xl" />
    </div>
  );
};

export default ProjectBuilderPlaceholderChartSkeleton;
