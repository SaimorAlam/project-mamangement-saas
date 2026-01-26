import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) {
  return (
    <>
      {/*<!-- Component: Rounded basic search input --> */}
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 2xl:h-5 2xl:w-5" />
        <Input
          placeholder="Search anything here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full lg:w-[400px] border px-10 py-6 border-[#E2E8F0]"
        />
        {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-md p-1.5">
          <Command className=" text-gray-800 h-4 w-4" />
        </div> */}
      </div>
      {/*<!-- End Rounded search input --> */}
    </>
  );
}
