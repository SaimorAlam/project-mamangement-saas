import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalPages: number;
  filteredDataLength: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages,
  filteredDataLength,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Displaying the current range of items being shown */}
      <p className="text-sm text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, filteredDataLength)} of{" "}
        {filteredDataLength} client
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1} // Disable if already on first page
          className="border border-[#CAD2DB]"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Button>

        {/* Render page number buttons (up to 5 pages) */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={
                currentPage === pageNum ? "default" : "outline"
              } // Highlight active page
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 p-0 border  ${
                currentPage === pageNum
                  ? "border-[#356DF0] bg-[#356DF0] text-white"
                  : "border-[#CAD2DB]"
              }`}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Show ellipsis if more than 5 pages */}
        {totalPages > 5 && (
          <>
            <span className="text-sm text-gray-500">...</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)} // Jump to last page
              className="w-8 h-8 p-0 "
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages} // Disable if already on last page
          className="border border-[#CAD2DB]"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
