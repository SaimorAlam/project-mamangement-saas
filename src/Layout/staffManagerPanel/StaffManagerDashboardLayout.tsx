import { SidebarProvider } from "@/components/ui/sidebar";
import StaffManagerSidebar from "./StaffManagerSidebar";
import StaffManagerDashboardHeader from "./StaffManagerDashboardHeader";
import { HeaderProvider } from "./StaffManagerHeaderContext";
import { Outlet } from "react-router-dom";

const StaffManagerDashboardLayout = () => {
  return (
    <HeaderProvider>
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
    </HeaderProvider>
  );
};

export default StaffManagerDashboardLayout;
