import { useState, useEffect } from "react";
import { CardHeader } from "@/components/ui/card";
import BoxContainer from "../../../common/BoxContainer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import SubmissionTable from "../SubmissionTable";
import { useGetAllLatestSubmissionsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { FaSpinner } from "react-icons/fa";

// const submissionsData = [
//     {
//         id: 1,
//         submission: "Q3 Marketing Performance Report",
//         submittedBy: {
//             name: "Kathryn Murphy",
//             avatar:
//                 "https://images.unsplash.com/photo-1494790108755-2616b169b1b8?w=32&h=32&fit=crop&crop=face",
//         },
//         date: "Today, 9:41 AM",
//         status: "approved",
//     },
//     {
//         id: 2,
//         submission: "Customer Feedback Analysis",
//         submittedBy: {
//             name: "Leslie Alexander",
//             avatar:
//                 "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
//         },
//         date: "Yesterday, 2:30 PM",
//         status: "in_review",
//     },
// ];

const LatestSubmission = () => {
    const [submissions, setSubmissions] = useState([]);
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data, isLoading, error } = useGetAllLatestSubmissionsQuery({
        fromDate: "2024-01-01",
        toDate: "2026-12-12"
    });

    const submissionsData = data?.data || [];

    useEffect(() => {
        setSubmissions(submissionsData);
    }, []);

    // const sortedSubmissions = [...submissions].sort((a, b) => {
    //     if (sortBy === "date") {
    //         if (sortOrder === "asc") {
    //             return new Date(a.date).getTime() - new Date(b.date).getTime();
    //         } else {
    //             return new Date(b.date).getTime() - new Date(a.date).getTime();
    //         }
    //     }
    //     if (sortBy === "name") {
    //         if (sortOrder === "asc") {
    //             return a.submission.localeCompare(b.submission);
    //         } else {
    //             return b.submission.localeCompare(a.submission);
    //         }
    //     }
    //     if (sortBy === "status") {
    //         if (sortOrder === "asc") {
    //             return a.status.localeCompare(b.status);
    //         } else {
    //             return b.status.localeCompare(a.status);
    //         }
    //     }
    //     return 0;
    // });

    const sortedSubmissions = submissions;
    console.log("working sorted", sortedSubmissions);



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-22">
                <FaSpinner className="animate-spin" size={24} />
            </div>
        );
    }
    if (error) return <div className="text-gray-400 text-center">Something went wrong.</div>;


    return (
        <BoxContainer>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
                <h4 className="font-semibold text-md">Latest Submission</h4>
                {
                    submissionsData.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
                                >
                                    <ArrowDownUp className="size-5" />
                                    Sort By
                                    <ChevronDown className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-white border border-[#CAD2DB] p-1"
                            >
                                {/* Field Selection */}
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Field
                                </div>
                                <DropdownMenuItem
                                    className={`rounded-md cursor-pointer ${sortBy === 'startDate' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                                    onClick={() => setSortBy("startDate")}
                                >
                                    Date
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`rounded-md cursor-pointer ${sortBy === 'endDate' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                                    onClick={() => setSortBy("endDate")}
                                >
                                    Name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`rounded-md cursor-pointer ${sortBy === 'endDate' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                                    onClick={() => setSortBy("endDate")}
                                >
                                    Status
                                </DropdownMenuItem>

                                <div className="my-1 border-t border-gray-100" />

                                {/* Order Selection */}
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Order
                                </div>
                                <DropdownMenuItem
                                    className={`rounded-md cursor-pointer ${sortOrder === 'asc' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                                    onClick={() => setSortOrder("asc")}
                                >
                                    Ascending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`rounded-md cursor-pointer ${sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-600' : ''}`}
                                    onClick={() => setSortOrder("desc")}
                                >
                                    Descending
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            </CardHeader>
            {/* Pass the whole array instead of mapping */}
            <SubmissionTable submissions={submissionsData} />
        </BoxContainer>
    );
};

export default LatestSubmission;
