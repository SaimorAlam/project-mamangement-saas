import { useState } from "react";
import { ChevronDown, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useGetUser } from "@/hooks/useGetUser";
import { useAppDispatch } from "@/hooks/useRedux";
import { toast } from "sonner";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";

interface UserProfileButtonProps {
  onSettingsClick?: () => void;
  state?: "expanded" | "collapsed";
}

export default function UserProfile({
  onSettingsClick,
  state,
}: UserProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { name, role, profileImage } = useGetUser();
  const dispatch = useAppDispatch();

  const onLogout = () => {
    try {
      dispatch(logOut());
      toast.success("Logout successful");

      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const isCollapsed = state === "collapsed";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-auto mt-5 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none! focus-visible:outline-none! ${
            isCollapsed ? "p-2 w-fit mx-auto" : "p-3 w-full"
          }`}
        >
          <div
            className={`flex items-center w-full gap-2 ${
              isCollapsed ? "justify-center" : "justify-between "
            }`}
          >
            {/* Profile Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={profileImage || "https://api.dicebear.com/9.x/initials/svg?seed=" + (name || "User")}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              {!isCollapsed && (
                <div className="flex flex-col items-start text-left  max-w-[150px] overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium text-gray-900">
                      {name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{role}</span>
                </div>
              )}
            </div>

            {/* Logout Icon */}
            {!isCollapsed && (
              <div className="ml-1 pl-3 border-l border-gray-400">
                <Power size={30} className="text-red-500" />
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56   mt-2 border border-[#E2E8F0] bg-white space-y-2 focus:outline-none focus-visible:outline-none"
      >
        <DropdownMenuItem
          asChild
          className="cursor-pointer focus:outline-none focus-visible:outline-none"
        >
          <Link to="profile">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={profileImage || "https://api.dicebear.com/9.x/initials/svg?seed=" + (name || "User")}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs text-gray-500">{role}</span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border border-[#E2E8F0] h-px" />

        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="profile">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="user-activity-log">Activity Log</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border border-[#E2E8F0] " />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Power className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
