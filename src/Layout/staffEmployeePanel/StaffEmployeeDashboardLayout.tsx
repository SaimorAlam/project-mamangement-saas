import { SidebarProvider } from "@/components/ui/sidebar";
import StaffEmployeeDashboardHeader from "./StaffEmployeeDashboardHeader";
import { Outlet } from "react-router-dom";
import StaffEmployeeSidebar from "./StaffEmployeeSidebar";
import { HeaderProvider } from "./StaffEmployeeHeaderContext";
import { NotificationProvider } from "@/context/NotificationContext";

const StaffEmployeeDashboardLayout = () => {
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
          <StaffEmployeeSidebar />
          <main className="flex-1 min-w-0 px-4 md:px-8">
            <div className="pb-6">
              <StaffEmployeeDashboardHeader />
            </div>
            <Outlet />
          </main>
        </SidebarProvider>
      </NotificationProvider>
    </HeaderProvider>
  );
};

export default StaffEmployeeDashboardLayout;
