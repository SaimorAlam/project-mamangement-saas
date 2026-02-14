import { SidebarProvider } from "@/components/ui/sidebar";
import StaffManagerSidebar from "./StaffManagerSidebar";
import StaffManagerDashboardHeader from "./StaffManagerDashboardHeader";
import { HeaderProvider } from "./StaffManagerHeaderContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Outlet } from "react-router-dom";

const StaffManagerDashboardLayout = () => {
  return (
    <HeaderProvider>
      <NotificationProvider>
        <SidebarProvider
          defaultOpen={true}
          style={
            {
              "--sidebar-width": "296px",
              "--sidebar-width-icon": "80px",
            } as React.CSSProperties
          }
        >
          <StaffManagerSidebar />
          <main className="flex-1 min-w-0 px-4 md:px-8">
            <div className="pb-6">
              <StaffManagerDashboardHeader />
            </div>
            <Outlet />
          </main>
        </SidebarProvider>
      </NotificationProvider>
    </HeaderProvider>
  );
};

export default StaffManagerDashboardLayout;
