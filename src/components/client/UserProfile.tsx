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
import { Link, useNavigate } from "react-router-dom";
import { useUserProfileQuery } from "@/store/Api/UserApi/UserApi";

interface UserProfileButtonProps {
  name?: string;
  role?: string;
  avatar?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export default function UserProfile({
  name,
  role,
  avatar,
  onProfileClick,
  onSettingsClick,
}: UserProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: userProfile } = useUserProfileQuery({});
  console.log(userProfile);
  const navigate = useNavigate();

  const onLogout = () => {
    // Je kono extra logout logic thakle ekhane add korte paro
    navigate("/login");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="">
        <Button
          variant="ghost"
          className="h-auto p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus-visible:outline-none"
        >
          <div className="flex items-center gap-3">
            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={avatar || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">
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

            {/* Logout Icon */}
            <div className="ml-2 pl-2 border-l border-gray-200">
              <Power className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56   mt-2 border border-[#E2E8F0] bg-white space-y-2 focus:outline-none focus-visible:outline-none"
      >
        <DropdownMenuItem
          onClick={onProfileClick}
          className="cursor-pointer focus:outline-none focus-visible:outline-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
              <img
                src={avatar || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-gray-500">{role}</span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border border-[#E2E8F0] h-px" />

        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
          <Link to="/user-activity-log">Activity Log</Link>
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
