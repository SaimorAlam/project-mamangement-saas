import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import ClientDashboardHeader from "./ClientDashboardHeader";
import ClientSidebar from "./ClientSidebar";

export default function ClientDashboardLayout() {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "296px",
          } as React.CSSProperties
        }
      >
        <ClientSidebar />
        <main className="w-full px-8">
          <div className="pb-6">
            <ClientDashboardHeader name="Timo" />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
