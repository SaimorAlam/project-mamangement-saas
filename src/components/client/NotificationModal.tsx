/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { connectSocket } from "@/lib/socket";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/store/Api/NotificationApi/NotificationApi";
import { useGetAllUsersQuery } from "@/store/Api/UserApi/UserApi";
import { NotificationItem } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  className?: string;
}

// 🧩 Default notifications
const defaultNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "project",
    user: {
      name: "Jhon Doe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      initials: "JD",
      online: true,
    },
    action: "uploaded data in",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Sales Team",
    comment: {
      mention: "@ Lawal",
      text: "For an expert opinion check out todays planning.",
      hasReply: true,
    },
    actions: [
      {
        label: "Review Project",
        variant: "default",
        onClick: () => {},
      },
    ],
    status: "new",
  },
  {
    id: "2",
    type: "team",
    user: {
      name: "Leslie Alexander",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      initials: "LA",
      online: true,
    },
    action: "added new tag to",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Staff Team",
    actions: [
      {
        label: "Material Delivery",
        variant: "secondary",
        onClick: () => {},
      },
      {
        label: "Delivery Due",
        variant: "destructive",
        onClick: () => {},
      },
    ],
    status: "read",
  },
  {
    id: "3",
    type: "access",
    user: {
      name: "Leslie Alexander",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      initials: "LA",
      online: true,
    },
    action: "requested access to",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Staff Team",
    actions: [
      { label: "Decline", variant: "outline", onClick: () => {} },
      { label: "Accept", variant: "default", onClick: () => {} },
    ],
    status: "new",
  },
  {
    id: "4",
    type: "file",
    user: {
      name: "Jhon Doe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      initials: "JD",
      online: true,
    },
    action: "uploaded a new file in",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Sales Team",
    attachment: {
      name: "Astha_builder_requirement file.pdf",
      type: "pdf",
    },
    status: "new",
  },
  {
    id: "5",
    type: "project",
    user: {
      name: "Leslie Alexander",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      initials: "LA",
      online: true,
    },
    action: "added a new cell to",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Staff Team",
    status: "read",
  },
  {
    id: "6",
    type: "file",
    user: {
      name: "Jhon Doe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      initials: "JD",
      online: true,
    },
    action: "uploaded a new presentation file to",
    target: "Carlyle Hall Project",
    timestamp: "12 mins ago",
    team: "Sales Team",
    attachment: {
      name: "Astha_builder_requirement file.pptx",
      type: "pptx",
    },
    status: "read",
  },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "project", label: "Project" },
  { id: "team", label: "Team" },
];

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = defaultNotifications,
  className,
}: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState("all");
  const token = useAppSelector((state) => state.auth.user?.accessToken);

  const { data: notificationData } = useGetNotificationsQuery({
    skip: !isOpen,
  });
  const { data: userData } = useGetAllUsersQuery(
    {},
    {
      skip: !isOpen,
    },
  );
  console.log(notificationData, "Notification");
  const [updateNotification] = useUpdateNotificationMutation();

  const users = userData?.data?.data || userData?.data || [];

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await updateNotification(id).unwrap();
      } catch (error) {
        console.error("Failed to update notification status", error);
      }
    }
  };

  useEffect(() => {
    if (!token) return;

    const socketInstance = connectSocket(token as string);

    const handleNotification = (data: any) => {
      console.log(data, "notification");
    };

    socketInstance.on("notification", handleNotification);

    return () => {
      socketInstance.off("notification", handleNotification);
    };
  }, [token]);

  const currentNotifications = notificationData?.data || notifications || [];

  // 🔹 Filtering logic
  const filteredNotifications = (currentNotifications as any[]).filter((n) => {
    const type = n.type?.toLowerCase() || "";

    switch (activeTab) {
      case "project":
        return type.includes("project") || type.includes("activity");
      case "team":
        return (
          type.includes("team") ||
          type.includes("employee") ||
          type.includes("manager")
        );
      default:
        return true; // "all"
    }
  });

  const getSenderInfo = (senderId: string) => {
    if (!Array.isArray(users)) return null;
    const sender = users.find((u: any) => u.id === senderId);
    if (sender) {
      return {
        name: sender.name,
        avatar: sender.avatar || sender.profileImage,
        initials: sender.name?.substring(0, 2).toUpperCase(),
      };
    }
    return null;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      if (!dateString) return "just now";
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error(error);
      return "just now";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM7 10H13V8H7V10ZM5 22C4.45 22 3.979 21.804 3.587 21.412C3.195 21.02 2.99934 20.5493 3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45067 1.99934 5 2H14L21 9V20C21 20.55 20.804 21.021 20.412 21.413C20.02 21.805 19.5493 22.0007 19 22H5ZM13 9V4H5V20H19V11H13V9Z"
                fill="#EF4444"
              />
            </svg>
          </div>
        );
      case "pptx":
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM7 10H13V8H7V10ZM5 22C4.45 22 3.979 21.804 3.587 21.412C3.195 21.02 2.99934 20.5493 3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45067 1.99934 5 2H14L21 9V20C21 20.55 20.804 21.021 20.412 21.413C20.02 21.805 19.5493 22.0007 19 22H5ZM13 9V4H5V20H19V11H13V9Z"
                fill="#F97316"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                fill="#64748B"
              />
            </svg>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>
      <div
        className={cn(
          "absolute transform -translate-x-1/2 top-15 h-[85vh] w-96 bg-white rounded-lg z-50 flex flex-col shadow-xl",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">Notifications</h4>
            {currentNotifications.filter((n: any) => !n.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {currentNotifications.filter((n: any) => !n.isRead).length}
              </span>
            )}
          </div>
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
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-xs font-semibold transition-colors pb-2.5 pt-1 cursor-pointer",
                  activeTab === tab.id
                    ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                    : "text-gray-500 hover:text-gray-700",
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

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const senderInfo = getSenderInfo(notification.senderId);
              const isRead =
                notification.isRead !== undefined
                  ? notification.isRead
                  : notification.status === "read";

              const displayName =
                senderInfo?.name ||
                notification?.sender?.name ||
                notification?.user?.name ||
                "Notification";
              const displayAvatar =
                senderInfo?.avatar ||
                notification?.sender?.avatar ||
                notification?.user?.avatar ||
                "/placeholder.svg";
              const displayInitials =
                senderInfo?.initials ||
                (notification?.sender?.name ||
                  notification?.user?.name ||
                  "S")
                  .substring(0, 2)
                  .toUpperCase();

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-5 border-b border-gray-100 transition-all cursor-pointer hover:bg-gray-50 relative",
                    !isRead ? "bg-blue-50/40" : "bg-white",
                  )}
                  onClick={() => handleNotificationClick(notification.id, isRead)}
                >
                  {!isRead && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                  <div className="flex space-x-3">
                    <div className="relative shrink-0 h-10 w-10">
                      <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                        <AvatarImage src={displayAvatar} alt={displayName} />
                        <AvatarFallback className="text-xs font-medium bg-gray-50">
                          {displayInitials}
                        </AvatarFallback>
                      </Avatar>
                      {(notification?.sender?.online ||
                        notification?.user?.online) && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] leading-relaxed text-gray-700">
                        <span className="font-bold text-gray-900">
                          {displayName}
                        </span>{" "}
                        <span className="text-gray-500">
                          {notification?.context || notification?.action}
                        </span>{" "}
                        {notification?.target && (
                          <span className="text-[#2563EB] font-semibold">
                            {notification?.target}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[11px] text-gray-400">
                          {notification.createdAt
                            ? getTimeAgo(notification.createdAt)
                            : notification.timestamp}
                        </span>
                        {notification.type && (
                          <>
                            <span className="text-[11px] text-gray-400">•</span>
                            <span className="text-[11px] text-gray-400 capitalize">
                              {notification.type
                                .replace(/_/g, " ")
                                .toLowerCase()}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Comment box */}
                      {notification?.comment && (
                        <div className="mt-3 p-3 bg-[#F8FAFC] rounded-lg border border-gray-50">
                          <p className="text-[13px] text-gray-600">
                            <span className="font-bold text-gray-900">
                              {notification?.comment?.mention}
                            </span>{" "}
                            {notification?.comment?.text}
                          </p>
                          {notification?.comment?.hasReply && (
                            <div className="mt-3 relative">
                              <input
                                type="text"
                                placeholder="Reply"
                                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5ZM14.14 11.86L11 15L9 13L6 16H18L14.14 11.86Z"
                                    fill="#94A3B8"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attachment preview */}
                      {notification?.attachment && (
                        <div className="mt-3 flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden h-12">
                          {getFileIcon(notification?.attachment?.type)}
                          <span className="text-[12px] font-medium text-gray-600 truncate flex-1 pr-4">
                            {notification?.attachment?.name}
                          </span>
                        </div>
                      )}

                      {/* Actions buttons */}
                      {notification?.actions &&
                        notification?.actions?.length > 0 && (
                          <div
                            className={cn(
                              "flex items-center gap-2 mt-4",
                              notification?.type === "project" && "justify-end",
                            )}
                          >
                            {notification?.actions?.map(
                              (action: any, index: number) => (
                                <Button
                                  key={index}
                                  variant={
                                    action.variant === "default"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={action.onClick}
                                  className={cn(
                                    "h-9 px-5 text-[12px] font-semibold rounded-lg transition-all",
                                    action.variant === "default"
                                      ? "bg-[#2563EB] hover:bg-blue-700 text-white border-none shadow-sm"
                                      : action.variant === "destructive"
                                        ? "bg-[#FEE2E2] text-[#EF4444] border-none hover:bg-red-200"
                                        : action.variant === "secondary"
                                          ? "bg-[#E0E7FF] text-[#4F46E5] border-none hover:bg-blue-200"
                                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                                  )}
                                >
                                  {action.label}
                                </Button>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
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
