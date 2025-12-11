import { SidebarProvider } from "@/components/ui/sidebar";
import StaffEmployeeDashboardHeader from "./StaffEmployeeDashboardHeader";
import { Outlet } from "react-router-dom";
import StaffEmployeeSidebar from "./StaffEmployeeSidebar";
import { HeaderProvider } from "./StaffEmployeeHeaderContext";

const StaffEmployeeDashboardLayout = () => {
  return (
    <HeaderProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "296px",
          } as React.CSSProperties
        }
      >
        <StaffEmployeeSidebar />
        <main className="w-full px-8">
          <div className="pb-6">
            <StaffEmployeeDashboardHeader />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </HeaderProvider>
  );
};

export default StaffEmployeeDashboardLayout;
