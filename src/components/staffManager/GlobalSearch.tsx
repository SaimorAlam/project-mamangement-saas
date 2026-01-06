import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetGlobalSearchItemsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { Skeleton } from "../ui/skeleton";

export default function GlobalSearch() {
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useGetGlobalSearchItemsQuery(searchText, {
    skip: !searchText,
  });

  const showDropdown = searchText.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchText(""); // 🔥 clear input
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // focus search text input field on "Ctrl + K" key press
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        containerRef.current?.querySelector("input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // close search result showing on "Esc" button press 
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchText("");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

        <Input
          placeholder="Search anything here..."
          className="pl-10 py-6 border border-[#E2E8F0]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-50 text-gray-400 rounded-lg p-1.5 flex items-center gap-1 text-sm">
          <Command className="h-3.5 w-3.5 " /> K
        </div>
      </div>

      {/* Result dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white shadow-lg">
          {isLoading && (
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-full bg-gray-100" />
              <Skeleton className="h-4 w-3/4 bg-gray-50" />
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-gray-400 text-center">
              Something went wrong in searching result.
            </div>
          )}

          {!isLoading && data && (
            <div className="p-6 text-sm text-gray-400">
              Successful
              {/* map search results here */}
            </div>
          )}
          {!isLoading && !data && (
            <div className="p-6 text-sm text-gray-400 text-center">
              No result found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
