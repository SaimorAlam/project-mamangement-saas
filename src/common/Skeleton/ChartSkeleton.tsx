const ChartSkeleton = () => {
  return (
    <div className="w-full h-[350px] rounded-lg bg-gray-200 animate-pulse flex items-end gap-4 p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-300 rounded-md"
          style={{ height: `${40 + i * 5}%` }}
        />
      ))}
    </div>
  );
};

export default ChartSkeleton;