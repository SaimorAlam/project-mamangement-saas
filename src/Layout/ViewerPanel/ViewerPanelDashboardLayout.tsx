import { SidebarProvider } from "@/components/ui/sidebar";
import ViewerPanelSidebar from "./ViewerPanelSidebar";
import ViewerPanelHeader from "./ViewerPanelDashboardHeader";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "./ViewerPanelDashboardHeaderContext";

const ViewerPanelDashboardLayout = () => {
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
        <ViewerPanelSidebar />
        <main className="w-full px-8">
          <div className="pb-6">
            <ViewerPanelHeader />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </HeaderProvider>
  );
};

export default ViewerPanelDashboardLayout;