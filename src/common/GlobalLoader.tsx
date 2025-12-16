// src/components/common/GlobalLoader.tsx

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm font-medium text-gray-700">
          Loading, please wait
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
