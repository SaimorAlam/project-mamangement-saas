/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { useSearchProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";

export default function StaffEmployeeGlobalSearch() {
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useSearchProjectsQuery(searchText, {
    skip: !searchText,
  });

  const showDropdown = searchText.length > 0;

  // if click outside then hiding the popover 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchText("");
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
        <div className="min-h-44 absolute z-50 mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white shadow-lg">
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

          {!isLoading && data.data.projects.length === 0 && data.data.programs.length === 0 && data.data.employees.length === 0 && (
            <div className="h-44 p-6 text-sm flex justify-center items-center text-gray-400">
              No project/program/employee information found.
            </div>
          )}

          <div className="p-2 max-h-[450px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6 p-1">
                {/* --- PROJECTS --- */}
                {data?.data?.projects?.data.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2 px-2 border-b border-gray-100">
                      <div className="h-1 w-1 bg-indigo-500 rounded-full" />
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 pb-1">Projects</h3>
                    </div>
                    <div className="grid gap-1.5">
                      {data.data.projects.data.map((project: any) => (
                        <Link
                          key={project.id}
                          to={`/staff-employee-panel/projects/project-details/${project.id}`}
                          className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50  transition-all duration-200"
                          onClick={() => setSearchText("")}
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                              {project.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Program: <span className="text-indigo-400 font-medium">{project.programName}</span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
