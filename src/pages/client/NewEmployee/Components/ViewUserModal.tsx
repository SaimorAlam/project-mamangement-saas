/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // replace `any` with proper User type if available
}

const ViewUserModal = ({ isOpen, onClose, user }: ViewUserModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profileImage ||
                  "https://randomuser.me/api/portraits/men/19.jpg"
                }
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge
                  variant="outline"
                  className={`px-2 py-1 font-medium ${
                    user.role === "MANAGER"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : user.role === "EMPLOYEE"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone Number</p>
                <p>{user.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p>{user.language || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p>{user.userStatus === "ACTIVE" ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="font-medium">Last Active</p>
                <p>
                  {user.lastActive
                    ? new Date(user.lastActive).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <p className="font-medium">Created At</p>
                <p>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Assigned Projects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.assignedProjects?.length
                    ? user.assignedProjects.map((p: any) => (
                        <Badge
                          key={p.id}
                          variant="outline"
                          className="text-sm px-2 py-1 border-gray-200"
                        >
                          {p.name}
                        </Badge>
                      ))
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
