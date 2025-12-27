/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetNotificationQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/*   HELPERS   */

const formatTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day ago`;
};

/*   COMPONENT   */

export default function NotificationModal({
  isOpen,
  onClose,
}: NotificationModalProps) {
  const { data, isLoading } = useGetNotificationQuery();

  if (!isOpen) return null;

  const notifications = data?.data ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-14 top-20 h-[85vh] w-96 bg-white rounded-lg z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h4 className="font-semibold text-lg">Notifications</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="p-6 text-sm text-gray-500 text-center">
              Loading notifications...
            </p>
          )}

          {!isLoading && notifications.length === 0 && (
            <p className="p-6 text-sm text-gray-500 text-center">
              No notifications found
            </p>
          )}

          {!isLoading &&
            notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors",
                  !notification.isRead && "bg-blue-50"
                )}
              >
                <p className="text-sm text-gray-900">
                  {notification.context}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(notification.createdAt)}
                  </span>

                  {!notification.isRead && (
                    <span className="text-xs font-medium text-blue-600">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-end">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Mark all as read
          </Button>
        </div>
      </div>
    </>
  );
}
