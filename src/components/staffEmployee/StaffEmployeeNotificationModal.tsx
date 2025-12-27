import { useMemo, useState } from "react";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";

/* =====================================================
   API TYPE (REAL RESPONSE)
===================================================== */

interface NotificationApiItem {
  id: string;
  senderId: string;
  receiverIds: string[];
  projectId: string | null;
  context: string;
  type: "NEW_EMPLOYEE_ASSIGNED";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/* =====================================================
   EXISTING UI TYPES (UNCHANGED)
===================================================== */

export interface NotificationAction {
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  type: "project" | "team" | "system" | "file";
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  team?: string;
  actions?: NotificationAction[];
  attachment?: {
    name: string;
    type: "pdf" | "doc" | "image";
  };
  status?: "new" | "read";
}

/* =====================================================
   HELPERS
===================================================== */

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)} days ago`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

/**
 * Extracts:
 * action -> "created a new project"
 * target -> "Project Alpha"
 */
const parseContext = (context: string) => {
  const match = context.match(/"(.*?)"/);
  return {
    action: match ? context.replace(match[0], "").trim() : context,
    target: match ? match[1] : undefined,
  };
};

/* =====================================================
   MAPPER (API → EXISTING UI SHAPE)
===================================================== */

const mapApiToNotificationItem = (
  api: NotificationApiItem
): NotificationItem => {
  const { action, target } = parseContext(api.context);

  const systemUser = "System";

  return {
    id: api.id,
    type: api.projectId ? "project" : "system",
    user: {
      name: systemUser,
      avatar: "",
      initials: getInitials(systemUser),
    },
    action,
    target,
    timestamp: timeAgo(api.createdAt),
    status: api.isRead ? "read" : "new",
    actions: [
      {
        label: "View",
        variant: "default",
        onClick: () => {
          console.log("View notification:", api.id);
        },
      },
    ],
  };
};

/* =====================================================
   COMPONENT
===================================================== */

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "inbox", label: "Inbox" },
  { id: "project", label: "Project" },
  { id: "team", label: "Team" },
];

export default function StaffEmployeeNotificationModal({
  isOpen,
  onClose,
  className,
}: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState("all");

  const { data } = useGetNotificationsQuery({});

  const notifications: NotificationItem[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiToNotificationItem);
  }, [data]);

  const filteredNotifications = notifications.filter((n) => {
    switch (activeTab) {
      case "inbox":
        return n.status === "new";
      case "project":
        return n.type === "project";
      case "team":
        return n.type === "team";
      default:
        return true;
    }
  });

  if (!isOpen) return null;

  /* =====================================================
     JSX BELOW IS 100% YOUR ORIGINAL STYLE
  ===================================================== */

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      ></div>
      <div
        className={cn(
          "absolute right-14 top-15 h-[85vh] w-96 bg-white rounded-lg z-50 flex flex-col shadow-xl",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h4 className="font-semibold text-lg">Notifications</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-sm font-medium transition-colors pb-1 cursor-pointer",
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                  notification.status === "new" && "bg-blue-50"
                )}
              >
                <div className="flex space-x-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage
                      src={
                        notification.user.avatar || "/placeholder.svg"
                      }
                      alt={notification.user.name}
                    />
                    <AvatarFallback className="text-xs font-medium">
                      {notification.user.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {notification.user.name}
                      </span>{" "}
                      {notification.action}{" "}
                      {notification.target && (
                        <span className="text-blue-600 font-medium">
                          {notification.target}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                    </div>

                    {notification.actions && (
                      <div className="flex space-x-2 mt-3">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={action.onClick}
                            className="h-7 px-3 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
