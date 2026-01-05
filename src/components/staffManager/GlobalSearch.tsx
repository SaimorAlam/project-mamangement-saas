import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { useGetGlobalSearchItemsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

export default function GlobalSearch() {
    const [searchText, setSearchText] = useState<string>("john");
    
    const {data, isLoading, error} = useGetGlobalSearchItemsQuery({
        query: searchText || undefined
    })

    useEffect(()=>{
       console.log("working...");
       console.log("data is : ",data);
        
    },[searchText])

  return (
    <>
    <Popover>
        <PopoverTrigger>
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 2xl:h-5 2xl:w-5" />
        <Input
          placeholder="Search anything here..."
          className="pl-10 w-100 border px-10 py-6 border-[#E2E8F0]"
          onChange={(e)=> setSearchText(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-lg p-1.5">
          <Command className=" text-gray-800 h-4 w-4" />
        </div>
      </div>
      </PopoverTrigger>
      <PopoverContent className="pl-10 w-100 border px-10 py-6 border-[#E2E8F0] bg-white">
        {isLoading && (<div className="text-gray-400 text-center">Searching result...</div>)}
        {error && (<div className="text-gray-400 text-center">Something wrong in searching result.</div>)}
        {data && (<div className="text-gray-400 text-center">succesfull</div>)}
        </PopoverContent>
      </Popover>
    </>
  );
}
