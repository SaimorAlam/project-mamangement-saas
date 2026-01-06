const SelectSkeleton = () => {
  return (
    <div className="px-4 pt-4 animate-pulse">
      {/* Label skeleton */}
      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />

      {/* Select box skeleton */}
      <div className="relative">
        <div className="w-full h-10 bg-gray-200 rounded-md" />

        {/* Dropdown icon placeholder */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SelectSkeleton;
