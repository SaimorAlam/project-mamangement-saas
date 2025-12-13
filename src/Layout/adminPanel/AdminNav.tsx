import {
  Clock,
  Users,
  BarChart3,
  Activity,
  CreditCard,
  Plug,
  Shield,
  HelpCircle,
  Settings,
  ChevronRight,
  Power,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const SidebarNavigation = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    const baseClasses =
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors";
    const activeClasses = "bg-blue-500 text-white";
    const inactiveClasses = "text-gray-700 hover:bg-gray-50";

    return `${baseClasses} ${
      isActive ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <div className="w-64 h-screen bg-white flex flex-col fixed top-0">
      <div className="p-4 mt-5">
        <img src="/sitelogo.png" />
        <h3 className="text-sm font-medium text-gray-500 mb-3 mt-10">
          Main Menu
        </h3>
        <div className="space-y-2">
          <NavLink to="/admin" className={getLinkClassName} end>
            <Clock className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </NavLink>
          <NavLink to="/admin/clients" className={getLinkClassName}>
            <Users className="w-5 h-5" />
            <span>Clients</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={getLinkClassName}>
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </NavLink>
          <NavLink
            to="/admin/systemHealth"
            className={getLinkClassName}
          >
            <Activity className="w-5 h-5" />
            <span>System Health</span>
          </NavLink>
          <NavLink to="/admin/billings" className={getLinkClassName}>
            <CreditCard className="w-5 h-5" />
            <span>Billing & Plans</span>
          </NavLink>
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Support
        </h3>
        <div className="space-y-1">
          <NavLink
            to="/admin/apiIntegration"
            className={getLinkClassName}
          >
            <Plug className="w-5 h-5" />
            <span>API & Integration</span>
          </NavLink>
          <NavLink to="/admin/security" className={getLinkClassName}>
            <Shield className="w-5 h-5" />
            <span>Security & Privacy</span>
          </NavLink>
          <NavLink to="/admin/help" className={getLinkClassName}>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </NavLink>
          <NavLink
            to="/admin/globalSettings"
            className={getLinkClassName}
          >
            <Settings className="w-5 h-5" />
            <span>Global Settings</span>
          </NavLink>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="/professional-woman-headshot.png"
                alt="Sofia Martin"
              />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">
                Sofia Martin
              </p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
          <NavLink to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-500  cursor-pointer"
            >
              <Power className="w-4 h-4" />
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
