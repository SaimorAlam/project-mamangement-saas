import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IActivityLog } from "@/store/Api/ActivityLogApi/ActivityLogApi";

const getActionIcon = (action: string) => {
  const normalizedAction = action.toLowerCase();
  switch (normalizedAction) {
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

export type ActivityLogEntry = Partial<IActivityLog> & {
  // Allow index access for table headers
  [key: string]: string | number | boolean | null | undefined | object;
};

interface ActivityLogTableProps {
  paginatedData: ActivityLogEntry[];
  tableHeaders: string[];
}

const ActivityLogTable = ({
  paginatedData,
  tableHeaders,
}: ActivityLogTableProps) => {
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
              key={entry.id || idx}
              className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
            >
              {tableHeaders
                .filter((header) => header.toLowerCase() !== "id")
                .map((key) => (
                  <TableCell
                    key={key}
                    className="px-6 py-3.5 text-sm text-gray-600"
                  >
                    {key === "user" ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={entry?.user?.avatar || ""}
                            alt={entry?.user?.name || "Unknown user"}
                          />
                          <AvatarFallback>
                            {entry.user?.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{entry.user?.name}</span>
                      </div>
                    ) : key === "description" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-lg">
                          {entry.actionType
                            ? getActionIcon(entry.actionType)
                            : entry.description && typeof entry.description === "string"
                            ? getActionIconFromDescription(entry.description)
                            : null}
                        </span>
                        <span>{typeof entry.description === "string" ? entry.description : ""}</span>
                      </div>
                    ) : key === "timestamp" ? (
                        <span>
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                            }).replace(",", "") : ""}
                        </span>
                    ) : (
                      (() => {
                        const value = entry[key as keyof typeof entry];
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
