const DashboardPanelStatsCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-[#CAD2DB] animate-pulse">
      <div className="bg-white rounded-lg p-5">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-gray-200 w-10 h-10" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>

        {/* Value & Growth */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-20 bg-gray-300 rounded" />
          <div className="h-6 w-14 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Description & Link */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="h-3 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default DashboardPanelStatsCardSkeleton;
