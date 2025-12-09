import { ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getActionIcon = (action: string) => {
  switch (action) {
    case "assignee_added":
      return "👤";
    case "file_added":
      return "📎";
    case "link_added":
      return "🔗";
    case "link_removed":
      return "🔗";
    case "due_date_changed":
      return "📅";
    case "progress_changed":
      return "📊";
    case "subtask_removed":
      return "➖";
    default:
      return "📝";
  }
};
const getActionIconFromDescription = (description: string) => {
  const action = description.split(":")[0].trim(); // "link_added"
  return getActionIcon(action);
};

type ActivityLogEntry = {
  user?: {
    name: string;
    avatar: string;
  };
  avatar?: string;
  description?: string;
  // all other keys must be safe-to-render
  [key: string]: string | number | ReactNode | undefined | object;
};

interface ActivityLogTableProps {
  paginatedData: ActivityLogEntry[];
  tableHeaders: string[];
}

const ActivityLogTable = ({
  paginatedData,
  tableHeaders,
}: ActivityLogTableProps) => {
  console.log(paginatedData);
  return (
    <div className="overflow-x-auto pb-6 rounded-lg">
      <Table className="rounded-lg">
        <TableHeader>
          <TableRow className="border-b border-[#E2E8F0] bg-[#F7F9FA]">
            {tableHeaders
              .filter((header) => header.toLowerCase() !== "id")
              .map((header) => {
                return (
                  <TableHead
                    key={header}
                    className="text-base capitalize font-medium text-[#1D2028] px-6 py-3.5"
                  >
                    {header}
                  </TableHead>
                );
              })}
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-lg">
          {paginatedData.map((entry, idx) => (
            <TableRow
              key={idx}
              className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
            >
              {tableHeaders
                .filter((entry) => entry.toLowerCase() !== "id")
                .map((key) => (
                  <TableCell
                    key={key}
                    className="px-6 py-3.5 text-sm text-gray-600"
                  >
                    {key === "user" ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              entry?.user?.avatar ||
                              "/placeholder.svg"
                            }
                            alt={entry?.user?.name || "Unknown user"}
                          />
                          <AvatarFallback>
                            {entry.user?.avatar.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{entry.user?.name}</span>
                      </div>
                    ) : key === "description" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-lg">
                          {entry.description
                            ? getActionIconFromDescription(
                                entry.description
                              )
                            : null}
                        </span>
                        <span>{entry.description}</span>
                      </div>
                    ) : (
                      (() => {
                        const value =
                          entry[key as keyof typeof entry];
                        return typeof value === "string" ||
                          typeof value === "number"
                          ? value
                          : null;
                      })()
                    )}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default ActivityLogTable;
