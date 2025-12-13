import { SidebarProvider } from "@/components/ui/sidebar";
import StaffManagerSidebar from "./StaffManagerSidebar";
import StaffManagerDashboardHeader from "./StaffManagerDashboardHeader";
import { HeaderProvider } from "./StaffManagerHeaderContext";
import { Outlet } from "react-router-dom";

const StaffManagerDashboardLayout = () => {
  return (
    <HeaderProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "296px",
          } as React.CSSProperties
        }
      >
        <StaffManagerSidebar />
        <main className="w-full px-8">
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
